import { Command } from '../model/command.model';
import { PaperRange } from '../model/paper-range.model';
import { insertCommands, truncateCommands } from '../repositories/command.repository';
import { getPerformanceHistory as getPerformanceHistoryFromRepo, updateProgress } from '../repositories/progress.repository';
import { v4 as uuidv4 } from 'uuid';
import { daysSinceEpoch } from '../utils/datetime';
import { PolynomialRegression } from 'ml-regression-polynomial';

export const saveCommands = async (paperRanges: PaperRange[],
  traceparent: string | undefined,
  correlationid: string | undefined) => {

  if (paperRanges.length > 0) {
    let start = Date.now();
    const referenceDate = daysSinceEpoch();
    await updateProgress({
      pending: paperRanges.length,
      running: 0, processed: 0, failed: 0,
      start, end: start,
      expected: paperRanges.length
    });

    let commands = paperRanges.map((range) => {
      const message: Command = {
        commandId: uuidv4(),
        initialEntity: range.initialEntity,
        finalEntity: range.finalEntity,
        referenceDate,
        traceparent,
        correlationid
      }
      return message;
    });
    await truncateCommands();
    await insertCommands(commands);
  }
}

export const getPerformanceHistory = async () => {
  const history = await getPerformanceHistoryFromRepo();

  const data: any[] = [];

  for (const [index, { id, values }] of history.entries()) {
    if (values.length < 5) continue;

    const sorted = [...values].sort((a, b) => a - b);

    const min = sorted[0];
    const q1 = quantile(sorted, 0.25);
    const median = quantile(sorted, 0.5);
    const q3 = quantile(sorted, 0.75);
    const max = sorted[sorted.length - 1];

    data.push({
      x: `${id}`,
      y: [min, q1, median, q3, max]
    });
  }

  return data;
};

const quantile = (arr: number[], q: number) => {
  const pos = (arr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (arr[base + 1] !== undefined) {
    return arr[base] + rest * (arr[base + 1] - arr[base]);
  } else {
    return arr[base];
  }
}


export const determineBestPerformanceWithAI = async () => {
  const performanceData = await getPerformanceHistory();

  if (performanceData.length < 3) {
    return { bestObserved: "Dados insuficientes", aiSuggestion: "Dados insuficientes para Regressão Polinomial (Grau 2)" };
  }

  const X_lotes: number[] = [];
  const Y_medianas: number[] = [];
  
  // Inicializa com a primeira categoria. Assume que 'x' e 'y' existem.
  let bestObservedCategory = performanceData[0].x; 
  let minMedian = performanceData[0].y[2]; 
  
  // Limite para o treinamento: Focamos na região de interesse [100, 400]
  const MAX_LOTES_FOR_TRAINING = 500; 

  for (const item of performanceData) {
    const lotes = parseFloat(item.x);
    const mediana = item.y[2]; // Mediana está no índice 2

    if (!isNaN(lotes) && !isNaN(mediana)) {

      // FILTRAGEM: Apenas inclua dados na região de otimização para TREINAMENTO
      if (lotes <= MAX_LOTES_FOR_TRAINING) {
        X_lotes.push(lotes);
        Y_medianas.push(mediana);
      }

      // Determina a melhor categoria OBSERVED (menor tempo mediano)
      // Esta busca utiliza TODOS os dados, incluindo a mediana de 2000
      if (mediana < minMedian) {
        minMedian = mediana;
        bestObservedCategory = item.x;
      }
    }
  }

  try {
    // 3. Treinamento: Regressão Polinomial de Grau 2 (ax² + bx + c)
    const regression = new PolynomialRegression(X_lotes, Y_medianas, 2);

    // Coeficientes: [c, b, a]
    const coefficients = regression.coefficients;
    const a = coefficients[2];
    const b = coefficients[1];

    // 4. Decisão do IA: Cálculo do Ponto de Mínimo Teórico (x_ótimo = -b / 2a)
    let aiSuggestion: number | string = "Heurística Aplicada"; // Valor padrão para a heurística

    if (a > 0) { // Garante que é um ponto de mínimo (forma de 'U')
      const x_otimo_teorico = -b / (2 * a);

      // Garante que o ótimo teórico está em uma faixa razoável (ex: entre 100 e 300)
      if (x_otimo_teorico > 100 && x_otimo_teorico < MAX_LOTES_FOR_TRAINING) { 
          // Sugestão é o valor inteiro mais próximo
          aiSuggestion = Math.round(x_otimo_teorico);
      } else {
          // Ótimo teórico calculado, mas fora da faixa de interesse (ex: 700)
          aiSuggestion = `${Math.round(x_otimo_teorico)}`;
      }
    } 
    // ** HEURÍSTICA ADICIONADA (APLICADA QUANDO 'a' NÃO É POSITIVO) **
    else { 
        // Se a regressão de Grau 2 falhou em modelar o vale, sugerimos um refinamento
        const currentBest = parseFloat(bestObservedCategory);
        // Sugerir um teste ligeiramente menor que o melhor atual (ex: 5% menor)
        const refinedTest = Math.round(currentBest * 0.95);
        
        // Garante que a sugestão de refinamento não é um valor já testado
        if (X_lotes.includes(refinedTest)) {
             aiSuggestion = `${currentBest - 10}`;
        } else {
            aiSuggestion = `${refinedTest}`;
        }
    }

    return {
      bestParam: bestObservedCategory,
      suggestion: aiSuggestion
    };

  } catch (error) {
    // @ts-ignore
    console.error("Erro ao realizar a regressão:", error.message);
    return {
      bestObserved: bestObservedCategory,
      aiSuggestion: "Erro no treinamento do modelo de regressão"
    };
  }
}
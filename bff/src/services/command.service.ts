import { Command } from '../model/command.model';
import { PaperRange } from '../model/paper-range.model';
import { insertCommands, truncateCommands } from '../repositories/command.repository';
import { getPerformanceHistory as getPerformanceHistoryFromRepo, updateProgress } from '../repositories/progress.repository';
import { v4 as uuidv4 } from 'uuid';
import { daysSinceEpoch } from '../utils/datetime';

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
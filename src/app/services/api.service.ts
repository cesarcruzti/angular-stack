import { Injectable, signal, Signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, EMPTY, tap, expand } from 'rxjs';
import { PaperRangeResponse } from '../model/paper-range-response.model';
import { PaperRange } from '../model/paper-range.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public readonly paperRangesSignal = signal<PaperRange[]>([]);
  
  constructor(private http: HttpClient) {}
  
  /**
   * Busca todas as faixas de papers da API, lidando com a paginação automaticamente.
   * @param rangeSize O tamanho de cada faixa de papers.
   * @param pageSize O tamanho da página.
   */
  fetchAllPaperRanges(rangeSize: number, pageSize: number = 10000): void {
    let currentPage = 0;
    this.paperRangesSignal.set([]);
    
    const fetchPage = (pageNumber: number): Observable<any> => {
      let params = new HttpParams()
        .set('rangeSize', rangeSize.toString())
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString());

      return this.http.get<PaperRangeResponse>(
        'api/paper/ranges',
        { params, observe: 'response' }
      ).pipe(
        tap(response => {
          const hasNext = response.headers.get('X-Has-Next') === 'true';
          if (hasNext) {
            currentPage++;
          }
        }),
        catchError(error => {
          console.error('Error fetching paper ranges:', error);
          return EMPTY; 
        })
      );
    };

    fetchPage(currentPage).pipe(
      expand(response => {
        const hasNext = response.headers.get('X-Has-Next') === 'true';
        return hasNext ? fetchPage(currentPage) : EMPTY;
      })
    ).subscribe(response => {
      this.paperRangesSignal.update(prev => [...prev, ...response.body.data]);
    });
  }
}
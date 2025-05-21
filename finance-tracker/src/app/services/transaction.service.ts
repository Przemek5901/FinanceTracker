import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../models/Transaction';
import { Observable } from 'rxjs';
import { Summary } from '../models/Summary';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/addTransaction`,
      transaction
    );

    return this.http.post<Transaction>(
      `${this.apiUrl}/addTransaction`,
      transaction
    );
  }

  getRecentTransactions(): Observable<Transaction[]> {
    // return this.http.get<Transaction[]>(`${this.apiUrl}/recentTransactions`);
    return this.http.get<Transaction[]>(
      'http://localhost:3000/api/recentTransactions'
    );
  }

  getSummary(): Observable<Summary> {
    // return this.http.get<Summary>(`${this.apiUrl}/summary`);
    return this.http.get<Summary>('http://localhost:3000/api/summary');
  }

  getMonthlyReports(): Observable<{ income: number; expense: number }[]> {
    // return this.http.get<{ income: number; expense: number }[]>(
    //   `${this.apiUrl}/monthlyReports`
    // );

    return this.http.get<{ income: number; expense: number }[]>(
      'http://localhost:3000/api/monthlyReports'
    );
  }
}

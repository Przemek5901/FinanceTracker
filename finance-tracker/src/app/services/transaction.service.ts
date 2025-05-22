import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../models/Transaction';
import { Observable } from 'rxjs';
import { Summary } from '../models/Summary';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `http://localhost:3000/api/addTransaction`,
      transaction
    );
  }

  getRecentTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      'http://localhost:3000/api/recentTransactions'
    );
  }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>('http://localhost:3000/api/summary');
  }

  getMonthlyReports(): Observable<{ income: number; expense: number }[]> {
    return this.http.get<{ income: number; expense: number }[]>(
      'http://localhost:3000/api/monthlyReports'
    );
  }
}

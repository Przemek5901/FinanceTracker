import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { combineLatest, forkJoin, Subject, takeUntil } from 'rxjs';
import { Transaction } from '../models/Transaction';
import { Summary } from '../models/Summary';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  transactions: Transaction[] = [];
  summary!: Summary;

  constructor(
    private transactionService: TransactionService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    forkJoin([
      this.transactionService.getSummary(),
      this.transactionService.getRecentTransactions(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([summary, transactions]) => {
          this.transactions = transactions;
          this.summary = summary;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}

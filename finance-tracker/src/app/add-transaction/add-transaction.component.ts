import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/transaction.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
})
export class AddTransactionComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  form: Transaction = {
    category: '',
    amount: 0,
    type: 'expense',
    note: '',
  };

  message = '';

  constructor(
    private transactionService: TransactionService,
    private toastr: ToastrService
  ) {}

  submitTransaction() {
    this.transactionService
      .addTransaction(this.form)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.respondToSumbitTransaction(),
        error: () => this.handleError(),
      });
  }

  respondToSumbitTransaction(): void {
    this.toastr.success('Pomyślnie dodano transakcję!');
    this.form.amount = 0;
    this.form.category = '';
    this.form.amount = 0;
    this.form.note = '';
  }

  handleError() {
    this.toastr.error('Wystąpił błąd, skontaktuj się z administratorem');
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}

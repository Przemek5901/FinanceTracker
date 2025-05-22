import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionService } from '../services/transaction.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit, OnDestroy {
  private destroys$ = new Subject<void>();
  incomes: number[] = [];
  expenses: number[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  selectedMonth: number | null = null;

  barChartType: ChartType = 'bar';
  barChartLabels: string[] = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
  ];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      {
        label: 'Przychody',
        backgroundColor: '#007f5f',
        data: [],
      },
      {
        label: 'Wydatki',
        backgroundColor: 'red',
        data: [],
      },
    ],
  };

  constructor(
    private transactionService: TransactionService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchChartData();
  }

  fetchChartData(): void {
    this.transactionService
      .getMonthlyReports()
      .pipe(takeUntil(this.destroys$))
      .subscribe((res) => {
        this.setChartData(res);
      });
  }

  setChartData(data: { income: number; expense: number }[]): void {
    data.slice(0, 6).forEach((item) => {
      this.incomes.push(item.income);
      this.expenses.push(item.expense);
    });

    this.barChartData.datasets[0].data = this.incomes;
    this.barChartData.datasets[1].data = this.expenses;

    this.chart?.update();
  }

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  onChartClick(event: any) {
    const index = event?.active[0]?.index;
    if (index !== undefined) {
      this.selectedMonth = index;
    }
  }

  ngOnDestroy(): void {
    this.destroys$.next(undefined);
    this.destroys$.complete();
  }
}

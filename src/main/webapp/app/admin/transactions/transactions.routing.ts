import { Routes, RouterModule } from '@angular/router';
import { TransactionsComponent } from './transactions.component';

export const TRANSACTIONS_ROUTE: Routes =  [{
  path: '',
  component: TransactionsComponent,
  data: {
    authorities: [],
    pageTitle: 'routes.transactions.title'
  }
},
];

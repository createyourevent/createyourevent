import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'docs',
        loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule),
      },
      {
        path: 'configuration',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule),
      },
      {
        path: 'health',
        loadChildren: () => import('./health/health.module').then(m => m.HealthModule),
      },
      {
        path: 'logs',
        loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule),
      },
      {
        path: 'metrics',
        loadChildren: () => import('./metrics/metrics.module').then(m => m.MetricsModule),
      },
      {
        path: 'activate',
        loadChildren: () => import('./activate/activate.module').then(m => m.ActivateModule),
      },
      {
        path: 'admin-points',
        loadChildren: () => import('./admin-points/admin-points.module').then(m => m.AdminPointsModule),
      },
      {
        path: 'fees',
        loadChildren: () => import('./billing-tools/admin_fees/admin_fees.module').then(m => m.AdminFeesModule),
      },
      {
        path: 'organisatorbilling',
        loadChildren: () => import('./billing-tools/organisator/organisator_billing.module').then(m => m.OrganisatorBillingModule),
      },
      {
        path: 'supplierbilling',
        loadChildren: () => import('./billing-tools/supplier/suppllier_billing.module').then(m => m.SupplierBillingModule),
      },
      {
        path: 'servicebilling',
        loadChildren: () => import('./billing-tools/service/service_billing.module').then(m => m.ServiceBillingModule),
      },
      {
        path: 'tetris-admin',
        loadChildren: () => import('../views/games/tetris/admin-tetris/admin-tetris.module').then(m => m.AdminTetrisModule ),
      },
      {
        path: 'adminbonds',
        loadChildren: () => import('./admin-bonds/admin-bonds.module').then(m => m.AdminBondsModule),
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule),
      },
      {
        path: 'payitforward-admin',
        loadChildren: () => import('./pay-it-forward-admin/pay-it-forward-admin.module').then(m => m.PayItForwardAdminModule),
      },
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */

    ]),
  ],
})
export class AdminRoutingModule {}

import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PointsExchangeComponent } from './list/points-exchange.component';
import { PointsExchangeDetailComponent } from './detail/points-exchange-detail.component';
import { PointsExchangeUpdateComponent } from './update/points-exchange-update.component';
import { PointsExchangeDeleteDialogComponent } from './delete/points-exchange-delete-dialog.component';
import { PointsExchangeRoutingModule } from './route/points-exchange-routing.module';

@NgModule({
  imports: [SharedModule, PointsExchangeRoutingModule],
  declarations: [
    PointsExchangeComponent,
    PointsExchangeDetailComponent,
    PointsExchangeUpdateComponent,
    PointsExchangeDeleteDialogComponent,
  ],
})
export class PointsExchangeModule {}

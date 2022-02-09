import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'products',
        loadChildren: () => import('./product/product.module').then(m => m.CreateyoureventProductsModule)
      },
      {
        path: 'events',
        loadChildren: () => import('./event/event.module').then(m => m.CYEEventModule)
      },
      {
        path: 'shops',
        loadChildren: () => import('./shop/shop.module').then(m => m.CreateyoureventShopsModule)
      },
      {
        path: 'services',
        loadChildren: () => import('./service/service.module').then(m => m.CreateyoureventServicessModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  exports: []
})
export class CreateyoureventViewsModule {}

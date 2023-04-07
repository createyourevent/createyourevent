import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { shopRoute } from './shop.route';
import { ShopOverviewComponent } from './shop-overview.component';
import { ShopEditComponent } from './shop-edit.component';
import { ProductSliderModule } from 'app/views/boxes/product_slider/product_slider.module';
import { MatTabsModule } from '@angular/material/tabs';
import { CreateyoureventShopsModule } from 'app/views/shop/shop.module';
import { LikeDislikeModule } from 'app/views/ratings/like_dislike/like_dislike.module';
import { CommentBoxModule } from 'app/views/comment-box/comment-box.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { StarRatingModule } from 'app/views/ratings/starRating/starRating.module';
import { GMapModule } from 'primeng/gmap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ProductListModule } from 'app/views/boxes/productList/productList.module';
import { Mp3PlayerModule } from 'app/views/mp3-player/mp3-player.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(shopRoute),
    ProductSliderModule,
    MatTabsModule,
    CreateyoureventShopsModule,
    LikeDislikeModule,
    CommentBoxModule,
    GooglePlaceModule,
    QuillModule,
    TagInputModule,
    StarRatingModule,
    GMapModule,
    ProgressSpinnerModule,
    ToastModule,
    ProductListModule,
    Mp3PlayerModule,
  ],
  declarations: [ShopEditComponent, ShopOverviewComponent],
})
export class ShopModule {}

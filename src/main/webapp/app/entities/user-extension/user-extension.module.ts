import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserExtensionComponent } from './list/user-extension.component';
import { UserExtensionDetailComponent } from './detail/user-extension-detail.component';
import { UserExtensionUpdateComponent } from './update/user-extension-update.component';
import { UserExtensionDeleteDialogComponent } from './delete/user-extension-delete-dialog.component';
import { UserExtensionRoutingModule } from './route/user-extension-routing.module';

@NgModule({
  imports: [SharedModule, UserExtensionRoutingModule],
  declarations: [UserExtensionComponent, UserExtensionDetailComponent, UserExtensionUpdateComponent, UserExtensionDeleteDialogComponent],
})
export class UserExtensionModule {}

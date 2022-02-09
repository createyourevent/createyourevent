import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TagCloudComponent } from './tag-cloud.component';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { TagCloudService } from './tag-cloud.service';


export function tagCloudProviderFactory(provider: TagCloudService): Function{
  return (): Promise<any> => {
    return provider.load();
  }
}


@NgModule({
  imports: [SharedModule, TagCloudModule],
  declarations: [TagCloudComponent],
  exports: [TagCloudComponent],
  providers: [
    TagCloudService,
    { provide: APP_INITIALIZER, useFactory: tagCloudProviderFactory, deps: [TagCloudService], multi: true }
  ],
})
export class CYETagCloudModule {}

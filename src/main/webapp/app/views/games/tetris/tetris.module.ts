import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TetrisComponent } from './tetris.component';
import { SharedModule } from 'app/shared/shared.module';
import { TetrisCoreModule } from 'ngx-tetris';
import { AdminTetrisComponent } from './admin-tetris/admin-tetris.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TetrisRoutes } from './tetris.routing';
import {HotkeyModule} from 'angular2-hotkeys';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    SharedModule,
    TetrisCoreModule,
    TetrisRoutes,
    HotkeyModule.forRoot(),

  ],
  declarations: [TetrisComponent, AdminTetrisComponent]
})
export class TetrisModule { }

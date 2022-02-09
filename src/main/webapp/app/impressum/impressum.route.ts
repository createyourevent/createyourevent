import { Routes } from '@angular/router';
import { ImpressumComponent } from './impressum.component';


export const IMPRESSUM_ROUTE: Routes =  [{
  path: '',
  component: ImpressumComponent,
  data: {
    authorities: [],
    pageTitle: 'routes.impressum.title'
  }
},
];

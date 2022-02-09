import { Routes } from '@angular/router';
import { StreamComponent } from './stream.component';


export const STREAM_ROUTE: Routes =  [{
  path: '',
  component: StreamComponent,
  data: {
    authorities: [],
    pageTitle: 'routes.stream.title'
  }
},
];

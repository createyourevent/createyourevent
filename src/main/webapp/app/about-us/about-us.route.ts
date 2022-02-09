import { Routes } from '@angular/router';
import { AboutUsComponent } from './about-us.component';


export const ABOUT_US_ROUTE: Routes =  [{
  path: '',
  component: AboutUsComponent,
  data: {
    authorities: [],
    pageTitle: 'routes.about-us.title'
  } 
},
];

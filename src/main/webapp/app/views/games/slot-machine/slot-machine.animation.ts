import { trigger, state, style, animate, transition, group, keyframes } from '@angular/animations';
export const GeneratedStyles = {
  class: { 'slot-machine': style({ height: '480px', width: '600px' }) },
  Animations: {
    init: keyframes([style({ '-webkit-transform': 'rotateX(0)', offset: 0 }), style({ '-webkit-transform': 'rotateX(15deg)', offset: 1 })]),
    spin: keyframes([
      style({ '-webkit-transform': 'rotateX(0)', offset: 0 }),
      style({ '-webkit-transform': 'rotateX(360deg)', offset: 1 }),
    ]),
  },
};

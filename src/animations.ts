import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  state('void', style({ opacity: 0 })),
  transition(':enter', [
    animate('300ms ease-in', style({ opacity: 1 }))
  ])
]);

export const slideIn = trigger('slideIn', [
  state('void', style({ transform: 'translateY(20px)', opacity: 0 })),
  transition(':enter', [
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);
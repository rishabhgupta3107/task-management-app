import { Component } from '@angular/core';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeFade', [
      transition('* => *', [
        query(':enter', [style({ opacity: 0 })], { optional: true }),
        group([
          query(
            ':enter',
            [animate('320ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1 })), animateChild()],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'HELM';

  routeKey(outlet: RouterOutlet): string {
    return outlet && outlet.isActivated ? outlet.activatedRoute.snapshot.routeConfig?.path ?? '' : '';
  }
}

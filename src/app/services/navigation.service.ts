import { Injectable, signal } from '@angular/core';

export type Screen = 'menu' | 'settings' | 'play';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly screen = signal<Screen>('menu');

  go(screen: Screen): void {
    this.screen.set(screen);
  }
}

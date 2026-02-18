import { Component, inject } from '@angular/core';
import { NavigationService } from './services/navigation.service';
import { StartMenuComponent } from './components/start-menu/start-menu.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { GameScreenComponent } from './components/game-screen/game-screen.component';

@Component({
  selector: 'app-root',
  imports: [StartMenuComponent, GameSettingsComponent, GameScreenComponent],
  template: `
    @switch (nav.screen()) {
      @case ('menu') { <app-start-menu /> }
      @case ('settings') { <app-game-settings /> }
      @case ('play') { <app-game-screen /> }
    }
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `],
})
export class App {
  nav = inject(NavigationService);
}

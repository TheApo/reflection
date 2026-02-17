import { Routes } from '@angular/router';
import { StartMenuComponent } from './components/start-menu/start-menu.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { GameScreenComponent } from './components/game-screen/game-screen.component';

export const routes: Routes = [
  { path: '', component: StartMenuComponent },
  { path: 'settings', component: GameSettingsComponent },
  { path: 'play', component: GameScreenComponent },
  { path: '**', redirectTo: '' },
];

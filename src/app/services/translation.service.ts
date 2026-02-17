import { Injectable, signal, computed } from '@angular/core';
import { GameObjectType } from '../models/game-object.model';

export type Lang = 'en' | 'de';

interface Translations {
  // Start menu
  title: string;
  subtitle: string;
  play: string;
  howToPlay: string;
  introDesc: string;
  mirrors45: string;
  mirrors45Desc: string;
  oneWayMirrors: string;
  oneWayMirrorsDesc: string;
  block: string;
  blockDesc: string;
  triangles: string;
  trianglesDesc: string;
  absorber: string;
  absorberDesc: string;
  legendGreen: string;
  legendYellow: string;
  legendGray: string;

  // Game settings
  gameSetup: string;
  gridSize: string;
  optionalObjects: string;
  objectCounts: string;
  totalObjects: string;
  generating: string;
  startGame: string;
  minObjectsError: string;

  // Game screen
  menu: string;
  solved: string;
  congratulations: string;
  victoryHint: string;
  newLevel: string;
  mainMenu: string;

  // Object labels
  objectLabels: Record<GameObjectType, string>;
}

const EN: Translations = {
  title: 'Reflection',
  subtitle: 'A Light Puzzle Game',
  play: 'Play',
  howToPlay: 'How to Play',
  introDesc: 'Place objects on the grid so that light rays match the numbers on the edges.',
  mirrors45: '45\u00B0 Mirrors',
  mirrors45Desc: 'Deflect light at 90\u00B0',
  oneWayMirrors: 'One-Way Mirrors',
  oneWayMirrorsDesc: 'Pass through one axis, reflect 180\u00B0 on the other',
  block: 'Block',
  blockDesc: 'Reflects light 180\u00B0 from any direction',
  triangles: 'Triangles',
  trianglesDesc: 'Reflect from 2 sides, pass through from 2 sides',
  absorber: 'Absorber',
  absorberDesc: 'Absorbs light completely',
  legendGreen: 'Light passes through (exits elsewhere)',
  legendYellow: 'Light reflects back (exits at entry)',
  legendGray: 'Light is absorbed',

  gameSetup: 'Game Setup',
  gridSize: 'Grid Size',
  optionalObjects: 'Optional Objects',
  objectCounts: 'Object Counts',
  totalObjects: 'Total objects',
  generating: 'Generating...',
  startGame: 'Start Game',
  minObjectsError: 'At least {0} objects required for a {1}\u00D7{1} grid.',

  menu: 'Menu',
  solved: 'Solved!',
  congratulations: 'Congratulations!',
  victoryHint: 'Click on the clues to see the light rays.',
  newLevel: 'New Level',
  mainMenu: 'Main Menu',

  objectLabels: {
    [GameObjectType.Mirror45CW]: 'Mirror \\',
    [GameObjectType.Mirror45CCW]: 'Mirror /',
    [GameObjectType.OneWayVertical]: 'One-Way ||',
    [GameObjectType.OneWayHorizontal]: 'One-Way =',
    [GameObjectType.Block]: 'Block',
    [GameObjectType.TriangleBL]: 'Triangle \u25E3',
    [GameObjectType.TriangleBR]: 'Triangle \u25E2',
    [GameObjectType.TriangleTL]: 'Triangle \u25E4',
    [GameObjectType.TriangleTR]: 'Triangle \u25E5',
    [GameObjectType.Absorber]: 'Absorber',
  },
};

const DE: Translations = {
  title: 'Reflection',
  subtitle: 'Ein Licht-Puzzle-Spiel',
  play: 'Spielen',
  howToPlay: 'Spielanleitung',
  introDesc: 'Platziere Objekte auf dem Gitter, sodass die Lichtstrahlen zu den Zahlen am Rand passen.',
  mirrors45: '45\u00B0-Spiegel',
  mirrors45Desc: 'Lenken Licht um 90\u00B0 ab',
  oneWayMirrors: 'Einweg-Spiegel',
  oneWayMirrorsDesc: 'Lassen Licht auf einer Achse durch, reflektieren 180\u00B0 auf der anderen',
  block: 'Block',
  blockDesc: 'Reflektiert Licht 180\u00B0 aus jeder Richtung',
  triangles: 'Dreiecke',
  trianglesDesc: 'Reflektieren von 2 Seiten, durchl\u00E4ssig von 2 Seiten',
  absorber: 'Absorber',
  absorberDesc: 'Absorbiert Licht vollst\u00E4ndig',
  legendGreen: 'Licht geht durch (kommt woanders raus)',
  legendYellow: 'Licht wird zur\u00FCckreflektiert (kommt am Eingang raus)',
  legendGray: 'Licht wird absorbiert',

  gameSetup: 'Spieleinstellungen',
  gridSize: 'Gittergr\u00F6\u00DFe',
  optionalObjects: 'Optionale Objekte',
  objectCounts: 'Objektanzahl',
  totalObjects: 'Objekte gesamt',
  generating: 'Wird generiert...',
  startGame: 'Spiel starten',
  minObjectsError: 'Mindestens {0} Objekte f\u00FCr ein {1}\u00D7{1} Gitter erforderlich.',

  menu: 'Men\u00FC',
  solved: 'Gel\u00F6st!',
  congratulations: 'Herzlichen Gl\u00FCckwunsch!',
  victoryHint: 'Klicke auf die Hinweise, um die Lichtstrahlen zu sehen.',
  newLevel: 'Neues Level',
  mainMenu: 'Hauptmen\u00FC',

  objectLabels: {
    [GameObjectType.Mirror45CW]: 'Spiegel \\',
    [GameObjectType.Mirror45CCW]: 'Spiegel /',
    [GameObjectType.OneWayVertical]: 'Einweg ||',
    [GameObjectType.OneWayHorizontal]: 'Einweg =',
    [GameObjectType.Block]: 'Block',
    [GameObjectType.TriangleBL]: 'Dreieck \u25E3',
    [GameObjectType.TriangleBR]: 'Dreieck \u25E2',
    [GameObjectType.TriangleTL]: 'Dreieck \u25E4',
    [GameObjectType.TriangleTR]: 'Dreieck \u25E5',
    [GameObjectType.Absorber]: 'Absorber',
  },
};

const LANG_MAP: Record<Lang, Translations> = { en: EN, de: DE };

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly lang = signal<Lang>('en');
  readonly t = computed(() => LANG_MAP[this.lang()]);

  toggleLang(): void {
    this.lang.set(this.lang() === 'en' ? 'de' : 'en');
  }
}

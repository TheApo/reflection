import { Grid } from './cell.model';
import { EdgeClue } from './clue.model';
import { GameObjectType } from './game-object.model';

export interface GameSettings {
  gridSize: number;
  enableBlock: boolean;
  enableTriangle: boolean;
  enableAbsorber: boolean;
  objectCounts: Partial<Record<GameObjectType, number>>;
}

export interface PuzzleDef {
  gridSize: number;
  solution: Grid;
  clues: EdgeClue[];
  objectInventory: Record<string, number>;
}

export function getDefaultSettings(): GameSettings {
  return {
    gridSize: 8,
    enableBlock: true,
    enableTriangle: false,
    enableAbsorber: true,
    objectCounts: {},
  };
}

export function getDefaultObjectCounts(gridSize: number, enableBlock: boolean, enableTriangle: boolean, enableAbsorber: boolean): Record<GameObjectType, number> {
  const base = Math.max(1, Math.floor(gridSize / 3));
  return {
    [GameObjectType.Mirror45CW]: Math.max(2, base + 1),
    [GameObjectType.Mirror45CCW]: Math.max(2, base + 1),
    [GameObjectType.OneWayVertical]: 1,
    [GameObjectType.OneWayHorizontal]: 1,
    [GameObjectType.Block]: enableBlock ? Math.max(1, Math.floor(base / 2)) : 0,
    [GameObjectType.TriangleBL]: enableTriangle ? 1 : 0,
    [GameObjectType.TriangleBR]: enableTriangle ? 1 : 0,
    [GameObjectType.TriangleTL]: enableTriangle ? 1 : 0,
    [GameObjectType.TriangleTR]: enableTriangle ? 1 : 0,
    [GameObjectType.Absorber]: enableAbsorber ? Math.max(1, Math.floor(base / 2)) : 0,
  };
}

import { GameObjectType } from './game-object.model';

export interface CellPosition {
  row: number;
  col: number;
}

export type Grid = (GameObjectType | null)[][];

export function createEmptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}

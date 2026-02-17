export enum Direction {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export const DIRECTIONS = [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left] as const;

export function oppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case Direction.Top: return Direction.Bottom;
    case Direction.Bottom: return Direction.Top;
    case Direction.Left: return Direction.Right;
    case Direction.Right: return Direction.Left;
  }
}

export function directionDelta(dir: Direction): { dr: number; dc: number } {
  switch (dir) {
    case Direction.Top: return { dr: -1, dc: 0 };
    case Direction.Bottom: return { dr: 1, dc: 0 };
    case Direction.Left: return { dr: 0, dc: -1 };
    case Direction.Right: return { dr: 0, dc: 1 };
  }
}

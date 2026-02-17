import { Direction } from './direction.model';

export enum GameObjectType {
  Mirror45CW = 'mirror45cw',
  Mirror45CCW = 'mirror45ccw',
  OneWayVertical = 'onewayV',
  OneWayHorizontal = 'onewayH',
  Block = 'block',
  TriangleBL = 'triangleBL',
  TriangleBR = 'triangleBR',
  TriangleTL = 'triangleTL',
  TriangleTR = 'triangleTR',
  Absorber = 'absorber',
}

export enum OptionalObjectCategory {
  Block = 'block',
  Triangle = 'triangle',
  Absorber = 'absorber',
}

export const OBJECT_LABELS: Record<GameObjectType, string> = {
  [GameObjectType.Mirror45CW]: 'Spiegel \\',
  [GameObjectType.Mirror45CCW]: 'Spiegel /',
  [GameObjectType.OneWayVertical]: 'Einweg ||',
  [GameObjectType.OneWayHorizontal]: 'Einweg =',
  [GameObjectType.Block]: 'Block',
  [GameObjectType.TriangleBL]: 'Dreieck ◣',
  [GameObjectType.TriangleBR]: 'Dreieck ◢',
  [GameObjectType.TriangleTL]: 'Dreieck ◤',
  [GameObjectType.TriangleTR]: 'Dreieck ◥',
  [GameObjectType.Absorber]: 'Absorber',
};

export const ALWAYS_ENABLED_TYPES: GameObjectType[] = [
  GameObjectType.Mirror45CW,
  GameObjectType.Mirror45CCW,
  GameObjectType.OneWayVertical,
  GameObjectType.OneWayHorizontal,
];

export const BLOCK_TYPES: GameObjectType[] = [GameObjectType.Block];
export const TRIANGLE_TYPES: GameObjectType[] = [
  GameObjectType.TriangleBL,
  GameObjectType.TriangleBR,
  GameObjectType.TriangleTL,
  GameObjectType.TriangleTR,
];
export const ABSORBER_TYPES: GameObjectType[] = [GameObjectType.Absorber];

/**
 * Given a traveling direction, returns the new direction after interacting with the object.
 * Returns null if the light is absorbed.
 */
export function applyObject(type: GameObjectType, travelDir: Direction): Direction | null {
  const D = Direction;
  switch (type) {
    case GameObjectType.Mirror45CW: // backslash \
      return ({ [D.Right]: D.Bottom, [D.Bottom]: D.Right, [D.Left]: D.Top, [D.Top]: D.Left } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.Mirror45CCW: // forward slash /
      return ({ [D.Right]: D.Top, [D.Top]: D.Right, [D.Left]: D.Bottom, [D.Bottom]: D.Left } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.OneWayVertical: // || - vertical passes through, horizontal reflects 180°
      return ({ [D.Top]: D.Top, [D.Bottom]: D.Bottom, [D.Right]: D.Left, [D.Left]: D.Right } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.OneWayHorizontal: // = - horizontal passes through, vertical reflects 180°
      return ({ [D.Right]: D.Right, [D.Left]: D.Left, [D.Top]: D.Bottom, [D.Bottom]: D.Top } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.Block: // reflects 180° from any direction
      return ({ [D.Top]: D.Bottom, [D.Bottom]: D.Top, [D.Left]: D.Right, [D.Right]: D.Left } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.TriangleBL: // ◣ legs: left+bottom, hypotenuse like \
      // Right enters from left (leg) → 180° back; Top enters from bottom (leg) → 180° back
      // Left enters from right (open) → hypotenuse \ → Top; Bottom enters from top (open) → hypotenuse \ → Right
      return ({ [D.Right]: D.Left, [D.Top]: D.Bottom, [D.Left]: D.Top, [D.Bottom]: D.Right } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.TriangleBR: // ◢ legs: right+bottom, hypotenuse like /
      // Left enters from right (leg) → 180° back; Top enters from bottom (leg) → 180° back
      // Right enters from left (open) → hypotenuse / → Top; Bottom enters from top (open) → hypotenuse / → Left
      return ({ [D.Right]: D.Top, [D.Left]: D.Right, [D.Bottom]: D.Left, [D.Top]: D.Bottom } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.TriangleTL: // ◤ legs: left+top, hypotenuse like /
      // Right enters from left (leg) → 180° back; Bottom enters from top (leg) → 180° back
      // Left enters from right (open) → hypotenuse / → Bottom; Top enters from bottom (open) → hypotenuse / → Right
      return ({ [D.Right]: D.Left, [D.Bottom]: D.Top, [D.Left]: D.Bottom, [D.Top]: D.Right } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.TriangleTR: // ◥ legs: right+top, hypotenuse like \
      // Left enters from right (leg) → 180° back; Bottom enters from top (leg) → 180° back
      // Right enters from left (open) → hypotenuse \ → Bottom; Top enters from bottom (open) → hypotenuse \ → Left
      return ({ [D.Right]: D.Bottom, [D.Left]: D.Right, [D.Bottom]: D.Top, [D.Top]: D.Left } as Record<Direction, Direction>)[travelDir];

    case GameObjectType.Absorber:
      return null;
  }
}

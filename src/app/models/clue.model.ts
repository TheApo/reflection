export enum ClueStatus {
  Green = 'green',
  Yellow = 'yellow',
  Gray = 'gray',
}

export enum EdgeSide {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export interface EdgeClue {
  side: EdgeSide;
  index: number;
  distance: number;
  status: ClueStatus;
  isCorrect: boolean;
  // For green clues: where the light exits (the paired clue)
  exitSide?: EdgeSide;
  exitIndex?: number;
}

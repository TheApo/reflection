import { Component, input, output, computed, signal } from '@angular/core';
import { Grid } from '../../models/cell.model';
import { EdgeClue, EdgeSide } from '../../models/clue.model';
import { GameObjectType } from '../../models/game-object.model';
import { TraceResult } from '../../models/light-ray.model';
import { BoardCellComponent } from '../board-cell/board-cell.component';
import { EdgeClueComponent } from '../edge-clue/edge-clue.component';
import { LightPathComponent } from '../light-path/light-path.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [BoardCellComponent, EdgeClueComponent, LightPathComponent],
  template: `
    <svg
      [attr.viewBox]="viewBox()"
      preserveAspectRatio="xMidYMid meet"
      class="game-board"
      xmlns="http://www.w3.org/2000/svg"
      (mouseleave)="clearHover()">

      <!-- Definitions -->
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.04" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Grid background -->
      <rect
        x="-0.02" y="-0.02"
        [attr.width]="gridSize() + 0.04"
        [attr.height]="gridSize() + 0.04"
        rx="0.1"
        fill="#0e1628"
        stroke="#1e2d4a"
        stroke-width="0.04" />

      <!-- Grid cells -->
      @for (row of rows(); track row) {
        @for (col of cols(); track col) {
          <g appBoardCell
             [attr.transform]="'translate(' + col + ',' + row + ')'"
             [cellContent]="playerGrid()[row][col]"
             [ghostType]="getGhost(row, col)"
             (cellClick)="onCellClick(row, col)"
             (cellHover)="onCellHover(row, col, $event)" />
        }
      }

      <!-- Edge clues - Top -->
      @for (clue of topClues(); track clue.index) {
        <g appEdgeClue
           [attr.transform]="'translate(' + clue.index + ',' + (-1) + ')'"
           [clue]="clue"
           [gridSize]="gridSize()"
           [isActive]="isClueActive(clue)"
           [currentDistance]="isClueActive(clue) ? activeTrace()?.totalDistance ?? null : null"
           [currentStatus]="isClueActive(clue) ? activeTrace()?.status ?? null : null"
           (clueClick)="onClueClick(clue)" />
      }

      <!-- Edge clues - Bottom -->
      @for (clue of bottomClues(); track clue.index) {
        <g appEdgeClue
           [attr.transform]="'translate(' + clue.index + ',' + gridSize() + ')'"
           [clue]="clue"
           [gridSize]="gridSize()"
           [isActive]="isClueActive(clue)"
           [currentDistance]="isClueActive(clue) ? activeTrace()?.totalDistance ?? null : null"
           [currentStatus]="isClueActive(clue) ? activeTrace()?.status ?? null : null"
           (clueClick)="onClueClick(clue)" />
      }

      <!-- Edge clues - Left -->
      @for (clue of leftClues(); track clue.index) {
        <g appEdgeClue
           [attr.transform]="'translate(' + (-1) + ',' + clue.index + ')'"
           [clue]="clue"
           [gridSize]="gridSize()"
           [isActive]="isClueActive(clue)"
           [currentDistance]="isClueActive(clue) ? activeTrace()?.totalDistance ?? null : null"
           [currentStatus]="isClueActive(clue) ? activeTrace()?.status ?? null : null"
           (clueClick)="onClueClick(clue)" />
      }

      <!-- Edge clues - Right -->
      @for (clue of rightClues(); track clue.index) {
        <g appEdgeClue
           [attr.transform]="'translate(' + gridSize() + ',' + clue.index + ')'"
           [clue]="clue"
           [gridSize]="gridSize()"
           [isActive]="isClueActive(clue)"
           [currentDistance]="isClueActive(clue) ? activeTrace()?.totalDistance ?? null : null"
           [currentStatus]="isClueActive(clue) ? activeTrace()?.status ?? null : null"
           (clueClick)="onClueClick(clue)" />
      }

      <!-- Light path -->
      @if (activeTrace()) {
        <g appLightPath [trace]="activeTrace()!" [gridSize]="gridSize()" />
      }
    </svg>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .game-board {
      width: 100%;
      height: 100%;
      display: block;
    }
  `],
})
export class GameBoardComponent {
  gridSize = input.required<number>();
  playerGrid = input.required<Grid>();
  clues = input.required<EdgeClue[]>();
  activeTrace = input<TraceResult | null>(null);
  activeClueIndex = input<{ side: EdgeSide; index: number } | null>(null);
  selectedObject = input<GameObjectType | null>(null);
  remainingCount = input<number>(0);

  cellClicked = output<{ row: number; col: number }>();
  clueClicked = output<{ side: EdgeSide; index: number }>();

  hoveredCell = signal<{ row: number; col: number } | null>(null);

  viewBox = computed(() => {
    const n = this.gridSize();
    return `${-1.1} ${-1.1} ${n + 2.2} ${n + 2.2}`;
  });

  rows = computed(() => Array.from({ length: this.gridSize() }, (_, i) => i));
  cols = computed(() => Array.from({ length: this.gridSize() }, (_, i) => i));

  topClues = computed(() => this.clues().filter(c => c.side === EdgeSide.Top));
  bottomClues = computed(() => this.clues().filter(c => c.side === EdgeSide.Bottom));
  leftClues = computed(() => this.clues().filter(c => c.side === EdgeSide.Left));
  rightClues = computed(() => this.clues().filter(c => c.side === EdgeSide.Right));

  isClueActive(clue: EdgeClue): boolean {
    const active = this.activeClueIndex();
    return !!active && active.side === clue.side && active.index === clue.index;
  }

  getGhost(row: number, col: number): GameObjectType | null {
    const hovered = this.hoveredCell();
    const selected = this.selectedObject();
    if (!hovered || !selected) return null;
    if (hovered.row !== row || hovered.col !== col) return null;
    if (this.remainingCount() <= 0) return null;
    return selected;
  }

  onCellClick(row: number, col: number): void {
    this.cellClicked.emit({ row, col });
  }

  onCellHover(row: number, col: number, isEnter: boolean): void {
    if (isEnter) {
      this.hoveredCell.set({ row, col });
    } else {
      const current = this.hoveredCell();
      if (current && current.row === row && current.col === col) {
        this.hoveredCell.set(null);
      }
    }
  }

  clearHover(): void {
    this.hoveredCell.set(null);
  }

  onClueClick(clue: EdgeClue): void {
    this.clueClicked.emit({ side: clue.side, index: clue.index });
  }
}

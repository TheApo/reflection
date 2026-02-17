import { Component, inject, computed, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { GameObjectType } from '../../models/game-object.model';
import { GameStateService } from '../../services/game-state.service';
import { GameBoardComponent } from '../game-board/game-board.component';
import { ObjectPaletteComponent } from '../object-palette/object-palette.component';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  imports: [GameBoardComponent, ObjectPaletteComponent],
  template: `
    <div class="game-screen">
      <!-- Top bar -->
      <div class="top-bar">
        <button class="back-btn" (click)="goBack()">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Menu
        </button>

        @if (gameState.isSolved()) {
          <div class="solved-badge">Solved!</div>
        }
      </div>

      <!-- Game board -->
      <div class="board-container">
        @if (gameState.puzzle()) {
          <app-game-board
            [gridSize]="gameState.puzzle()!.gridSize"
            [playerGrid]="gameState.playerGrid()"
            [clues]="gameState.currentClues()"
            [activeTrace]="gameState.activeClueTrace()"
            [activeClueIndex]="gameState.activeClueIndex()"
            [selectedObject]="gameState.selectedObject()"
            [remainingCount]="selectedRemainingCount()"
            (cellClicked)="onCellClick($event)"
            (clueClicked)="onClueClick($event)" />
        }
      </div>

      <!-- Object palette -->
      <app-object-palette
        [items]="paletteItems()"
        [selectedObject]="gameState.selectedObject()"
        (objectSelected)="onObjectSelected($event)" />
    </div>

    <!-- Victory overlay -->
    @if (gameState.isSolved()) {
      <div class="victory-overlay" (click)="goBack()">
        <div class="victory-content" (click)="$event.stopPropagation()">
          <div class="victory-icon">&#10003;</div>
          <h2>Puzzle Solved!</h2>
          <p>All light paths are correct.</p>
          <button class="play-again-btn" (click)="goBack()">Play Again</button>
        </div>
      </div>
    }
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .game-screen {
      display: flex;
      flex-direction: column;
      height: 100dvh;
      background: $color-bg-dark;
      overflow: hidden;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      flex-shrink: 0;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      color: $color-text;
      font-size: 0.9rem;
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .solved-badge {
      color: $color-accent;
      font-weight: 700;
      font-size: 1rem;
      animation: celebrate 0.6s ease-in-out infinite;
    }

    @keyframes celebrate {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .board-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
      min-height: 0;
      overflow: hidden;
    }

    .victory-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .victory-content {
      @include card;
      text-align: center;
      animation: scaleIn 0.3s ease;
      max-width: 320px;
      width: 90%;
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    .victory-icon {
      font-size: 3rem;
      color: $color-accent;
      margin-bottom: 8px;
    }

    .victory-content h2 {
      color: $color-accent;
      margin-bottom: 8px;
    }

    .victory-content p {
      color: $color-text-muted;
      margin-bottom: 16px;
    }

    .play-again-btn {
      @include glow-button($color-accent);
    }
  `],
})
export class GameScreenComponent implements OnInit {
  gameState = inject(GameStateService);
  private router = inject(Router);

  selectedRemainingCount = computed(() => {
    const selected = this.gameState.selectedObject();
    if (!selected) return 0;
    return this.gameState.remainingObjects()[selected] ?? 0;
  });

  private static readonly PALETTE_ORDER: GameObjectType[] = [
    GameObjectType.Mirror45CW,
    GameObjectType.Mirror45CCW,
    GameObjectType.OneWayVertical,
    GameObjectType.OneWayHorizontal,
    GameObjectType.Block,
    GameObjectType.Absorber,
    GameObjectType.TriangleBL,
    GameObjectType.TriangleBR,
    GameObjectType.TriangleTL,
    GameObjectType.TriangleTR,
  ];

  paletteItems = computed(() => {
    const remaining = this.gameState.remainingObjects();
    const puzzle = this.gameState.puzzle();
    return GameScreenComponent.PALETTE_ORDER
      .filter(type => puzzle && (puzzle.objectInventory[type] ?? 0) > 0)
      .map(type => ({
        type,
        count: remaining[type] ?? 0,
      }));
  });

  ngOnInit(): void {
    if (!this.gameState.puzzle()) {
      this.router.navigate(['/']);
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const items = this.paletteItems();
    const available = items.filter(i => i.count > 0);
    if (available.length === 0) return;

    const current = this.gameState.selectedObject();
    const currentIndex = current ? available.findIndex(i => i.type === current) : -1;
    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = currentIndex < 0
      ? (direction > 0 ? 0 : available.length - 1)
      : (currentIndex + direction + available.length) % available.length;

    this.gameState.selectObject(available[nextIndex].type);
  }

  onCellClick(event: { row: number; col: number }): void {
    this.gameState.handleCellClick(event.row, event.col);
  }

  onClueClick(event: { side: string; index: number }): void {
    this.gameState.traceClue(event.side as any, event.index);
  }

  onObjectSelected(type: GameObjectType): void {
    this.gameState.selectObject(type);
  }

  goBack(): void {
    this.router.navigate(['/settings']);
  }
}

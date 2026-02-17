import { Component, inject, computed, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { GameObjectType } from '../../models/game-object.model';
import { GameStateService } from '../../services/game-state.service';
import { TranslationService } from '../../services/translation.service';
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
          {{ i18n.t().menu }}
        </button>

        @if (gameState.isSolved()) {
          <div class="solved-badge">{{ i18n.t().solved }}</div>
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

      <!-- Object palette (hidden when solved) -->
      @if (!gameState.isSolved()) {
        <app-object-palette
          [items]="paletteItems()"
          [selectedObject]="gameState.selectedObject()"
          (objectSelected)="onObjectSelected($event)" />
      }

      <!-- Victory panel -->
      @if (gameState.isSolved()) {
        <div class="victory-panel">
          <div class="victory-text">
            <span class="victory-icon">&#10003;</span>
            <span class="victory-title">{{ i18n.t().congratulations }}</span>
          </div>
          <p class="victory-sub">{{ i18n.t().victoryHint }}</p>
          <div class="victory-buttons">
            <button class="btn-new-level" (click)="onNewLevel()">{{ i18n.t().newLevel }}</button>
            <button class="btn-back" (click)="goToMenu()">{{ i18n.t().mainMenu }}</button>
          </div>
        </div>
      }
    </div>
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
      padding: 8px 12px;
      flex-shrink: 0;
      position: relative;
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
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
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

    .victory-panel {
      flex-shrink: 0;
      padding: 12px 16px;
      text-align: center;
      background: rgba(0, 212, 100, 0.08);
      border-top: 1px solid rgba(0, 212, 100, 0.25);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .victory-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .victory-icon {
      font-size: 1.4rem;
      color: $color-accent;
    }

    .victory-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: $color-accent;
    }

    .victory-sub {
      font-size: 0.8rem;
      color: $color-text-muted;
      margin: 4px 0 12px;
    }

    .victory-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .btn-new-level {
      @include glow-button($color-accent);
      padding: 10px 24px;
      font-size: 0.95rem;
    }

    .btn-back {
      padding: 10px 24px;
      font-size: 0.95rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.08);
      color: $color-text;
      font-weight: 600;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    }
  `],
})
export class GameScreenComponent implements OnInit {
  gameState = inject(GameStateService);
  i18n = inject(TranslationService);
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
    if (this.gameState.isSolved()) return;
    this.gameState.handleCellClick(event.row, event.col);
  }

  onClueClick(event: { side: string; index: number }): void {
    this.gameState.traceClue(event.side as any, event.index);
  }

  onObjectSelected(type: GameObjectType): void {
    this.gameState.selectObject(type);
  }

  onNewLevel(): void {
    this.gameState.newGame();
  }

  goToMenu(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/settings']);
  }
}

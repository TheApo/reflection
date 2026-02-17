import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameObjectType, OBJECT_LABELS, ALWAYS_ENABLED_TYPES, TRIANGLE_TYPES, BLOCK_TYPES, ABSORBER_TYPES } from '../../models/game-object.model';
import { GameSettings, getDefaultObjectCounts } from '../../models/game-state.model';
import { GameStateService } from '../../services/game-state.service';
import { LevelGeneratorService } from '../../services/level-generator.service';

interface ObjectCountConfig {
  type: GameObjectType;
  label: string;
  count: number;
  min: number;
  max: number;
}

@Component({
  selector: 'app-game-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="settings-page">
      <!-- Fixed header -->
      <div class="fixed-header">
        <div class="header">
          <button class="back-btn" (click)="goBack()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <h1>Game Setup</h1>
        </div>
      </div>

      <!-- Scrollable content -->
      <div class="scroll-area">
        <!-- Grid Size -->
        <div class="setting-card">
          <label class="setting-label">
            Grid Size
            <span class="setting-value">{{ gridSize() }} × {{ gridSize() }}</span>
          </label>
          <input type="range" [min]="5" [max]="15" [step]="1"
            [ngModel]="gridSize()"
            (ngModelChange)="onGridSizeChange($event)"
            class="slider" />
          <div class="slider-labels">
            <span>5×5</span>
            <span>15×15</span>
          </div>
        </div>

        <!-- Toggles -->
        <div class="setting-card">
          <h3 class="section-title">Optional Objects</h3>

          <div class="toggle-row">
            <div class="toggle-info">
              <svg viewBox="0 0 1 1" width="28" height="28">
                <rect x="0.2" y="0.2" width="0.6" height="0.6" rx="0.06" fill="#b0bec5" />
              </svg>
              <span>Block</span>
            </div>
            <label class="toggle">
              <input type="checkbox"
                [ngModel]="enableBlock()"
                (ngModelChange)="enableBlock.set($event); recalcCounts()" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="toggle-row">
            <div class="toggle-info">
              <svg viewBox="0 0 1 1" width="28" height="28">
                <polygon points="0.15,0.15 0.15,0.85 0.85,0.85" fill="#e040fb" fill-opacity="0.8" />
              </svg>
              <span>Triangles</span>
            </div>
            <label class="toggle">
              <input type="checkbox"
                [ngModel]="enableTriangle()"
                (ngModelChange)="enableTriangle.set($event); recalcCounts()" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="toggle-row">
            <div class="toggle-info">
              <svg viewBox="0 0 1 1" width="28" height="28">
                <circle cx="0.5" cy="0.5" r="0.3" fill="#1a1a2e" stroke="#b0bec5" stroke-width="0.05" />
              </svg>
              <span>Absorber</span>
            </div>
            <label class="toggle">
              <input type="checkbox"
                [ngModel]="enableAbsorber()"
                (ngModelChange)="enableAbsorber.set($event); recalcCounts()" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Object Counts -->
        <div class="setting-card">
          <h3 class="section-title">Object Counts</h3>
          @for (config of visibleObjectConfigs(); track config.type) {
            <div class="count-row">
              <span class="count-label">{{ config.label }}</span>
              <div class="stepper">
                <button class="step-btn" (click)="decrementCount(config.type)"
                  [disabled]="config.count <= config.min">−</button>
                <span class="step-value">{{ config.count }}</span>
                <button class="step-btn" (click)="incrementCount(config.type)"
                  [disabled]="config.count >= config.max">+</button>
              </div>
            </div>
          }

          <div class="total-row">
            <span>Total objects</span>
            <span class="total-value">{{ totalObjects() }}</span>
          </div>
        </div>
      </div>

      <!-- Fixed footer -->
      <div class="fixed-footer">
        @if (error()) {
          <div class="error-msg">{{ error() }}</div>
        }
        <button class="start-btn" (click)="startGame()" [disabled]="isGenerating()">
          @if (isGenerating()) {
            Generating...
          } @else {
            Start Game
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .settings-page {
      height: 100dvh;
      display: flex;
      flex-direction: column;
      background: $color-bg-dark;
      overflow: hidden;
    }

    .fixed-header {
      flex-shrink: 0;
      padding: 12px 16px;
      background: $color-bg-dark;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      z-index: 10;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 480px;
      margin: 0 auto;

      h1 {
        font-size: 1.4rem;
        font-weight: 700;
      }
    }

    .scroll-area {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      min-height: 0;

      padding: 16px 16px 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 480px;
      margin: 0 auto;
      width: 100%;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .fixed-footer {
      flex-shrink: 0;
      padding: 12px 16px;
      background: $color-bg-dark;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      z-index: 10;

      max-width: 480px;
      margin: 0 auto;
      width: 100%;
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: $color-text;

      &:hover { background: rgba(255, 255, 255, 0.1); }
    }

    .setting-card {
      @include card;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: $color-text-muted;
    }

    .setting-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .setting-value {
      color: $color-primary;
      font-weight: 700;
    }

    .slider {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      outline: none;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: $color-primary;
        cursor: pointer;
      }
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: $color-text-muted;
    }

    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
    }

    .toggle-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.95rem;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 26px;
      cursor: pointer;

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-slider {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 13px;
        transition: 0.3s;

        &::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }
      }

      input:checked + .toggle-slider {
        background: $color-primary;
      }

      input:checked + .toggle-slider::before {
        transform: translateX(20px);
      }
    }

    .count-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 0;
    }

    .count-label {
      font-size: 0.9rem;
      color: $color-text;
    }

    .stepper {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .step-btn {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.08);
      color: $color-text;
      font-size: 1.1rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;

      &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.15); }
      &:disabled { opacity: 0.3; cursor: default; }
    }

    .step-value {
      width: 32px;
      text-align: center;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.85rem;
      color: $color-text-muted;
    }

    .total-value {
      font-weight: 700;
      color: $color-primary;
    }

    .error-msg {
      color: $color-error;
      text-align: center;
      font-size: 0.9rem;
      padding: 0 0 8px;
    }

    .start-btn {
      @include glow-button($color-accent);
      width: 100%;
      font-size: 1.15rem;
      padding: 14px;

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }
  `],
})
export class GameSettingsComponent {
  private router = inject(Router);
  private gameState = inject(GameStateService);
  private levelGenerator = inject(LevelGeneratorService);

  gridSize = signal(8);
  enableBlock = signal(true);
  enableTriangle = signal(false);
  enableAbsorber = signal(true);
  objectCounts = signal<Record<GameObjectType, number>>(
    getDefaultObjectCounts(8, true, false, true)
  );
  error = signal('');
  isGenerating = signal(false);

  visibleObjectConfigs = computed<ObjectCountConfig[]>(() => {
    const counts = this.objectCounts();
    const size = this.gridSize();
    const configs: ObjectCountConfig[] = [];

    // Always-enabled types (min enforced)
    for (const type of ALWAYS_ENABLED_TYPES) {
      const min = (type === GameObjectType.Mirror45CW || type === GameObjectType.Mirror45CCW) ? 2 : 1;
      configs.push({
        type,
        label: OBJECT_LABELS[type],
        count: counts[type] ?? 0,
        min,
        max: Math.floor(size * size * 0.1),
      });
    }

    // Block - min 0 (optional)
    if (this.enableBlock()) {
      for (const type of BLOCK_TYPES) {
        configs.push({
          type,
          label: OBJECT_LABELS[type],
          count: counts[type] ?? 0,
          min: 0,
          max: Math.max(1, Math.floor(size * size * 0.05)),
        });
      }
    }

    // Triangles - min 0 (optional)
    if (this.enableTriangle()) {
      for (const type of TRIANGLE_TYPES) {
        configs.push({
          type,
          label: OBJECT_LABELS[type],
          count: counts[type] ?? 0,
          min: 0,
          max: Math.max(1, Math.floor(size * size * 0.05)),
        });
      }
    }

    // Absorber - min 0 (optional)
    if (this.enableAbsorber()) {
      for (const type of ABSORBER_TYPES) {
        configs.push({
          type,
          label: OBJECT_LABELS[type],
          count: counts[type] ?? 0,
          min: 0,
          max: Math.max(1, Math.floor(size * size * 0.05)),
        });
      }
    }

    return configs;
  });

  totalObjects = computed(() => {
    const counts = this.objectCounts();
    return Object.values(counts).reduce((sum, v) => sum + v, 0);
  });

  onGridSizeChange(size: number): void {
    this.gridSize.set(size);
    this.recalcCounts();
  }

  recalcCounts(): void {
    this.objectCounts.set(
      getDefaultObjectCounts(this.gridSize(), this.enableBlock(), this.enableTriangle(), this.enableAbsorber())
    );
  }

  incrementCount(type: GameObjectType): void {
    const counts = { ...this.objectCounts() };
    counts[type] = (counts[type] ?? 0) + 1;
    this.objectCounts.set(counts);
  }

  decrementCount(type: GameObjectType): void {
    const counts = { ...this.objectCounts() };
    const current = counts[type] ?? 0;
    if (current > 0) {
      counts[type] = current - 1;
      this.objectCounts.set(counts);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  startGame(): void {
    this.error.set('');
    this.isGenerating.set(true);

    const settings: GameSettings = {
      gridSize: this.gridSize(),
      enableBlock: this.enableBlock(),
      enableTriangle: this.enableTriangle(),
      enableAbsorber: this.enableAbsorber(),
      objectCounts: this.objectCounts(),
    };

    setTimeout(() => {
      try {
        const puzzle = this.levelGenerator.generate(settings);
        this.gameState.startGame(puzzle);
        this.isGenerating.set(false);
        this.router.navigate(['/play']);
      } catch (e: any) {
        this.isGenerating.set(false);
        this.error.set(e.message || 'Failed to generate puzzle.');
      }
    }, 50);
  }
}

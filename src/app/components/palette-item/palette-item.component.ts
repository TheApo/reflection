import { Component, input, output, computed } from '@angular/core';
import { GameObjectType } from '../../models/game-object.model';

@Component({
  selector: 'app-palette-item',
  standalone: true,
  template: `
    <button
      class="palette-btn"
      [class.selected]="isSelected()"
      [class.empty]="count() === 0"
      (click)="itemClick.emit()">

      <svg viewBox="0 0 1 1" class="icon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-palette" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.04" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        @switch (type()) {
          @case ('mirror45cw') {
            <line x1="0.2" y1="0.2" x2="0.8" y2="0.8" stroke="#00d4ff" stroke-width="0.08" stroke-linecap="round" />
          }
          @case ('mirror45ccw') {
            <line x1="0.8" y1="0.2" x2="0.2" y2="0.8" stroke="#00d4ff" stroke-width="0.08" stroke-linecap="round" />
          }
          @case ('onewayV') {
            <line x1="0.35" y1="0.15" x2="0.35" y2="0.85" stroke="#ffa500" stroke-width="0.07" stroke-linecap="round" />
            <line x1="0.65" y1="0.15" x2="0.65" y2="0.85" stroke="#ffa500" stroke-width="0.07" stroke-linecap="round" />
          }
          @case ('onewayH') {
            <line x1="0.15" y1="0.35" x2="0.85" y2="0.35" stroke="#ffa500" stroke-width="0.07" stroke-linecap="round" />
            <line x1="0.15" y1="0.65" x2="0.85" y2="0.65" stroke="#ffa500" stroke-width="0.07" stroke-linecap="round" />
          }
          @case ('block') {
            <rect x="0.18" y="0.18" width="0.64" height="0.64" rx="0.06" fill="#b0bec5" />
          }
          @case ('triangleBL') {
            <polygon points="0.15,0.15 0.15,0.85 0.85,0.85" fill="#e040fb" fill-opacity="0.8" />
          }
          @case ('triangleBR') {
            <polygon points="0.85,0.15 0.15,0.85 0.85,0.85" fill="#e040fb" fill-opacity="0.8" />
          }
          @case ('triangleTL') {
            <polygon points="0.15,0.15 0.85,0.15 0.15,0.85" fill="#e040fb" fill-opacity="0.8" />
          }
          @case ('triangleTR') {
            <polygon points="0.15,0.15 0.85,0.15 0.85,0.85" fill="#e040fb" fill-opacity="0.8" />
          }
          @case ('absorber') {
            <circle cx="0.5" cy="0.5" r="0.3" fill="#1a1a2e" stroke="#b0bec5" stroke-width="0.05" />
          }
        }
      </svg>

      <span class="count-badge" [class.zero]="count() === 0">{{ count() }}</span>
    </button>
  `,
  styles: [`
    @use 'styles/variables' as *;

    :host {
      display: inline-flex;
    }

    .palette-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 6px;
      border-radius: 10px;
      border: 2px solid transparent;
      background: rgba(255, 255, 255, 0.05);
      transition: all 0.2s ease;
      min-width: 52px;

      &.selected {
        border-color: #00d4ff;
        background: rgba(0, 212, 255, 0.15);
        box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
      }

      &.empty {
        opacity: 0.35;
        pointer-events: none;
      }

      &:hover:not(.empty) {
        background: rgba(255, 255, 255, 0.1);
      }

      &:active:not(.empty) {
        transform: scale(0.95);
      }
    }

    .icon-svg {
      width: 36px;
      height: 36px;
    }

    .count-badge {
      font-size: 12px;
      font-weight: 700;
      color: #e0e0e0;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 1px 6px;
      min-width: 20px;
      text-align: center;

      &.zero {
        color: #ff1744;
      }
    }
  `],
})
export class PaletteItemComponent {
  type = input.required<GameObjectType>();
  count = input.required<number>();
  isSelected = input(false);
  itemClick = output<void>();
}

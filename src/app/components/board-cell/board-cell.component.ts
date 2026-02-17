import { Component, input, output } from '@angular/core';
import { GameObjectType } from '../../models/game-object.model';
import { ObjectIconComponent } from '../object-icon/object-icon.component';

@Component({
  selector: '[appBoardCell]',
  standalone: true,
  imports: [ObjectIconComponent],
  template: `
    <svg:rect
      x="0.02" y="0.02" width="0.96" height="0.96" rx="0.04"
      class="cell-bg"
      [class.has-object]="cellContent() !== null"
      [class.hint-wrong]="hintType() === 'wrong'"
      (click)="cellClick.emit()"
      (touchstart)="onTouch($event)"
      (mouseenter)="cellHover.emit(true)"
      (mouseleave)="cellHover.emit(false)" />

    @if (cellContent(); as obj) {
      <svg:g appObjectIcon [type]="obj" style="pointer-events: none;" />
    }

    <!-- Hint: wrong placement border -->
    @if (hintType() === 'wrong') {
      <svg:rect
        x="0.04" y="0.04" width="0.92" height="0.92" rx="0.04"
        fill="none" stroke="#ff1744" stroke-width="0.06"
        class="hint-pulse"
        style="pointer-events: none;" />
    }

    <!-- Hint: show missing object -->
    @if (hintType() === 'missing' && hintObject()) {
      <svg:g appObjectIcon [type]="hintObject()!" opacity="0.4" style="pointer-events: none;" />
    }

    <!-- Ghost preview of selected object -->
    @if (!cellContent() && !hintObject() && ghostType()) {
      <svg:g appObjectIcon [type]="ghostType()!" opacity="0.35" style="pointer-events: none;" />
    }
  `,
  styles: [`
    :host {
      cursor: pointer;
    }
    .cell-bg {
      fill: #16213e;
      stroke: #1e2d4a;
      stroke-width: 0.02;
      transition: fill 0.15s ease;
    }
    .cell-bg:hover {
      fill: #1e2d4a;
    }
    .cell-bg.has-object {
      fill: #1a2744;
    }
    .cell-bg.hint-wrong {
      fill: rgba(255, 23, 68, 0.15);
    }
    .hint-pulse {
      animation: hintPulse 1s ease-in-out infinite;
    }
    @keyframes hintPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `],
})
export class BoardCellComponent {
  cellContent = input<GameObjectType | null>(null);
  ghostType = input<GameObjectType | null>(null);
  hintType = input<'wrong' | 'missing' | null>(null);
  hintObject = input<GameObjectType | null>(null);
  cellClick = output<void>();
  cellHover = output<boolean>();

  onTouch(event: TouchEvent): void {
    event.preventDefault();
    this.cellClick.emit();
  }
}

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
      (click)="cellClick.emit()"
      (touchstart)="onTouch($event)"
      (mouseenter)="cellHover.emit(true)"
      (mouseleave)="cellHover.emit(false)" />

    @if (cellContent(); as obj) {
      <svg:g appObjectIcon [type]="obj" />
    }

    <!-- Ghost preview of selected object -->
    @if (!cellContent() && ghostType()) {
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
  `],
})
export class BoardCellComponent {
  cellContent = input<GameObjectType | null>(null);
  ghostType = input<GameObjectType | null>(null);
  cellClick = output<void>();
  cellHover = output<boolean>();

  onTouch(event: TouchEvent): void {
    event.preventDefault();
    this.cellClick.emit();
  }
}

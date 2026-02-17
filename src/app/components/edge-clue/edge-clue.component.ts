import { Component, input, output, computed } from '@angular/core';
import { EdgeClue, ClueStatus } from '../../models/clue.model';

@Component({
  selector: '[appEdgeClue]',
  standalone: true,
  template: `
    <svg:rect
      x="0.05" y="0.05" width="0.9" height="0.9" rx="0.1"
      [attr.fill]="displayBgColor()"
      fill-opacity="0.6"
      (click)="clueClick.emit()"
      (touchstart)="onTouch($event)"
      class="clue-bg" />

    @if (isActive()) {
      <svg:rect
        x="0.03" y="0.03" width="0.94" height="0.94" rx="0.1"
        fill="none"
        stroke="#00d4ff"
        stroke-width="0.06" />
    } @else if (!clue().isCorrect) {
      <svg:rect
        x="0.03" y="0.03" width="0.94" height="0.94" rx="0.1"
        fill="none"
        stroke="#ff1744"
        stroke-width="0.06" />
    }

    <svg:text
      x="0.5" y="0.55"
      text-anchor="middle"
      dominant-baseline="middle"
      [attr.font-size]="fontSize()"
      fill="#e0e0e0"
      font-weight="700"
      font-family="'Segoe UI', system-ui, sans-serif"
      style="pointer-events: none;">
      {{ displayDistance() }}
    </svg:text>
  `,
  styles: [`
    :host {
      cursor: pointer;
    }
    .clue-bg {
      transition: fill 0.15s ease, fill-opacity 0.2s ease;
    }
    .clue-bg:hover {
      fill-opacity: 0.8;
    }
  `],
})
export class EdgeClueComponent {
  clue = input.required<EdgeClue>();
  gridSize = input<number>(8);
  isActive = input(false);
  currentDistance = input<number | null>(null);
  currentStatus = input<ClueStatus | null>(null);
  clueClick = output<void>();

  displayDistance = computed(() => {
    if (this.isActive() && this.currentDistance() !== null) {
      return this.currentDistance()!;
    }
    return this.clue().distance;
  });

  displayBgColor = computed(() => {
    if (this.isActive() && this.currentStatus() !== null) {
      return this.statusToColor(this.currentStatus()!);
    }
    return this.statusToColor(this.clue().status);
  });

  fontSize = computed(() => {
    const size = this.gridSize();
    if (size <= 6) return '0.5';
    if (size <= 10) return '0.42';
    return '0.35';
  });

  onTouch(event: TouchEvent): void {
    event.preventDefault();
    this.clueClick.emit();
  }

  private statusToColor(status: ClueStatus): string {
    switch (status) {
      case ClueStatus.Green: return '#2e7d32';
      case ClueStatus.Yellow: return '#f9a825';
      case ClueStatus.Gray: return '#616161';
    }
  }
}

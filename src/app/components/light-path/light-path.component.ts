import { Component, input, computed } from '@angular/core';
import { TraceResult } from '../../models/light-ray.model';

@Component({
  selector: '[appLightPath]',
  standalone: true,
  template: `
    @if (pathData(); as d) {
      <svg:path
        [attr.d]="d"
        fill="none"
        stroke="#00ff88"
        stroke-width="0.06"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="light-line" />
    }
  `,
  styles: [`
    .light-line {
      stroke-dasharray: 0.2 0.1;
      animation: light-travel 0.8s linear infinite;
    }
    @keyframes light-travel {
      to { stroke-dashoffset: -0.3; }
    }
  `],
})
export class LightPathComponent {
  trace = input.required<TraceResult>();
  gridSize = input.required<number>();

  pathData = computed(() => {
    const t = this.trace();
    const n = this.gridSize();
    if (!t || t.segments.length === 0) return '';

    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < t.segments.length; i++) {
      const seg = t.segments[i];
      if (i === 0) {
        // Clamp start point to grid edge (don't draw into clue cells)
        points.push(this.clampToGridEdge(seg.fromRow, seg.fromCol, n));
      }
      if (i < t.segments.length - 1) {
        // Interior points: use cell center
        points.push(this.cellCenter(seg.toRow, seg.toCol));
      } else {
        // Last segment: clamp end point to grid edge if outside grid
        if (seg.toRow < 0 || seg.toRow >= n || seg.toCol < 0 || seg.toCol >= n) {
          points.push(this.clampToGridEdge(seg.toRow, seg.toCol, n));
        } else {
          points.push(this.cellCenter(seg.toRow, seg.toCol));
        }
      }
    }

    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  });

  private cellCenter(row: number, col: number): { x: number; y: number } {
    return { x: col + 0.5, y: row + 0.5 };
  }

  /** Clamp an outside-grid point to the grid boundary */
  private clampToGridEdge(row: number, col: number, gridSize: number): { x: number; y: number } {
    const center = this.cellCenter(row, col);
    // Clamp x to [0, gridSize] and y to [0, gridSize]
    return {
      x: Math.max(0, Math.min(gridSize, center.x)),
      y: Math.max(0, Math.min(gridSize, center.y)),
    };
  }
}

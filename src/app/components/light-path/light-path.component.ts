import { Component, input, computed } from '@angular/core';
import { ClueStatus } from '../../models/clue.model';
import { Direction } from '../../models/direction.model';
import { LightSegment, TraceResult } from '../../models/light-ray.model';

const OFFSET = 0.09;

@Component({
  selector: '[appLightPath]',
  standalone: true,
  template: `
    @for (d of paths(); track $index) {
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

  paths = computed(() => {
    const t = this.trace();
    const n = this.gridSize();
    if (!t || t.segments.length === 0) return [];

    // Yellow traces: split into outgoing + return with perpendicular offset
    if (t.status === ClueStatus.Yellow && t.segments.length >= 2) {
      const mid = Math.floor(t.segments.length / 2);
      const outgoing = this.buildPath(t.segments.slice(0, mid), n, OFFSET);
      const ret = this.buildPath(t.segments.slice(mid), n, OFFSET);
      return [outgoing, ret].filter(d => d !== '');
    }

    const single = this.buildPath(t.segments, n, 0);
    return single ? [single] : [];
  });

  private buildPath(segments: LightSegment[], gridSize: number, offset: number): string {
    if (segments.length === 0) return '';

    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];

      if (i === 0) {
        const p = this.clampToGridEdge(seg.fromRow, seg.fromCol, gridSize);
        if (offset) this.applyOffset(p, seg.direction, offset);
        points.push(p);
      }

      const isLast = i === segments.length - 1;
      let p: { x: number; y: number };

      if (!isLast) {
        p = this.cellCenter(seg.toRow, seg.toCol);
      } else if (seg.toRow < 0 || seg.toRow >= gridSize || seg.toCol < 0 || seg.toCol >= gridSize) {
        p = this.clampToGridEdge(seg.toRow, seg.toCol, gridSize);
      } else {
        p = this.cellCenter(seg.toRow, seg.toCol);
      }

      if (offset) this.applyOffset(p, seg.direction, offset);
      points.push(p);
    }

    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  }

  /** Offset a point perpendicular to the travel direction */
  private applyOffset(point: { x: number; y: number }, dir: Direction, amount: number): void {
    switch (dir) {
      case Direction.Right:  point.y += amount; break;
      case Direction.Left:   point.y -= amount; break;
      case Direction.Bottom: point.x -= amount; break;
      case Direction.Top:    point.x += amount; break;
    }
  }

  private cellCenter(row: number, col: number): { x: number; y: number } {
    return { x: col + 0.5, y: row + 0.5 };
  }

  private clampToGridEdge(row: number, col: number, gridSize: number): { x: number; y: number } {
    const center = this.cellCenter(row, col);
    return {
      x: Math.max(0, Math.min(gridSize, center.x)),
      y: Math.max(0, Math.min(gridSize, center.y)),
    };
  }
}

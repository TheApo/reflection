import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-menu',
  standalone: true,
  template: `
    <div class="start-menu">
      <div class="content">
        <!-- Title -->
        <div class="title-section">
          <h1 class="title">Reflection</h1>
          <p class="subtitle">A Light Puzzle Game</p>
        </div>

        <!-- Play button -->
        <button class="play-btn" (click)="onPlay()">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Play
        </button>

        <!-- Rules -->
        <div class="rules-section">
          <h2 class="rules-title">How to Play</h2>

          <div class="rule-card intro-card">
            <p class="rule-desc">Place objects on the grid so that light rays match the numbers on the edges.</p>
          </div>

          <!-- 2-column grid for object explanations -->
          <div class="rules-grid">
            <!-- 45° Mirrors -->
            <div class="rule-card">
              <div class="rule-header">
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <line x1="0.8" y1="0.2" x2="0.2" y2="0.8" stroke="#00d4ff" stroke-width="0.1" stroke-linecap="round" />
                </svg>
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <line x1="0.2" y1="0.2" x2="0.8" y2="0.8" stroke="#00d4ff" stroke-width="0.1" stroke-linecap="round" />
                </svg>
              </div>
              <p class="rule-text"><strong>45° Mirrors</strong></p>
              <p class="rule-detail">Deflect light at 90°</p>
            </div>

            <!-- One-Way Mirrors -->
            <div class="rule-card">
              <div class="rule-header">
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <line x1="0.35" y1="0.15" x2="0.35" y2="0.85" stroke="#ffa500" stroke-width="0.08" stroke-linecap="round" />
                  <line x1="0.65" y1="0.15" x2="0.65" y2="0.85" stroke="#ffa500" stroke-width="0.08" stroke-linecap="round" />
                </svg>
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <line x1="0.15" y1="0.35" x2="0.85" y2="0.35" stroke="#ffa500" stroke-width="0.08" stroke-linecap="round" />
                  <line x1="0.15" y1="0.65" x2="0.85" y2="0.65" stroke="#ffa500" stroke-width="0.08" stroke-linecap="round" />
                </svg>
              </div>
              <p class="rule-text"><strong>One-Way Mirrors</strong></p>
              <p class="rule-detail">Pass through one axis, reflect 180° on the other</p>
            </div>

            <!-- Block -->
            <div class="rule-card">
              <div class="rule-header">
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <rect x="0.2" y="0.2" width="0.6" height="0.6" rx="0.06" fill="#b0bec5" />
                </svg>
              </div>
              <p class="rule-text"><strong>Block</strong></p>
              <p class="rule-detail">Reflects light 180° from any direction</p>
            </div>

            <!-- Triangles - show all 4 -->
            <div class="rule-card">
              <div class="rule-header">
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <polygon points="0.15,0.15 0.15,0.85 0.85,0.85" fill="#e040fb" fill-opacity="0.8" />
                </svg>
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <polygon points="0.85,0.15 0.15,0.85 0.85,0.85" fill="#e040fb" fill-opacity="0.8" />
                </svg>
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <polygon points="0.15,0.15 0.85,0.15 0.15,0.85" fill="#e040fb" fill-opacity="0.8" />
                </svg>
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <polygon points="0.15,0.15 0.85,0.15 0.85,0.85" fill="#e040fb" fill-opacity="0.8" />
                </svg>
              </div>
              <p class="rule-text"><strong>Triangles</strong></p>
              <p class="rule-detail">Reflect from 2 sides, pass through from 2 sides</p>
            </div>
          </div>

          <!-- Absorber - full width below the grid -->
          <div class="rule-card">
            <div class="rule-header">
              <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                <circle cx="0.5" cy="0.5" r="0.3" fill="#1a1a2e" stroke="#b0bec5" stroke-width="0.05" />
              </svg>
              <div>
                <p class="rule-text"><strong>Absorber</strong></p>
                <p class="rule-detail">Absorbs light completely</p>
              </div>
            </div>
          </div>

          <!-- Edge legend -->
          <div class="rule-card edge-legend">
            <div class="legend-row">
              <span class="legend-badge green">8</span>
              <span>Light passes through (exits elsewhere)</span>
            </div>
            <div class="legend-row">
              <span class="legend-badge yellow">4</span>
              <span>Light reflects back (exits at entry)</span>
            </div>
            <div class="legend-row">
              <span class="legend-badge gray">3</span>
              <span>Light is absorbed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .start-menu {
      height: 100dvh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background: $color-bg-dark;
    }

    .content {
      max-width: 720px;
      margin: 0 auto;
      padding: 40px 20px 60px;
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .title-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, $color-primary, $color-secondary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 4px;

      @include tablet {
        font-size: 3rem;
      }
    }

    .subtitle {
      color: $color-text-muted;
      font-size: 1rem;
    }

    .play-btn {
      @include glow-button($color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      max-width: 280px;
      margin: 0 auto 40px;
      padding: 14px 32px;
      font-size: 1.2rem;
    }

    .rules-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .rules-title {
      font-size: 1.1rem;
      color: $color-text-muted;
      text-align: center;
      margin-bottom: 4px;
    }

    .intro-card {
      text-align: center;
    }

    // 2-column grid on tablet+
    .rules-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;

      @include tablet {
        grid-template-columns: 1fr 1fr;
      }
    }

    .rule-card {
      @include card;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .rule-header {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .rule-icon {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
    }

    .rule-text {
      font-size: 0.95rem;
      color: $color-text;
      line-height: 1.4;
    }

    .rule-detail {
      font-size: 0.85rem;
      color: $color-text-muted;
      line-height: 1.4;
    }

    .rule-desc {
      font-size: 0.95rem;
      color: $color-text;
      line-height: 1.5;
    }

    .edge-legend {
      gap: 10px;
    }

    .legend-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;
      color: $color-text-muted;
    }

    .legend-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.85rem;
      color: $color-text;
      flex-shrink: 0;

      &.green { background: rgba(46, 125, 50, 0.7); }
      &.yellow { background: rgba(249, 168, 37, 0.7); color: #1a1a2e; }
      &.gray { background: rgba(97, 97, 97, 0.7); }
    }
  `],
})
export class StartMenuComponent {
  private router = inject(Router);

  onPlay(): void {
    this.router.navigate(['/settings']);
  }
}

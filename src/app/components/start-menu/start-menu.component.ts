import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-start-menu',
  standalone: true,
  template: `
    <div class="start-menu">
      <div class="content">
        <!-- Title -->
        <div class="title-section">
          <div class="title-row">
            <h1 class="title">{{ i18n.t().title }}</h1>
            <button class="lang-toggle" (click)="i18n.toggleLang()">
              @if (i18n.lang() === 'en') {
                <svg viewBox="0 0 60 30" width="28" height="14">
                  <rect width="60" height="30" fill="#012169"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4"/>
                  <path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/>
                  <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/>
                </svg>
              } @else {
                <svg viewBox="0 0 5 3" width="28" height="17">
                  <rect width="5" height="1" y="0" fill="#000"/>
                  <rect width="5" height="1" y="1" fill="#DD0000"/>
                  <rect width="5" height="1" y="2" fill="#FFCC00"/>
                </svg>
              }
            </button>
          </div>
          <p class="subtitle">{{ i18n.t().subtitle }}</p>
        </div>

        <!-- Play button -->
        <button class="play-btn" (click)="onPlay()">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          {{ i18n.t().play }}
        </button>

        <!-- Rules -->
        <div class="rules-section">
          <h2 class="rules-title">{{ i18n.t().howToPlay }}</h2>

          <div class="rule-card intro-card">
            <p class="rule-desc">{{ i18n.t().introDesc }}</p>
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
              <p class="rule-text"><strong>{{ i18n.t().mirrors45 }}</strong></p>
              <p class="rule-detail">{{ i18n.t().mirrors45Desc }}</p>
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
              <p class="rule-text"><strong>{{ i18n.t().oneWayMirrors }}</strong></p>
              <p class="rule-detail">{{ i18n.t().oneWayMirrorsDesc }}</p>
            </div>

            <!-- Block -->
            <div class="rule-card">
              <div class="rule-header">
                <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                  <rect x="0.2" y="0.2" width="0.6" height="0.6" rx="0.06" fill="#b0bec5" />
                </svg>
              </div>
              <p class="rule-text"><strong>{{ i18n.t().block }}</strong></p>
              <p class="rule-detail">{{ i18n.t().blockDesc }}</p>
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
              <p class="rule-text"><strong>{{ i18n.t().triangles }}</strong></p>
              <p class="rule-detail">{{ i18n.t().trianglesDesc }}</p>
            </div>
          </div>

          <!-- Absorber - full width below the grid -->
          <div class="rule-card">
            <div class="rule-header">
              <svg viewBox="0 0 1 1" width="36" height="36" class="rule-icon">
                <circle cx="0.5" cy="0.5" r="0.3" fill="#1a1a2e" stroke="#b0bec5" stroke-width="0.05" />
              </svg>
              <div>
                <p class="rule-text"><strong>{{ i18n.t().absorber }}</strong></p>
                <p class="rule-detail">{{ i18n.t().absorberDesc }}</p>
              </div>
            </div>
          </div>

          <!-- Edge legend -->
          <div class="rule-card edge-legend">
            <div class="legend-row">
              <span class="legend-badge green">8</span>
              <span>{{ i18n.t().legendGreen }}</span>
            </div>
            <div class="legend-row">
              <span class="legend-badge yellow">4</span>
              <span>{{ i18n.t().legendYellow }}</span>
            </div>
            <div class="legend-row">
              <span class="legend-badge gray">3</span>
              <span>{{ i18n.t().legendGray }}</span>
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
    }

    .content {
      max-width: 720px;
      margin: 0 auto;
      padding: 40px 20px 60px;
      animation: fadeIn 0.5s ease;
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .lang-toggle {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      padding: 6px 8px;
      cursor: pointer;
      transition: background 0.2s;

      svg {
        display: block;
        border-radius: 2px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.12);
      }
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
  i18n = inject(TranslationService);

  onPlay(): void {
    this.router.navigate(['/settings']);
  }
}

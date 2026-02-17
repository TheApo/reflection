import { Component, input } from '@angular/core';
import { GameObjectType } from '../../models/game-object.model';

@Component({
  selector: '[appObjectIcon]',
  standalone: true,
  template: `
    @switch (type()) {
      @case ('mirror45cw') {
        <!-- Backslash mirror \ -->
        <svg:line x1="0.2" y1="0.2" x2="0.8" y2="0.8"
          stroke="#00d4ff" stroke-width="0.07" stroke-linecap="round"
          filter="url(#glow)" />
        <svg:line x1="0.2" y1="0.2" x2="0.8" y2="0.8"
          stroke="#00d4ff" stroke-width="0.03" stroke-linecap="round" opacity="0.5" />
      }
      @case ('mirror45ccw') {
        <!-- Forward slash mirror / -->
        <svg:line x1="0.8" y1="0.2" x2="0.2" y2="0.8"
          stroke="#00d4ff" stroke-width="0.07" stroke-linecap="round"
          filter="url(#glow)" />
        <svg:line x1="0.8" y1="0.2" x2="0.2" y2="0.8"
          stroke="#00d4ff" stroke-width="0.03" stroke-linecap="round" opacity="0.5" />
      }
      @case ('onewayV') {
        <!-- Vertical one-way || -->
        <svg:line x1="0.35" y1="0.15" x2="0.35" y2="0.85"
          stroke="#ffa500" stroke-width="0.06" stroke-linecap="round" />
        <svg:line x1="0.65" y1="0.15" x2="0.65" y2="0.85"
          stroke="#ffa500" stroke-width="0.06" stroke-linecap="round" />
      }
      @case ('onewayH') {
        <!-- Horizontal one-way = -->
        <svg:line x1="0.15" y1="0.35" x2="0.85" y2="0.35"
          stroke="#ffa500" stroke-width="0.06" stroke-linecap="round" />
        <svg:line x1="0.15" y1="0.65" x2="0.85" y2="0.65"
          stroke="#ffa500" stroke-width="0.06" stroke-linecap="round" />
      }
      @case ('block') {
        <!-- Block square -->
        <svg:rect x="0.18" y="0.18" width="0.64" height="0.64" rx="0.06"
          fill="#b0bec5" stroke="#cfd8dc" stroke-width="0.03" />
      }
      @case ('triangleBL') {
        <!-- Triangle bottom-left ◣ -->
        <svg:polygon points="0.15,0.15 0.15,0.85 0.85,0.85"
          fill="#e040fb" fill-opacity="0.7" stroke="#e040fb" stroke-width="0.03" />
      }
      @case ('triangleBR') {
        <!-- Triangle bottom-right ◢ -->
        <svg:polygon points="0.85,0.15 0.15,0.85 0.85,0.85"
          fill="#e040fb" fill-opacity="0.7" stroke="#e040fb" stroke-width="0.03" />
      }
      @case ('triangleTL') {
        <!-- Triangle top-left ◤ -->
        <svg:polygon points="0.15,0.15 0.85,0.15 0.15,0.85"
          fill="#e040fb" fill-opacity="0.7" stroke="#e040fb" stroke-width="0.03" />
      }
      @case ('triangleTR') {
        <!-- Triangle top-right ◥ -->
        <svg:polygon points="0.15,0.15 0.85,0.15 0.85,0.85"
          fill="#e040fb" fill-opacity="0.7" stroke="#e040fb" stroke-width="0.03" />
      }
      @case ('absorber') {
        <!-- Absorber circle -->
        <svg:circle cx="0.5" cy="0.5" r="0.28"
          fill="#1a1a2e" stroke="#90a4ae" stroke-width="0.04" />
      }
    }
  `,
})
export class ObjectIconComponent {
  type = input.required<GameObjectType>();
}

import { Component, input, output } from '@angular/core';
import { GameObjectType } from '../../models/game-object.model';
import { PaletteItemComponent } from '../palette-item/palette-item.component';

@Component({
  selector: 'app-object-palette',
  standalone: true,
  imports: [PaletteItemComponent],
  template: `
    <div class="palette-container">
      <div class="palette-items">
        @for (item of items(); track item.type) {
          <app-palette-item
            [type]="item.type"
            [count]="item.count"
            [isSelected]="selectedObject() === item.type"
            (itemClick)="objectSelected.emit(item.type)" />
        }
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;

    .palette-container {
      padding: 8px 12px;
      background: #12182a;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .palette-items {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding: 4px 0;
      justify-content: center;
      flex-wrap: wrap;

      &::-webkit-scrollbar { display: none; }
    }
  `],
})
export class ObjectPaletteComponent {
  items = input.required<{ type: GameObjectType; count: number }[]>();
  selectedObject = input<GameObjectType | null>(null);
  objectSelected = output<GameObjectType>();
}

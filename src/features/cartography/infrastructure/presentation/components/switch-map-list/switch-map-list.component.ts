import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'switch-map-list',
  templateUrl: './switch-map-list.component.html'
})
export class SwitchMapListComponent {
  public switchMapListControl: FormControl = new FormControl(false);

  @Output() public readonly switchMapList: EventEmitter<boolean> = new EventEmitter<boolean>();

  public toggle(): void {
    const nextSwitchMapListControlValue: boolean = !(this.switchMapListControl.value as boolean);
    this.switchMapListControl.setValue(nextSwitchMapListControlValue);
    this.switchMapList.emit(nextSwitchMapListControlValue);
  }
}
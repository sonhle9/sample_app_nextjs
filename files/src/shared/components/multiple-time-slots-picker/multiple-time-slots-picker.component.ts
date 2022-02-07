import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import moment from 'moment';
import {Store} from '../../interfaces/store.interface';

@Component({
  selector: 'app-multiple-time-slots-picker',
  templateUrl: './multiple-time-slots-picker.component.html',
  styleUrls: ['./multiple-time-slots-picker.component.scss'],
})
export class MultipleTimeSlotsPickerComponent implements AfterViewInit {
  @Input()
  timeSlots: Store.ITimeSlot;

  @Output()
  updateTimeSlot = new EventEmitter();

  minTime = this.getTime(0, 0);
  maxTime = this.getTime(24, 0);

  @ViewChildren('timeComponent') timeComponents: QueryList<any>;

  constructor() {}

  ngAfterViewInit() {
    this.timeComponents.changes.subscribe(() => {
      this.emitOnUpdate(this.timeSlots.slots.length);
    });
  }

  onAddSlot(e: Event) {
    const lastSlot = this.timeSlots.slots[this.timeSlots.slots.length - 1];
    this.timeSlots.slots.push(
      this.getTimeRange(lastSlot[1].getHours() + 1, lastSlot[1].getHours() + 2),
    );
    e.preventDefault();
    return false;
  }

  onRemoveSlot(index: number) {
    this.timeSlots.slots.splice(index, 1);
  }

  onTimeChange(e: any, index: number) {
    this.timeSlots.slots[index] = e.value;
    this.emitOnUpdate(index);
  }

  emitOnUpdate(index: number) {
    this.updateTimeSlot.emit({index, timeSlots: this.timeSlots});
  }

  getTimeSlot(fromHours: number, toHours: number): Store.ITimeSlot {
    return {
      slots: [this.getTimeRange(fromHours, toHours)],
    };
  }

  getTimeRange(fromHours: number, toHours: number): Date[] {
    return [this.getTime(fromHours), this.getTime(toHours)];
  }

  getTime(hours: number, minutes: number = 0) {
    return moment()
      .set({
        hour: hours,
        minute: minutes,
        second: 0,
        millisecond: 0,
      })
      .toDate();
  }
}

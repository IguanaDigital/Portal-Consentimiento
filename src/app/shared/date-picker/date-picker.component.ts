import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
// import { CommonModule } from "@angular/common";
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

import {
  CustomAdapter,
  CustomDateParserFormatter,
} from "./date-picker.service";

@Component({
  selector: "app-date-picker",
  standalone: true,
  // imports: [CommonModule, NgbDatepickerModule, FormsModule],
  imports: [NgbDatepickerModule, FormsModule],

  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class DatePickerComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;

  @Output() change = new EventEmitter<string>();

  ngOnInit(): void {}

  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>
  ) {}

  onDateChange(date: string) {
    if (date.length == 10) {
      this.change.emit(date);
    } else {
      this.change.emit("");
    }
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
}

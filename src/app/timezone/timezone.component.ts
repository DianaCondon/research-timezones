import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormGroupDirective, NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

// import * as spacetime from 'spacetime';
// import 'spacetime';
// import * as _ from 'spacetime-informal';
declare const spacetime: any;
declare const informal: any;

@Component({
  selector: 'app-timezone',
  templateUrl: './timezone.component.html',
  styleUrls: ['./timezone.component.scss'],
  providers: [DatePipe]
})
export class TimezoneComponent implements OnInit {
  eventFormGroup: FormGroup;
  usersTimeZone: String;
  usersTimeZoneOffset: Number;
  inputTime: Date;
  eventTime: Date;
  eventTimeZone: String;
  displayedTime: Date;
  displayedTimeZone: String;
  nowTime: String;
  nowTimeZone: String;
  hasPassed: Boolean;

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.nowTime = this.getUsersTime();

    this.eventFormGroup = new FormGroup({
      titleField: new FormControl('', [
        Validators.required,
        Validators.pattern('^.*\\S+.*$') // at least 1 non-whitespace char
      ]),
      timeField: new FormControl(null, [Validators.required]),
      timeZoneField: new FormControl(null, [Validators.required]),
    });
  }

  getUsersTime(): String {
    const nowDate: Date = new Date();
    this.usersTimeZoneOffset = nowDate.getTimezoneOffset();
    return this.datePipe.transform(nowDate, 'short');
  }

  getUsersTimeZone() {
    informal.find((new Date()).toTimeString().split('(')[1].split(')')[0]);
  }
}

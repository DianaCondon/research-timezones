import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timezone',
  templateUrl: './timezone.component.html',
  styleUrls: ['./timezone.component.scss'],
  providers: [DatePipe]
})
export class TimezoneComponent implements OnInit {
  usersTimeZone: String;
  usersTimeZoneOffset: String;
  inputTime: Date;
  eventTime: Date;
  eventTimeZone: String;
  displayedTime: Date;
  displayedTimeZone: String;
  nowTime: String;
  nowTimeZone: String;
  hasPassed: Boolean;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.nowTime = this.getUsersTime();
  }

  getUsersTime(): String {
    const nowDate: Date = new Date();
    return this.datePipe.transform(nowDate, 'short');
  }
}

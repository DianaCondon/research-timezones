import { Component } from '@angular/core';

// import * as spacetime from 'spacetime';
// import 'spacetime';
// import * as _ from 'spacetime-informal';
declare const spacetime: any;
declare const informal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: String = 'Research Timezones';
  subtitle: String = 'Looking into spacetime, IANA, and updating display string';
  display = '';
  myText = [];



  // showTimeZone(timeText: string, timeZone: string) {
  //   const sp = new spacetime(timeText, 'Etc/UTC').goto(timeZone);
  //   if (sp.hasDST()) {
  //     return informal.display(timeZone)[sp.isDST() ? 'daylight' : 'standard'].abbrev;
  //   } else {
  //     console.log(informal.display(timeZone));
  //     return informal.display(timeZone).abbrev;
  //   }
  // }

  constructor() {

    // const now = spacetime.now();
    // console.log(now.timezone());
    // this.display = ;
    // console.log(new spacetime().timezone().name);

    // JavaScript-only: figure out that America/New_York is abbreviated as EST
    // (5pm in our locale becomes 8pm EST)
    // this.myText.push((new Date('12/15/2020 17:00:00')).toLocaleString('en-us', {timeZone: 'America/New_York', timeZoneName: 'short'}));

    // JavaScript-only: figure out that America/New_York is abbreviated as EST
    // this.myText.push(new Date((new spacetime('2020-12-15 17:00:00')).epoch));

    // this.myText.push(spacetime);
    // const ny = new spacetime('2020-06-15 17:00:00');
    // const nyText = informal.display('America/New_York')[ny.isDST() ? 'daylight' : 'standard'].abbrev;
    // this.myText.push(nyText);
    // this.myText.push(informal.display('America/New_York').standard.abbrev);
    // console.log();

    // console.log(spacetime.default('2020-06-15 17:00:00'));
    console.log(spacetime('2020', 'america/new_york'));
    console.log(informal.display('Africa/Kinshasa'));
    // console.log(new spacetime('2020-06-15 17:00:00'));
    // this.myText.push(this.showTimeZone('2020-06-15 17:00:00', 'America/New_York'));
    // this.myText.push(this.showTimeZone('2020-12-15 17:00:00', 'America/New_York'));
    // this.myText.push(this.showTimeZone('2020-06-15 17:00:00', 'Asia/Tokyo'));
    // this.myText.push(this.showTimeZone('2020-12-15 17:00:00', 'Asia/Tokyo'));
    // this.myText.push(this.showTimeZone('2020-06-15 17:00:00', 'Asia/Tehran'));
    // this.myText.push(this.showTimeZone('2020-12-15 17:00:00', 'Asia/Tehran'));
    // this.myText.push((new Date()).toString());
    // this.myText.push((new Date()).toTimeString().split('(')[1].split(')')[0]);
    this.myText.push(informal.find((new Date()).toTimeString().split('(')[1].split(')')[0]));

    // const jp = new spacetime('2020-06-15 17:00:00');
    // const jpText = informal.display('Asia/Tokyo')[jp.isDST() ? 'daylight' : 'standard'].abbrev;
    // this.myText.push(jpText);

    // JavaScript-only: figure out that America/New_York is abbreviated as EST
    // this.myText.push(new Date());
    // this.myText.push(new Date('12/15/2020 17:00:00'));
    // this.myText.push((new Date('12/15/2020 17:00:00')).toLocaleString('en-us', {timeZone: 'America/New_York', timeZoneName: 'short'}));

    // let s = new spacetime('January 5 2018', 'Africa/Djibouti');
    // s = s.time('12:30pm');
    // const djiboutiDate = s.epoch;
    // const djiboutiTime = s.time();
    // console.log(djiboutiDate);
    // console.log(djiboutiTime);
    // s = s.goto('America/New_York');
    // const newYorkDate = s.epoch;
    // const newYorkTime = s.time();
    // this.myText.push('howdy');
    // console.log(newYorkDate);
    // console.log(newYorkTime);
  }
}

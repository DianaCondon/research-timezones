import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: String = 'Research Timezones';
  subtitle: String = 'spacetime, IANA, adding (GMT +00:00)';
  display = '';
  myText = [];

  constructor() {}
}

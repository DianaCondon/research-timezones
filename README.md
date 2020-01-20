# ResearchTimezones

This project researches how to use spacetime and spacetime-informal to navigate timezones for the purposes of event creation and event reading in any timezone.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.1.

## includes
* get user's timezone
* convert timezones into and out of: IANA, city, standard name, GMT offset, and picked IANA
* display timezone groups (IANAs grouped by spacetime-informal, into same timezone offsets & handling of daylight times)
* choose time & timezone for 'event'
* sort timezones by GMT offset, then name
* convert 'event' time from event timezone to user's timezone
* get the current time
* calculate if event has passed

## do next
* fix am/pm for event time creation
* after ^, ensure the calculate if event has passed works better.
* optional method to remove 'Standard' from standard timezone names
* optional method to adjust GMT offset & standard name to change based on if it (current time, OR chosen time) is DST or not

## to use

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

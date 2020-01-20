import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import { TimezoneInfo } from '../models/timezone-info';
import { Spacetime} from 'spacetime/types/types';

declare var informal: any;
declare var spacetime: any;

@Component({
  selector: 'app-timezone',
  templateUrl: './timezone.component.html',
  styleUrls: ['./timezone.component.scss'],
  providers: [DatePipe]
})

export class TimezoneComponent implements OnInit {
  greenwichStandard = 'Greenwich Standard Time';

  gmtExceptionBritish = 'British Summer Time';
  newGmtBritish = 'Greenwich Standard Time (British)';
  gmtBritishIana = 'Europe/London';

  gmtExceptionIrish = 'Irish Summer Time';
  newGmtIrish = 'Greenwich Standard Time (Irish)';
  gmtIrishIana = 'Europe/Dublin';

  eventForm: FormGroup;
  timezonesForm: FormGroup;
  timezonetable: TimezoneInfo[];
  timetable: string[];
  ianazones: string[];
  eventSubmitted = false;
  hasPassed: Boolean;

  usersTimeZone: TimezoneInfo;

  eventTime: Spacetime;
  eventTimeZone: TimezoneInfo;

  displayedTime: Spacetime;

  nowTime: Spacetime;

  ngOnInit(): void {
    this.ianazones = this.getIanaTimezoneList();
    this.timetable = this.generateTimes();
    this.timezonetable = this.generateTimeZones();

    this.nowTime = this.getUsersTime();
    this.usersTimeZone = this.getLocalTimeZone();

    this.timezonesForm = new FormGroup({
      timezoneField: new FormControl(''),
    });

    this.eventForm = new FormGroup({
      timeField: new FormControl(''),
      timeZoneField: new FormControl(''),
    });
    // Selects user's timezone in timezone dropdown
    this.timeZoneField.setValue(this.usersTimeZone);
  }

  generateTimes(): string[] {
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const minutes = ['00'];
    const timeOfDay = ['am', 'pm'];
    const times = [];
    for (const time of timeOfDay) {
      for (const hour of hours) {
        for (const minute of minutes) {
          times.push(hour + ':' + minute + time);
        }
      }
    }
    return times;
  }

  generateTimeZones(): TimezoneInfo[] {
    let timezones: TimezoneInfo[] = [];

    for (const zone of this.ianazones) { // zone is now a IANA timezone name 'Pacific/Honolulu'
      const display = informal.display(zone);

      if (display.standard) { // display.standard checks if this timezone is an active timezone (not outdated)
        const s = spacetime.now(zone);
        const offset = s.offset();
        const standardName = this.getStandardName(zone);
        const displayedName: string = this.getDisplayedName(standardName, offset);
        if (!this.hasDuplicateZone(displayedName, timezones)) {
          const pickedIana = this.getPickedIana(this.getPickedIana(standardName));
          const pickedCity = this.getCity(pickedIana);
          const timezone = {
            standardName: standardName,
            offset: offset,
            iana: [zone],
            displayedName: displayedName,
            pickedIana: pickedIana,
            pickedCity: pickedCity
          };
          timezones.push(timezone);
        } else {
          timezones = this.addTimezoneToArray(timezones, displayedName, zone);
        }
      }
    }
    timezones = this.sortTimezones(timezones);
    return timezones;
  }

  // Takes in timezone offset in minutes '-120'
  // Returns timezone offset string '(GMT -02:00)'
  convertOffset(offsetMinutes: number): string {
    const minutes = offsetMinutes % 60;
    const stringMinutes = (minutes === 0) ? '00' : minutes;
    const hours = (offsetMinutes - minutes) / 60;
    const zeroedHours = (hours > -10 && hours < 10) ? '0' + hours : hours;
    let stringHours: string;
    if (offsetMinutes >= 0) {
      stringHours = (hours < 10) ? '+0' + hours : '+' + hours;
    } else {
      stringHours = (hours > -10) ? '-0' + (hours * -1) : '' + hours;
    }
    return '(GMT ' + stringHours + ':' + stringMinutes + ')';
  }

  // Takes in a standard name 'Hawaiian Standard Time', and timezone offset in minutes '-120'
  // Returns displayed timezone name with offset '(GMT -10:00) Hawaiian Standard Time'
  getDisplayedName(standardName: string, offset: number): string {
    const stringOffset = this.convertOffset(offset);
    return stringOffset + ' ' + standardName;
  }

  // Takes in a timezone TimezoneInfo
  // Returns the first Iana timezone of the iana array
  getIanaName(zoneInfo: TimezoneInfo): string {
    return zoneInfo.iana[0];
  }

  // Takes in standard timezone Name 'Hawaiian Standard Time'
  // Returns the only/picked IANA timezone for the given group 'Pacific/Honolulu'
  getPickedIana(standardName: string): string {
    let pickedCity: string;
    if (standardName === this.newGmtBritish || standardName === this.newGmtIrish) {
      pickedCity = this.undoGreenwich(standardName);
    } else {
      pickedCity = informal.display(standardName).iana;
    }
    return pickedCity;
  }

  // Takes in an IANA timezone 'Pacific/Honolulu'
  // Returns that city 'Honolulu'
  getCity(ianaName: string): string {
    let city = ianaName.substring(ianaName.indexOf('/') + 1);
    city = city.replace('_', ' ');
    return city;
  }

  // Takes in an IANA timezone 'Pacific/Honolulu'
  // Returns the standard timezone Name 'Hawaiian Standard Time'
  getStandardName(ianaName: string): string {
    const display = informal.display(ianaName);
    let standardName = display.standard.name;
    if (standardName === this.greenwichStandard) {
      if (display.daylight) {
        standardName = this.addBritishIrishToGmt(display.daylight.name);
      }
    }
    return standardName;
  }

  // Handles the three different Greenwich Standard Time Timezone groups, adds '(British)' or '(Irish)' to add accuracy
  // Takes in the Daylight name of either 'British Summer Time' or 'Irish Summer Time'
  // Returns 'Greenwich Standard Time (British)' or 'Greenwich Standard Time (Irish)'
  addBritishIrishToGmt(summerName: string): string {
    if (summerName === this.gmtExceptionBritish) {
      return this.newGmtBritish;
    }
    if (summerName === this.gmtExceptionIrish) {
      return this.newGmtIrish;
    }
  }

  // Switches edited Greenwich timezones to proper IANA values
  // Takes in edited Greenwich times 'Greenwich Standard Time (British)' or 'Greenwich Standard Time (Irish)'
  // Returns the picked IANA timezone for that timezone group 'Europe/London' or 'Europe/Dublin'
  undoGreenwich(standardName: string): string {
    if (standardName === this.newGmtBritish) {
      return this.gmtBritishIana;
    } else if (standardName === this.newGmtIrish) {
      return this.gmtIrishIana;
    }
    return null;
  }

  // Takes in an array of timezoneInfos timezones
  // Returns an array of timezoneInfos sorted by their offset (then alphabetically if offset is the same)
  sortTimezones(timezones: TimezoneInfo[]) {
    return timezones.sort((n1, n2) => {
      const offsetDiff = n1.offset - n2.offset;
      if (offsetDiff === 0) {
        if (n1.displayedName < n2.displayedName) { return -1; }
        if (n1.displayedName > n2.displayedName) { return 1; }
      }
      return offsetDiff;
    });
  }

  // Takes in a standard timezone name, and an array of timezoneInfo timezones
  // Returns boolean - the array contains a timezoneInfo with the display name of given timezone name
  hasDuplicateZone(standardName: string, timezones: TimezoneInfo[]): boolean {
    let contains = false;
    timezones.forEach( function (zone) {
      if (zone.displayedName === standardName) {
        contains = true;
      }
    });
    return contains;
  }

  // Adds the IANA name to the timezoneInfo's iana array
  // Takes in timezoneInfo array, and a duplicate timezone's standard name and IANA name
  // Returns a timezoneInfo array with the IANA name added to the appropriate iana array
  addTimezoneToArray(timezones: TimezoneInfo[], standardName: string, ianaName: string): TimezoneInfo[] {
    const adjustedTimezones = timezones;
    adjustedTimezones.forEach( function (zone) {
      if (zone.displayedName === standardName) {
        zone.iana.push(ianaName);
      }
    });
    return adjustedTimezones;
  }

  // Returns the user's time, as Spacetime
  getUsersTime(): Spacetime {
    return spacetime.now();
  }

  // Returns the user's timezone as TimezoneInfo
  getLocalTimeZone(): TimezoneInfo {
    const s = spacetime.now();
    const usersIanaName = s.timezone().name;
    let t: TimezoneInfo;
    this.timezonetable.forEach( function (zoneInfo) {
      zoneInfo.iana.forEach( function (ianaName) {
        if (ianaName === usersIanaName) {
          t = zoneInfo;
        }
      });
    });
    return t;
  }

  // Adjusts the EventTime in the chosen timezone to the user's timezone
  adjustTimeZone() {
    this.displayedTime = this.eventTime.goto(this.usersTimeZone.pickedIana);
  }

  // Takes in a time String '9:00pm', and IANA timezone 'Pacific/Honolulu'
  // Returns a new Spacetime date of today at given time in given timezone
  createTime(timeString: string, ianaName: string): Spacetime {
    const hour = timeString.slice(0, timeString.indexOf(':'));
    let s = spacetime.today();
    s = s.goto(ianaName);
    s = s.hour(hour);
    return s;
  }

  onSubmit() {
    this.eventSubmitted = true;
    const ianaTimezone = this.getIanaName(this.timeZoneField.value);
    this.eventTime = this.createTime(this.timeField.value, ianaTimezone);
    this.eventTimeZone = this.timeZoneField.value;
    this.adjustTimeZone();
    this.beforeNow();

    const timezone = this.timeZoneField.value;
    const standardNameLong = timezone.displayedName;
    const standardNameShort = standardNameLong.substring(standardNameLong.indexOf(')') + 2);
    const ianaName = this.getIanaName(timezone);
    const pickedIana = this.getPickedIana(standardNameShort);
    const pickedCity = this.getCity(pickedIana);
    console.log('displayed timezone: ', standardNameLong);
    console.log('first Iana name: ', ianaName);
    console.log('picked Iana: ', pickedIana);
    console.log('picked city: ', pickedCity);
  }

  // populates hasPassed to if the evenTime is before current time
  beforeNow() {
    const now = spacetime.now();
    this.hasPassed = this.eventTime.isBefore(now);
  }

  get timeField() {
    return this.eventForm.get('timeField');
  }

  get timeZoneField() {
    return this.eventForm.get('timeZoneField');
  }

  // Returns a string array of all IANA timezones, per spacetime-informal (Jan 2020)
  // DON'T USE THIS in Medbridge things, this should be handled by '/api/v1/admin/timezones', treat the same way
  getIanaTimezoneList(): string[] {
    const abbreviatedIana = {
      Africa: ['Abidjan', 'Accra', 'Addis_Ababa', 'Algiers', 'Asmara', 'Asmera', 'Bamako', 'Bangui', 'Banjul', 'Bissau', 'Blantyre', 'Brazzaville', 'Bujumbura', 'Cairo', 'Casablanca', 'Ceuta', 'Conakry', 'Dakar', 'Dar_Es_Salaam', 'Djibouti', 'Douala', 'El_Aaiun', 'Freetown', 'Gaborone', 'Harare', 'Johannesburg', 'Juba', 'Kampala', 'Khartoum', 'Kigali', 'Kinshasa', 'Lagos', 'Libreville', 'Lome', 'Luanda', 'Lubumbashi', 'Lusaka', 'Malabo', 'Maputo', 'Maseru', 'Mbabane', 'Mogadishu', 'Monrovia', 'Nairobi', 'Ndjamena', 'Niamey', 'Nouakchott', 'Ouagadougou', 'Porto-novo', 'Sao_Tome', 'Timbuktu', 'Tripoli', 'Tunis', 'Windhoek'],
      America: ['Adak', 'Anchorage', 'Anguilla', 'Antigua', 'Araguaina', 'Argentina', 'Aruba', 'Asuncion', 'Atikokan', 'Atka', 'Bahia', 'Bahia_Banderas', 'Barbados', 'Belem', 'Belize', 'Blanc-sablon', 'Boa_Vista', 'Bogota', 'Boise', 'Buenos_Aires', 'Cambridge_Bay', 'Campo_Grande', 'Cancun', 'Caracas', 'Catamarca', 'Cayenne', 'Cayman', 'Chicago', 'Chihuahua', 'Coral_Harbour', 'Cordoba', 'Costa_Rica', 'Creston', 'Cuiaba', 'Curacao', 'Danmarkshavn', 'Dawson', 'Dawson_Creek', 'Denver', 'Detroit', 'Dominica', 'Edmonton', 'Eirunepe', 'El_Salvador', 'Ensenada', 'Fort_Wayne', 'Fortaleza', 'Glace_Bay', 'Godthab', 'Goose_Bay', 'Grand_Turk', 'Grenada', 'Guadeloupe', 'Guatemala', 'Guayaquil', 'Guyana', 'Halifax', 'Havana', 'Hermosillo', 'Indiana', 'Indianapolis', 'Inuvik', 'Iqaluit', 'Jamaica', 'Jujuy', 'Juneau', 'Kentucky', 'Knox_In', 'Kralendijk', 'La_Paz', 'Lima', 'Los_Angeles', 'Louisville', 'Lower_Princes', 'Maceio', 'Managua', 'Manaus', 'Marigot', 'Martinique', 'Matamoros', 'Mazatlan', 'Mendoza', 'Menominee', 'Merida', 'Metlakatla', 'Mexico_City', 'Miquelon', 'Moncton', 'Monterrey', 'Montevideo', 'Montreal', 'Montserrat', 'Nassau', 'New_York', 'Nipigon', 'Nome', 'Noronha', 'North_Dakota', 'Ojinaga', 'Panama', 'Pangnirtung', 'Paramaribo', 'Phoenix', 'Port-au-prince', 'Port_Of_Spain', 'Porto_Acre', 'Porto_Velho', 'Puerto_Rico', 'Punta_Arenas', 'Rainy_River', 'Rankin_Inlet', 'Recife', 'Regina', 'Resolute', 'Rio_Branco', 'Rosario', 'Santa_Isabel', 'Santarem', 'Santiago', 'Santo_Domingo', 'Sao_Paulo', 'Scoresbysund', 'Shiprock', 'Sitka', 'St_Barthelemy', 'St_Johns', 'St_Kitts', 'St_Lucia', 'St_Thomas', 'St_Vincent', 'Swift_Current', 'Tegucigalpa', 'Thule', 'Thunder_Bay', 'Tijuana', 'Toronto', 'Tortola', 'Vancouver', 'Virgin', 'Whitehorse', 'Winnipeg', 'Yakutat', 'Yellowknife'],
      Antarctica: ['Casey', 'Davis', 'Dumontdurville', 'Macquarie', 'Mawson', 'Mcmurdo', 'Palmer', 'Rothera', 'South_Pole', 'Syowa', 'Troll', 'Vostok'],
      Arctic: ['Longyearbyen'],
      Asia: ['Aden', 'Almaty', 'Amman', 'Anadyr', 'Aqtau', 'Aqtobe', 'Ashgabat', 'Ashkhabad', 'Atyrau', 'Baghdad', 'Bahrain', 'Baku', 'Bangkok', 'Barnaul', 'Beirut', 'Bishkek', 'Brunei', 'Calcutta', 'Chita', 'Choibalsan', 'Chongqing', 'Chungking', 'Colombo', 'Dacca', 'Damascus', 'Dhaka', 'Dili', 'Dubai', 'Dushanbe', 'Gaza', 'Harbin', 'Hebron', 'Ho_Chi_Minh', 'Hong_Kong', 'Hovd', 'Irkutsk', 'Istanbul', 'Jakarta', 'Jayapura', 'Jerusalem', 'Kabul', 'Kamchatka', 'Karachi', 'Kashgar', 'Kathmandu', 'Katmandu', 'Khandyga', 'Kolkata', 'Krasnoyarsk', 'Kuala_Lumpur', 'Kuching', 'Kuwait', 'Macao', 'Macau', 'Magadan', 'Makassar', 'Manila', 'Muscat', 'Nicosia', 'Novokuznetsk', 'Novosibirsk', 'Omsk', 'Oral', 'Phnom_Penh', 'Pontianak', 'Pyongyang', 'Qatar', 'Qyzylorda', 'Rangoon', 'Riyadh', 'Saigon', 'Sakhalin', 'Samarkand', 'Seoul', 'Shanghai', 'Singapore', 'Srednekolymsk', 'Taipei', 'Tashkent', 'Tbilisi', 'Tehran', 'Tel_Aviv', 'Thimbu', 'Thimphu', 'Tokyo', 'Tomsk', 'Ujung_Pandang', 'Ulaanbaatar', 'Ulan_Bator', 'Urumqi', 'Ust-nera', 'Vientiane', 'Vladivostok', 'Yakutsk', 'Yekaterinburg', 'Yerevan', 'Volgograd'],
      Atlantic: ['Azores', 'Bermuda', 'Canary', 'Cape_Verde', 'Faeroe', 'Faroe', 'Jan_Mayen', 'Madeira', 'Reykjavik', 'South_Georgia', 'St_Helena', 'Stanley'],
      Australia: ['Act', 'Adelaide', 'Brisbane', 'Broken_Hill', 'Canberra', 'Currie', 'Darwin', 'Eucla', 'Hobart', 'Lhi', 'Lindeman', 'Lord_Howe', 'Melbourne', 'Nsw', 'North', 'Perth', 'Queensland', 'South', 'Sydney', 'Tasmania', 'Victoria', 'West', 'Yancowinna'],
      Brazil: ['Acre', 'Denoronha', 'East', 'West'],
      Canada: ['Atlantic', 'Central', 'East-saskatchewan', 'Eastern', 'Mountain', 'Newfoundland', 'Pacific', 'Saskatchewan', 'Yukon'],
      Chile: ['Continental', 'Easterisland'],
      Europe: ['Amsterdam', 'Andorra', 'Astrakhan', 'Athens', 'Belfast', 'Belgrade', 'Berlin', 'Bratislava', 'Brussels', 'Bucharest', 'Budapest', 'Busingen', 'Chisinau', 'Copenhagen', 'Dublin', 'Gibraltar', 'Guernsey', 'Helsinki', 'Isle_Of_Man', 'Istanbul', 'Jersey', 'Kaliningrad', 'Kirov', 'Kiev', 'Lisbon', 'Ljubljana', 'London', 'Luxembourg', 'Madrid', 'Malta', 'Mariehamn', 'Minsk', 'Monaco', 'Moscow', 'Nicosia', 'Oslo', 'Paris', 'Podgorica', 'Prague', 'Riga', 'Rome', 'Samara', 'Saratov', 'San_Marino', 'Sarajevo', 'Simferopol', 'Skopje', 'Sofia', 'Stockholm', 'Tallinn', 'Tirane', 'Tiraspol', 'Ulyanovsk', 'Uzhgorod', 'Vaduz', 'Vatican', 'Vienna', 'Vilnius', 'Volgograd', 'Warsaw', 'Zagreb', 'Zaporozhye', 'Zurich'],
      Indian: ['Antananarivo', 'Chagos', 'Christmas', 'Cocos', 'Comoro', 'Kerguelen', 'Mahe', 'Maldives', 'Mauritius', 'Mayotte', 'Reunion'],
      Mexico: ['Bajanorte', 'Bajasur', 'General'],
      Pacific: ['Apia', 'Auckland', 'Bougainville', 'Chatham', 'Chuuk', 'Easter', 'Efate', 'Enderbury', 'Fakaofo', 'Fiji', 'Funafuti', 'Galapagos', 'Gambier', 'Guadalcanal', 'Guam', 'Honolulu', 'Johnston', 'Kiritimati', 'Kosrae', 'Kwajalein', 'Majuro', 'Marquesas', 'Midway', 'Nauru', 'Niue', 'Norfolk', 'Noumea', 'Pago_Pago', 'Palau', 'Pitcairn', 'Pohnpei', 'Ponape', 'Port_Moresby', 'Rarotonga', 'Saipan', 'Samoa', 'Tahiti', 'Tarawa', 'Tongatapu', 'Truk', 'Wake', 'Wallis', 'Yap']
    };
    const IANA: string[] = [];
    Object.keys(abbreviatedIana).forEach(function (k) {
      abbreviatedIana[k].forEach(function (str) {
        str = str.replace('_', ' ');
        const zone = informal.find(str);
        if (zone) {
          IANA.push(zone);
        }
      });
    });
    return IANA;
  }
}

export class TimezoneInfo {
  constructor(
    public standardName: string,
    public offset: number,
    public displayedName: string,
    public pickedIana: string,
    public pickedCity: string,
    public iana: string[]
  ) {}
}

// standardName: standardName,
// offset: offset,
// displayedName: displayedName,
// pickedIana: pickedIana,
// pickedCity: pickedCity
// iana: [zone],

export class Event {
  constructor(
    public id: number,
    public title: string,
    public start: any,
    public end: string = start,
    public place: string,
    public interviewer: number,
    public color: number,
    public colorIndex?: number,
    public isVacant?: boolean,
    public info?: string,
    public id_candidate?:number
  ) {}
}


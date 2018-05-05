export class Event {
  constructor(
    public id: number,
    public title: string,
    public start: any,
    public time: {},
    public place: string = '',
    public interviewer: number = 1,
    public color: number = 1,
    public colorIndex?: number,
    public isVacant?: boolean,
    public info?: string
  ) {}
}


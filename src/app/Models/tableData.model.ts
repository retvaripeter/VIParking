// schema for an arriving car
export class TableData {
  constructor(
    public rendszam: string,
    public erkezes: string,
    public name: string,
    public email: string,
    public autobrand: string
  ) {}
}

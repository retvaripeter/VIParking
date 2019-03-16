// this model describe the structur for the print message when a user just registered a car
export class PrintData {
  constructor(
    public rendszam: string,
    public erkezes: string,
    public name: string,
    public email: string
  ) {}
}

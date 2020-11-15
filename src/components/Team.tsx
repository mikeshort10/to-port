export interface IProps {
  teamName: string;
}

export class Team {
  constructor(props: IProps) {
    this.teamName = props.teamName;
  }
  teamName: string;
  // ships: number;
  // ports: number;

  // isOut = (): boolean => !(this.ships + this.ports);
}

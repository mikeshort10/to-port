import { Team } from "./Team";

export interface IProps {
  team: Team;
  type: "string";
}

export class Pawn {
  constructor(props: IProps) {
    this.team = props.team;
    this.type = props.type;
  }
  // id: number;
  // createdAt: Date;
  // updatedAt: Date;
  type: string;
  team: Team | null;
}

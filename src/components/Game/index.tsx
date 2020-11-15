import React from "react";
import { Pawn } from "../Pawn";
import { Team } from "../Team";
import { Board } from "../Board";
import "./index.scss";
import { Stats } from "../Stats";

export type GetRangeType = (
  position: number
) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

export interface IBoard<T> {
  [key: number]: T;
}

export interface IProps {}

export interface IState {
  windDirection: number;
  roll: number;
  range: IBoard<boolean>;
  rowLength: number;
  colLength: number;
  sharkPosition: number;
  board: IBoard<boolean>;
  pawns: IBoard<Pawn>;
  teams: Team[];
  activePlayer?: number;
}

function move(
  obj: IBoard<any>,
  current: number,
  next: number,
  replaceWith: any
): object {
  obj = { ...obj };
  obj[next] = obj[current];
  obj[current] = replaceWith;
  return obj;
}

export class Game extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      board: {},
      pawns: {},
      teams: [],
      windDirection: 3,
      roll: 0,
      range: {},
      rowLength: 44,
      colLength: 30,
      sharkPosition: 22 * 15
    };
  }

  roll = (numOfDice: number): number => {
    return Math.floor(Math.random() * 6 + 1) * numOfDice;
  };

  moveShip = (current: number, next: number): void => {
    const { pawns, board } = this.state;
    const newBoard = move(board, current, next, true);
    const newpawns = move(pawns, current, next, undefined);
  };

  moveShark = (): void => {
    let { sharkPosition } = this.state;
    const { windDirection, board, pawns } = this.state;
    const spacesByDirection = [-44, 1, 44, -1];
    const spacesPerMovement = spacesByDirection[windDirection];
    let roll = this.roll(2);
    let newPosition = sharkPosition + spacesPerMovement;
    while (board[newPosition] && !pawns[newPosition] && roll) {
      sharkPosition = newPosition;
      newPosition += spacesPerMovement;
      roll--;
    }
    if (pawns[newPosition] && roll) {
      const shipRoll = this.roll(1);
      const sharkRoll = this.roll(1);
      if (shipRoll < sharkRoll) {
        delete pawns[roll];
      }
    }
    this.setState({ sharkPosition, pawns, activePlayer: 0 });
  };

  changeWind = (): void => {
    this.setState(
      { windDirection: Math.floor(Math.random() * 4) },
      this.moveShark
    );
  };

  moveBonus = (direction: number): number => {
    const { windDirection } = this.state;
    if (windDirection === direction) {
      return 2;
    } else if (windDirection % 2 === direction % 2) {
      return 0.5;
    }
    return 1;
  };

  getRange: GetRangeType = position => e => {
    const range: IBoard<any> = {};
    const { rowLength } = this.state;
    const moveNorth = -rowLength * this.moveBonus(0);
    const moveEast = this.moveBonus(1);
    const moveSouth = rowLength * this.moveBonus(2);
    const moveWest = -this.moveBonus(3);
    const recGetRange = (space: number, toGo: number): void => {
      if (!this.state.board[space]) {
        return;
      }
      range[space] = toGo++;
      if (toGo <= this.state.roll) {
        recGetRange(space + moveNorth, toGo);
        recGetRange(space + moveEast, toGo);
        recGetRange(space + moveSouth, toGo);
        recGetRange(space + moveWest, toGo);
      }
    };
    recGetRange(position, 0);
    this.setState({ range });
  };

  newRound = () => {
    this.changeWind();
  };

  componentDidMount() {
    const board: IBoard<boolean> = {};
    const { rowLength, colLength } = this.state;
    console.log(rowLength * colLength);
    for (let i = 0; i < rowLength * colLength; i++) {
      board[i] = true;
    }
    this.setState({ board });
  }

  render() {
    const { windDirection, rowLength, colLength, board } = this.state;
    return (
      <>
        <Stats windDirection={windDirection} />
        <Board
          getRange={this.getRange}
          rowLength={rowLength}
          colLength={colLength}
          board={board}
        />
      </>
    );
  }
}

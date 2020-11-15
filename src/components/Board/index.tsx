import React from "react";
import map from "lodash/map";
import { IBoard, GetRangeType } from "../Game";
import "./index.scss";

export interface ISpaceProps {
  isSea: boolean;
  getRange: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function Space(props: ISpaceProps) {
  const cn = props.isSea ? "sea" : "land";
  return <div className={cn} onClick={props.getRange} />;
}

export interface IProps {
  rowLength: number;
  colLength: number;
  board: IBoard<boolean | number | undefined>;
  getRange: GetRangeType;
}

export interface IState {}

export class Board extends React.Component<IProps, IState> {
  renderSpaces() {
    const { board, getRange } = this.props;
    return map(board, (space, i) => (
      <Space key={i} getRange={getRange(+i)} isSea={space} />
    ));
  }

  render() {
    return <div id="board">{this.renderSpaces()}</div>;
  }
}

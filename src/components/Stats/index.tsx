import React from "react";
import "./index.scss";

export interface IProps {
  windDirection: number;
}

export class Stats extends React.Component<IProps> {
  render() {
    const { windDirection } = this.props;
    const rotate = (windDirection * 90 + 270) % 360;
    return (
      <div>
        <i className={`stats fas fa-wind rotate-${rotate}`} />
      </div>
    );
  }
}

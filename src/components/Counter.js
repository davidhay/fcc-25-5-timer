import React from "react";

const withLeadingZeros = (value) => {
  return (value < 10 ? "0" : "") + value;
};

const Counter = ({ counterId, label, mins, secs, timeLabel }) => {
  return (
    <React.Fragment>
      <div id={counterId} style={{ border: "1px solid black" }}>
        <div>{label}</div>
        <div id={timeLabel}>
          {withLeadingZeros(mins) + ":" + withLeadingZeros(secs)}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Counter;

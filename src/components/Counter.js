import React from "react";

const withLeadingZeros = (value) => {
  return (value < 10 ? "0" : "") + value;
};

const Counter = ({ label, mins, secs }) => {
  return (
    <React.Fragment>
      <div style={{ border: "1px solid black" }}>
        <div>{label}</div>
        <div>
          {withLeadingZeros(mins)}:{withLeadingZeros(secs)}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Counter;

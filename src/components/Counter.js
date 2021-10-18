import React from "react";
const Counter = ({ label, mins, secs }) => {
  return (
    <React.Fragment>
      <div>{label}</div>
      <div>
        {mins}:{secs}
      </div>
    </React.Fragment>
  );
};
export default Counter;

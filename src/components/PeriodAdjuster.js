import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const PeriodAdjuster = ({
  divId,
  upId,
  downId,
  value,
  onUp,
  onDown,
  label,
}) => {
  const appCtx = useContext(AppContext);

  const { active } = appCtx.state;

  return (
    <div id={divId}>
      <span>
        {label} {value}
      </span>
      <button id={upId} onClick={onUp} disabled={active}>
        Up
      </button>
      <button id={downId} onClick={onDown} disabled={active}>
        Down
      </button>
    </div>
  );
};

export default PeriodAdjuster;

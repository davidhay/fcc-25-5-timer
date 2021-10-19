import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const PeriodAdjuster = ({
  labelId,
  valueId,
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
    <div>
      <span id={labelId}>{label}</span>
      <span id={valueId}>{value}</span>
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

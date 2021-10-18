import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const PeriodAdjuster = ({ value, onUp, onDown, label }) => {
  const appCtx = useContext(AppContext);

  const { active } = appCtx.state;

  return (
    <div>
      <span>
        {label} : {value} mins (active?{active ? "Y" : "N"}).
      </span>
      <button onClick={onUp} disabled={active}>
        UP
      </button>
      <button onClick={onDown} disabled={active}>
        DOWN
      </button>
    </div>
  );
};

export default PeriodAdjuster;

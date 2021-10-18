import "./App.css";
import Ticker from "./components/Ticker";
import PeriodAdjuster from "./components/PeriodAdjuster";
import Counter from "./components/Counter";
import { useEffect, useContext } from "react";
import { AppContext } from "./context/AppContext";
const App = (props) => {
  const context = useContext(AppContext);
  const { state } = context;
  const {
    active,
    sessionMins,
    breakMins,
    isPeriodSession,
    periodMins,
    periodSecs,
  } = state;
  console.log("CONTEXT", context);
  console.log("STATE", state);
  console.log("ACTIVE", active);

  const resetStopped = () => {
    context.reset();
  };

  const doToggleActive = () => {
    context.toggleActive();
  };

  let count = 0;
  const onTickTock = () => {
    console.log("onTickTock[" + count++ + "]");
  };

  const onChangeBreakMins = (amt) => {
    return context.adjustBreakMins(amt);
  };

  const onChangeSessionMins = (amt) => {
    return context.adjustSessionMins(amt);
  };

  useEffect(() => {
    console.log("active now [" + active + "]");
  }, [active]);

  return (
    <div>
      BEFORE
      <div>
        <Ticker onTick={onTickTock} />
        <button onClick={doToggleActive}>
          active : {active ? "ACTIVE" : "NOT-ACTIVE"}
        </button>
        <button onClick={resetStopped}>RESET STOPPED!</button>
        <div>Session Mins {sessionMins}</div>
        <div>Break Mins {breakMins}</div>
        <PeriodAdjuster
          value={sessionMins}
          label={"Sessionn Minutes"}
          onUp={onChangeSessionMins(1)}
          onDown={onChangeSessionMins(-1)}
        />
        <PeriodAdjuster
          value={breakMins}
          label={"Break Minutes"}
          onUp={onChangeBreakMins(1)}
          onDown={onChangeBreakMins(-1)}
        />
        <Counter
          label={isPeriodSession ? "Session" : "Break"}
          mins={periodMins}
          secs={periodSecs}
        />
      </div>
    </div>
  );
};

export default App;

import "./App.css";
import Ticker from "./components/Ticker";
import PeriodAdjuster from "./components/PeriodAdjuster";
import Counter from "./components/Counter";
import { useEffect, useContext, useCallback } from "react";
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
    isZero,
  } = state;

  const { reset, toggleActive, countDown, adjustBreakMins, adjustSessionMins } =
    context;

  useEffect(() => {
    console.log({ isPeriodSession });
  }, [isPeriodSession]);

  const resetStopped = useCallback(() => {
    reset();
    resetAudio();
  }, [reset]);

  const doToggleActive = useCallback(() => {
    toggleActive();
  }, [toggleActive]);

  let count = 0;
  const onTickTock = useCallback(() => {
    countDown();
    //console.log("onTickTock[" + count++ + "]");
  }, [countDown, count]);

  const onChangeBreakMins = useCallback(
    (amt) => {
      return adjustBreakMins(amt);
    },
    [adjustBreakMins]
  );

  const onChangeSessionMins = useCallback(
    (amt) => {
      return adjustSessionMins(amt);
    },
    [adjustSessionMins]
  );

  /*
  useEffect(() => {
    console.log("active now [" + active + "]");
  }, [active]);
  */

  const resetAudio = () => {
    const beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
    console.log({ beep });
  };

  const playBeep = () => {
    document.getElementById("beep").play();
  };

  useEffect(() => {
    if (isZero) {
      playBeep();
    }
  }, [isZero]);

  return (
    <div>
      <button onClick={playBeep}>BEEPP</button>
      <audio id="beep" controls style={{ display: "none" }}>
        <source
          //src="./Tada-sound.mp3"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          type="audio/wav"
        />
        Your browser does not support the audio tag.
      </audio>
      <Ticker onTick={onTickTock} />
      <button id="start_stop" onClick={doToggleActive}>
        {active ? "Stop" : "Start"}
      </button>
      <button id="reset" onClick={resetStopped}>
        Reset
      </button>
      <PeriodAdjuster
        labelId="session-label"
        valueId="session-length"
        upId="session-increment"
        downId="session-decrement"
        value={sessionMins}
        label={"Session Length"}
        onUp={onChangeSessionMins(1)}
        onDown={onChangeSessionMins(-1)}
      />
      <PeriodAdjuster
        labelId="break-label"
        valueId="break-length"
        upId="break-increment"
        downId="break-decrement"
        value={breakMins}
        label={"Break Length"}
        onUp={onChangeBreakMins(1)}
        onDown={onChangeBreakMins(-1)}
      />
      <Counter
        counterId="timer-label"
        timeLabel="time-left"
        label={isPeriodSession ? "Session" : "Break"}
        mins={periodMins}
        secs={periodSecs}
      />
    </div>
  );
};

export default App;

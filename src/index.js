import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
/*
import React,{
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";
*/

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

const SESSION_DEFAULT = 25;
const BREAK_DEFAULT = 5;

const initialState = {
  active: false,
  breakMins: BREAK_DEFAULT,
  sessionMins: SESSION_DEFAULT,
  isPeriodSession: true,
  periodMins: SESSION_DEFAULT,
  periodSecs: 0,
  isZero: false,
};

const AppContext = createContext();

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

const AppContextProvider = (props) => {
  const [appState, setAppState] = useState(initialState);

  /*
  useEffect(() => {
    console.log("new state", { appState });
  }, appState);
  */

  const wrapped = useMemo(() => {
    return {
      state: appState,
      reset: () => {
        setAppState(initialState);
      },
      toggleActive: () => {
        setAppState((old) => {
          return {
            ...old,
            active: !old.active,
          };
        });
      },
      adjustBreakMins: (inc) => () => {
        setAppState((old) => {
          const orig = old.breakMins;
          const adjusted = orig + inc;
          let newVal = adjusted;
          if (adjusted <= 0 || adjusted > 60) {
            newVal = orig;
          }
          //console.log("BREAK MINS", { old, newVal, inc });
          return {
            ...old,
            breakMins: newVal,
            periodMins: old.isPeriodSession ? old.periodMins : newVal,
            periodSecs: old.isPeriodSession ? old.periodSecs : 0,
          };
        });
      },
      adjustSessionMins: (inc) => () => {
        setAppState((old) => {
          const orig = old.sessionMins;
          const adjusted = orig + inc;
          let newVal = adjusted;
          if (adjusted <= 0 || adjusted > 60) {
            newVal = orig;
          }
          return {
            ...old,
            sessionMins: newVal,
            periodMins: old.isPeriodSession ? newVal : old.periodMins,
            periodSecs: old.isPeriodSession ? 0 : old.periodSecs,
          };
        });
      },
      countDown: () => {
        //console.log("countDown being called!" + new Date());
        setAppState((oldState) => {
          let newSeconds = oldState.periodSecs - 1;
          let newMinutes = oldState.periodMins;
          let newPeriodIsSession = oldState.isPeriodSession;
          const isZero = newMinutes === 0 && newSeconds === 0;
          const flip = newMinutes === 0 && newSeconds < 0;
          if (flip) {
            newSeconds = 0;
            if (oldState.isPeriodSession) {
              //=> 'start of break'
              newMinutes = oldState.breakMins;
              newPeriodIsSession = false;
            } else {
              //=> 'start of session'
              newMinutes = oldState.sessionMins;
              newPeriodIsSession = true;
            }
          } else {
            if (newSeconds < 0) {
              newSeconds = 59;
              newMinutes = newMinutes - 1;
            }
          }

          const updatedState = {
            ...oldState,
            isPeriodSession: newPeriodIsSession,
            periodMins: newMinutes,
            periodSecs: newSeconds,
            isZero: isZero,
          };

          console.log({ newMinutes, newSeconds });
          return updatedState;
        });
      },
    };
  });

  return (
    <AppContext.Provider value={wrapped}>{props.children}</AppContext.Provider>
  );
};

const Ticker = ({ onTick }) => {
  const context = useContext(AppContext);
  const { state } = context;
  const { active } = state;
  // console.log("T CONTEXT", context);
  // console.log("T STATE", state);
  // console.log("T ACTIVE", active);

  const timerRef = useRef();
  //console.log("timerRef + active", timerRef, active);

  const scheduleTick = () => {
    // console.log("scheduleTick being called ", { active });
    // console.log("scheduleTick being called ", { active });
    // console.log("scheduleTick being called ", { active });
    if (!active) {
      //console.log("XXXX cannot schedule tick NOT ACTIVE");
      return;
    }
    timerRef.current = setTimeout(() => {
      if (!timerRef.current) {
        //console.log("TICK BUT NO TIMER REF");
        return;
      }
      if (!active) {
        //console.log("TICK BUT NOT ACTIVE");
        return;
      }
      try {
        //console.log("we have a tick!");
        onTick();
      } finally {
        scheduleTick();
      }
    }, 1000);
  };

  useEffect(() => {
    scheduleTick();
    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [active]);

  /*
  useEffect(() => {
    console.log("UPDATED STATE", state);
  }, [state]);
  */

  //return <p>Hello From Ticker active : {active ? "ACTIVE" : "NOT-ACTIVE"}</p>;
  return <React.Fragment>&nbsp;</React.Fragment>;
};

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

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

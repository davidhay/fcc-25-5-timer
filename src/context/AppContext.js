import { createContext, useEffect, useState, useMemo } from "react";

const SESSION_DEFAULT = 25;
const BREAK_DEFAULT = 5;

const initialState = {
  active: false,
  breakMins: BREAK_DEFAULT,
  sessionMins: SESSION_DEFAULT,
  isPeriodSession: true,
  periodMins: SESSION_DEFAULT,
  periodSecs: 0,
  flipped: false,
};

export const AppContext = createContext();

export function AppContextProvider(props) {
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
          //end if flip
          //console.log("XXXX", { newPeriodIsSession, newMinutes, newSeconds });

          const updatedState = {
            ...oldState,
            isPeriodSession: newPeriodIsSession,
            periodMins: newMinutes,
            periodSecs: newSeconds,
            flipped: flip,
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
}

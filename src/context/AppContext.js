import { createContext, useEffect, useState, useMemo } from "react";

const SESSION_DEFAULT = 2;
const BREAK_DEFAULT = 1;

const initialState = {
  active: false,
  breakMins: BREAK_DEFAULT,
  sessionMins: SESSION_DEFAULT,
  isPeriodSession: true,
  periodMins: SESSION_DEFAULT,
  periodSecs: 0,
};

export const AppContext = createContext();

export function AppContextProvider(props) {
  const [appState, setAppState] = useState(initialState);

  useEffect(() => {
    console.log("new state", { appState });
  }, appState);

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
          const newVal = adjusted <= 0 ? orig : adjusted;
          console.log("BREAK MINS", { old, newVal, inc });
          return {
            ...old,
            breakMins: newVal,
            periodMins: old.isPeriodSession ? old.periodMins : newVal,
            periodSecs: old.isPeriodSession ? old.periodSecs : 0,
          };
        });
      },
      countDown: () => {
        console.log("countDown being called!" + new Date());
        setAppState((oldState) => {
          let newSeconds = oldState.periodSecs - 1;
          let newMinutes = oldState.periodMins;
          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes = newMinutes - 1;
          }
          const flip = newMinutes === 0 && newSeconds === 0;
          let newPeriodIsSession = oldState.isPeriodSession;
          if (flip) {
            if (appState.isPeriodSession) {
              //=> 'start of break'
              newMinutes = oldState.breakMins;
              newSeconds = 0;
              newPeriodIsSession = false;
            } else {
              //=> 'start of session'
              newMinutes = oldState.breakMins;
              newSeconds = 0;
              newPeriodIsSession = true;
            }
          } //end if flip
          console.log("XXXX", { newPeriodIsSession, newMinutes, newSeconds });

          const updatedState = {
            ...oldState,
            isPeriodSession: newPeriodIsSession,
            periodMins: newMinutes,
            periodSecs: newSeconds,
          };
          console.log({ oldState, updatedState });
          return updatedState;
        });
      },
      adjustSessionMins: (inc) => () => {
        setAppState((old) => {
          const orig = old.sessionMins;
          const adjusted = orig + inc;
          const newVal = adjusted <= 0 ? orig : adjusted;
          console.log("SESSION MINS", { old, newVal, inc });
          return {
            ...old,
            sessionMins: newVal,
            periodMins: old.isPeriodSession ? newVal : old.periodMins,
            periodSecs: old.isPeriodSession ? 0 : old.periodSecs,
          };
        });
      },
    };
  });

  return (
    <AppContext.Provider value={wrapped}>{props.children}</AppContext.Provider>
  );
}

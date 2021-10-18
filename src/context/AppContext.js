import { createContext, useState } from "react";

const SESSION_DEFAULT = 20;
const BREAK_DEFAULT = 5;

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
  const wrapper = {
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

  return (
    <AppContext.Provider value={wrapper}>{props.children}</AppContext.Provider>
  );
}

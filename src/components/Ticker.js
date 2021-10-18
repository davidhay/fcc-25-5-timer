import { useEffect, useRef, useCallback, useContext } from "react";
import { AppContext } from "../context/AppContext";
const Ticker = ({ onTick }) => {
  const context = useContext(AppContext);
  const { state } = context;
  const { active } = state;
  console.log("T CONTEXT", context);
  console.log("T STATE", state);
  console.log("T ACTIVE", active);

  const timerRef = useRef();
  console.log("timerRef + active", timerRef, active);
  const scheduleTick = useCallback(() => {
    console.log("scheduleTick being called");
    if (active) {
      timerRef.current = setTimeout(() => {
        if (!timerRef.current) {
          return;
        }
        if (!active) {
          return;
        }
        try {
          console.log("we have a tick!");
          onTick();
        } finally {
          scheduleTick();
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        timerRef.current = null;
      } else {
        //no timer to stop.
      }
    }
  }, [active, onTick]);

  useEffect(scheduleTick, [active, onTick]);

  useEffect(() => {
    console.log("UPDATED STATE", state);
  }, [state]);

  return <p>Hello From Ticker active : {active ? "ACTIVE" : "NOT-ACTIVE"}</p>;
};

export default Ticker;

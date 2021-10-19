import React, { useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";

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

export default Ticker;

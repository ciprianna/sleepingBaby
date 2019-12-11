import React from "react";

import Header from "./components/Header";
import SleepTimes from "./components/SleepTimes";
import "./App.css";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <SleepTimes />
    </>
  );
};

// TODO
// - Figure out differentiation between AM and PM
// - Create a data structure by time that can count number of occurances of sleep at time x
// - Take all 24-hour periods and count how many times sleep per total time (percent)
// - Figure out how to get the percentage to show on the clock UI
//      Maybe probably dark color by percent chance of sleeping
// - Give more description of clock meaning and am/pm differentiation
// - Tests

export default App;

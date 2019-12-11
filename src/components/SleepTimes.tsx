import React, { useEffect } from "react";

import { getSleepTimes } from "../api/trackingData";
import Clock from "./Clock";

export default function SleepTimes() {
  useEffect(() => {
    getSleepTimes();
  });

  return <Clock />;
}

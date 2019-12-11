import { csv, DSVRowString, DSVParsedArray } from "d3";

const sleepData = require("../data/Ruby_sleep.csv");

interface SleepData {
  time: string;
  duration: number;
}

export async function getSleepTimes() {
  csv(sleepData, (rawData: DSVRowString) => {
    return {
      time: new Date(rawData.Time || "").toLocaleTimeString(),
      duration: Number(rawData["Duration(minutes)"])
    };
  })
    .then((data: DSVParsedArray<SleepData>) => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.log(error);
    });
}

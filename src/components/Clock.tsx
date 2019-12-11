import React, { useState, useEffect } from "react";
import * as d3 from "d3";

// CODE taken and modified from https://observablehq.com/@d3/simple-clock

interface HandData {
  type: string;
  value: number;
  length: number;
  scale: d3.ScaleLinear<number, number>;
  balance?: number;
}

export default function Clock() {
  const [svgNode, setSvgNode] = useState();
  const [time, setTime] = useState();

  useEffect(() => {
    drawClock();
    const svgContainer = document.getElementById("svg-container");
    setSvgNode(svgContainer);
  }, []);

  useEffect(() => {
    if (svgNode) {
      d3.select(svgNode)
        .append("svg")
        .attr("viewBox", `0, 0, ${clock.width}, ${clock.height}`)
        .style("max-width", "500px")
        .attr("id", "clock");
      drawClock();
    }
  }, [svgNode]);

  setInterval(() => {
    // Your custom logic here
    setTime(time + 1);
    updateData();
    moveHands();
  }, 1000);

  const radius = 200;
  const margin = 50;
  const clock = {
    radius,
    margin,
    width: (radius + margin) * 2,
    height: (radius + margin) * 2,
    hourHandLength: (2 * radius) / 3,
    minuteHandLength: radius,
    secondHandLength: radius - 12,
    secondHandBalance: 30,
    secondTickStart: radius,
    secondTickLength: -10,
    hourTickStart: radius,
    hourTickLength: -18,
    secondLabelRadius: radius + 16,
    secondLabelYOffset: 5,
    hourLabelRadius: radius - 40,
    hourLabelYOffset: 7,
    radians: Math.PI / 180
  };
  const twelve = d3
    .scaleLinear()
    .range([0, 360])
    .domain([0, 12]);

  const sixty = d3
    .scaleLinear()
    .range([0, 360])
    .domain([0, 60]);

  const handData = [
    {
      type: "hour",
      value: 0,
      length: -clock.hourHandLength,
      scale: twelve
    },
    {
      type: "minute",
      value: 0,
      length: -clock.minuteHandLength,
      scale: sixty
    },
    {
      type: "second",
      value: 0,
      length: -clock.secondHandLength,
      scale: sixty,
      balance: clock.secondHandBalance
    }
  ];

  const drawClock = () => {
    // create all the clock elements
    updateData(); //draw them in the correct starting position
    const face = d3
      .select("#clock")
      .append("g")
      .attr("id", "clock-face")
      .attr("transform", `translate(${[clock.width / 2, clock.height / 2]})`);

    // add marks for seconds
    face
      .selectAll(".second-tick")
      .data(d3.range(0, 60))
      .enter()
      .append("line")
      .attr("class", "second-tick")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", clock.secondTickStart)
      .attr("y2", clock.secondTickStart + clock.secondTickLength)
      .attr("transform", (d: number) => `rotate(${sixty(d)})`);

    // and labels...
    face
      .selectAll(".second-label")
      .data(d3.range(5, 61, 5))
      .enter()
      .append("text")
      .attr("class", "second-label")
      .attr("text-anchor", "middle")
      .attr(
        "x",
        (d: number) =>
          clock.secondLabelRadius * Math.sin(sixty(d) * clock.radians)
      )
      .attr(
        "y",
        (d: number) =>
          -clock.secondLabelRadius * Math.cos(sixty(d) * clock.radians) +
          clock.secondLabelYOffset
      )
      .text((d: number) => d);

    // ... and hours
    face
      .selectAll(".hour-tick")
      .data(d3.range(0, 12))
      .enter()
      .append("line")
      .attr("class", "hour-tick")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", clock.hourTickStart)
      .attr("y2", clock.hourTickStart + clock.hourTickLength)
      .attr("transform", (d: number) => `rotate(${twelve(d)})`);

    face
      .selectAll(".hour-label")
      .data(d3.range(3, 13, 3))
      .enter()
      .append("text")
      .attr("class", "hour-label")
      .attr("text-anchor", "middle")
      .attr(
        "x",
        (d: number) =>
          clock.hourLabelRadius * Math.sin(twelve(d) * clock.radians)
      )
      .attr(
        "y",
        (d: number) =>
          -clock.hourLabelRadius * Math.cos(twelve(d) * clock.radians) +
          clock.hourLabelYOffset
      )
      .text((d: number) => d);

    const hands = face.append("g").attr("id", "clock-hands");

    hands
      .selectAll("line")
      .data(handData)
      .enter()
      .append("line")
      .attr("class", (d: HandData) => d.type + "-hand")
      .attr("x1", 0)
      .attr("y1", (d: HandData) => d.balance || 0)
      .attr("x2", 0)
      .attr("y2", (d: HandData) => d.length)
      .attr("transform", (d: HandData) => `rotate(${d.scale(d.value)})`);

    face
      .append("g")
      .attr("id", "face-overlay")
      .append("circle")
      .attr("class", "hands-cover")
      .attr("x", 0)
      .attr("y", 0)
      .attr("r", clock.radius / 20);
  };

  const moveHands = () => {
    d3.select("#clock-hands")
      .selectAll("line")
      .data(handData)
      .transition()
      .ease(d3.easeElastic.period(0.5))
      .attr("transform", d => `rotate(${d.scale(d.value)})`);
  };
  const updateData = () => {
    const t = new Date();
    handData[0].value = (t.getHours() % 12) + t.getMinutes() / 60;
    handData[1].value = t.getMinutes();
    handData[2].value = t.getSeconds();
  };

  const svg = d3
    .create("svg")
    .attr("viewBox", `0, 0, ${clock.width}, ${clock.height}`)
    .style("max-width", "500px")
    .attr("id", "clock");

  return svg ? <svg id="svg-container" width={500} height={500} /> : null;
}

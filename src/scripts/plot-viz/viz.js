/**
 * This file contains utility functions for drawing the plot visualization.
 */

import d3Tip from "d3-tip";
import * as Tooltip from "./tooltip.js";

export function buildVisualization() {
  // set the dimensions and margins of the graph
  const margin = {
    top: 75,
    right: 200,
    bottom: 100,
    left: 100,
  };
  const svgSize = {
    width: 1100,
    height: 600,
  };
  const graphSize = {
    width: svgSize.width - margin.right - margin.left,
    height: svgSize.height - margin.bottom - margin.top,
  };
  // Add X axis
  var x = d3.scaleLinear().domain([100000, 2800000]).range([0, graphSize.width]);
  // Add Y axis
  var y = d3.scaleLinear().domain([200000, 900000]).range([graphSize.height, 0]);

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  // append the svg object to the body of the page
  const g = d3
    .select("#plot-viz")
    .select("svg")
    .attr("width", graphSize.width + margin.left + margin.right)
    .attr("height", graphSize.height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Get the Data
  var data = create_data();

  // Set x Axis
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + graphSize.height + ")")
    .call(xAxis.tickSize(8).tickSizeOuter(5))
    .append("text")
    .attr("class", "label")
    .attr("x", graphSize.width / 2)
    .attr("y", 40)
    .style("text-anchor", "middle")
    .text("Market 1,000,000€")
    .style("fill", "black");
  // Set y Axis
  g.append("g")
    .attr("class", "y axis")
    .call(yAxis.tickSize(9).tickSizeOuter(9))
    .append("text")
    .attr("class", "label")
    .attr(
      "transform",
      "translate(-70" + ", " + graphSize.height / 2 + ") rotate(-90)"
    )
    .style("text-anchor", "middle")
    .text("Base Salary $100,000")
    .style("fill", "black");

  // update drawing
  draw(data, x, y, g);
}

function draw(data, x, y, g) {
  /**
   * This is the graph update function
   */
  data.forEach(function (d) {
    d.x = +d.x;
    d.y = +d.y;
    d.yhat = +d.yhat;
  });

  var line = d3
    .line()
    .x(function (d) {
      return x(d.x);
    })
    .y(function (d) {
      return y(d.yhat);
    });

  // special color for Samuel Piette
  var colorChange = function (d) {
    return d.name == "Samuel Piette" ? "blue" : "red";
  };
  
  const tip = d3Tip()
    .attr("class", "d3-tip")
    .html(function (player, baseSalary, marketValue) {
      return Tooltip.getContents(
        player,
        baseSalary,
        marketValue,
        "Market Value 1,000,000€"
      );
    });
  g.append("g").attr("class", "scatter-plot-tooltip").call(tip);

  // change the dots
  g.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("stroke", colorChange)
    .attr("fill", colorChange)
    .attr("r", 3.5)
    .attr("cx", function (d) {
      return x(d.x);
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .on("mouseover", function (d) {
      d3.select(this).attr("opacity", 0.8);
      tip.show(d.name, d.y, d.x, "Market Value 1,000,000€", this);
    })
    .on("mouseleave", function (d) {
      d3.select(this).attr("opacity", 1.0);
      tip.hide();
    });

  // update the line
  var newLine = g.selectAll("line").data([data], function (d) {
    return d.x;
  });
  d3.selectAll(".reg").remove();
  g.append("path").attr("class", "reg")
    .datum(data)
    .attr("d", line)
    .attr("stroke-width", 5)
    .attr("stroke", "black")
    .attr("fill", "none")
    .merge(newLine)
    .transition()
    .duration(3000)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.yhat);
        })
    )
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2.5);

  // update dots for transition
  g.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("r", 3.5)
    .attr("cx", function (d) {
      return x(+d.x);
    })
    .attr("cy", function (d) {
      return y(+d.y);
    });
}

function create_data() {
  /**
   * This is the data generation function
   */
  var x = [];
  var y = [];
  const names = [
    "Samuel Piette",
    "Wil Trapp",
    "Jhegson Méndez",
    "Rémi Walter",
    "Facundo Quignon",
    "Dax McCarty",
  ];
  var b0 = 0;
  var b1 = 0;

  // create x and y values
  x = [2500000, 2000000, 1500000, 1500000, 2000000, 250000];
  y = [425000, 747500, 550000, 650000, 786000, 725000];
 

  b0 = 756689.47368;
  b1 = -0.06735;
  
  var yhat = [];
  // fit line using coeffs
  for (i = 0; i < x.length; i++) {
    yhat.push(b0 + x[i] * b1);
  }

  var data = [];
  for (var i = 0; i < y.length; i++) {
    data.push({
      yhat: yhat[i],
      y: y[i],
      x: x[i],
      name: names[i],
    });
  }

  return data;
}

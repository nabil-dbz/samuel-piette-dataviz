/**
 * This file contains utility functions for drawing the bar chart visualization.
 */
import d3Tip from 'd3-tip'
import * as Tooltip from './tooltip.js'

export function buildVisualization(data, feature) {
  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 20, left: 50}
  const width = 800 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  // append the svg object to the body of the page
  const svg = d3.select("#bar-chart-dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  const tip = d3Tip().attr('class', 'd3-tip').html(function (feature, value) { return Tooltip.getContents(feature, value) })
  svg.append('g').attr('class', 'bar-chart-tooltip').call(tip)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data[[feature]], function(d){ return(d.Player) }).keys()


  d3.select("#bar-chart-dataviz")
  // Add X axis
  const x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.6])
  
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, Math.max(...data[[feature]].map(element => element[[feature]]))])
    .range([ height, 0 ]);
  
  g.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain([feature])
    .range([0, x.bandwidth()])
    .padding([0.05])

  // Show the bars
  g.selectAll(null)
    .append("g")
    .data(data[[feature]])
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d['Player']); })
    .attr("y", function(d) { return y(d[[feature]]); })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function(d) { return height - y(d[[feature]]); })
    .attr("fill", function(d) { return d['Player'] == 'Samuel Piette' ? 'blue' : 'red'; })
    .on('mouseover', function(d) {
      d3.select(this).attr('opacity', 0.5)
      tip.show(feature, d[feature], this)
    })
    .on('mouseout', function() {
      d3.select(this).attr('opacity', 1.0)
      tip.hide()
    })
        
  g.selectAll("rect").attr("id", function(d ,i) { return "rect"+i; });
}

export function remove() {
  d3.select("#bar-chart-dataviz").selectAll("svg").remove();
}
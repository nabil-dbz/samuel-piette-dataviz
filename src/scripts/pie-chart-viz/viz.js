/**
 * This file contains utility functions for drawing the pie chart visualization.
 */

import d3Tip from 'd3-tip'
import * as Tooltip from './tooltip.js'

export function removeVisualization() {
  d3.select('.pie-chart-svg').selectAll('g').remove()
}

export function removeLegend() {
  d3.select('.pie-chart-legend').selectAll('g').remove()
}

export function buildVisualization(data, title, colorScale) {
  const svgWidth = 400
  const svgHeight = 400

  const svg = d3.select('.pie-chart-svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
  
  const g = svg.append('g')
    .attr('id', 'graph-g')
    .attr('transform', 'translate(' + svgWidth/2  + ',' + svgHeight/2  + ')')

  const tip = d3Tip().attr('class', 'd3-tip').html(function(player, value) { return Tooltip.getContents(player, value) })
  svg.append('g').attr('class', 'pie-chart-tooltip').call(tip)
  
  drawDonutChart(g, data, colorScale, tip)
  drawDonutTitle(g, title)
}

function drawDonutChart(g, data, colorScale, tip) {
  const width = 300
  const height = 400
  const margin = 40
  const radius = Math.min(width, height) / 2 - margin
  const pie = d3.pie().value(function(d) { return d.value; })
  const dataReady = pie(d3.entries(data.map((element) => element.value)))
  var sum = 0
  data.forEach(element => {
    sum += element.value
  })
  const playersContributions = data.map(element => element.value/sum)
  const playersNames = data.map(element => element.name)
    
  g.selectAll(null)
    .data(dataReady)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(140)         
      .outerRadius(radius)
    )
    .attr('fill', function(d) { return(colorScale(playersNames[d.data.key])) })
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .on('mouseover', function(d) {
      d3.select(this).attr('opacity', 0.8)
      tip.show(playersNames[d.data.key], playersContributions[d.data.key], this)
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('opacity', 1.0)
      tip.hide()
    })
}

function drawDonutTitle(g, title) {
  g.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('font-family', 'black')
    .attr('font-size', 16)
    .attr('text-anchor', 'middle')
    .text(title)
}

export function drawLegend(data, title, colorScale) {
  const width = 200
  const height = 400
  const svg = d3.select('.pie-chart-legend')
    .attr('width', width)
    .attr('height', height)

  const g = svg.append('g').attr('id', 'pie-legend')

  const players = data.map(element => { 
    
    return {
      name: element.name,
      value: element.value,
      selected: true,
    }
  })

  g.append('text')
    .attr('x', 20)
    .attr('y', 130)
    .text('Legend')
  

  drawLegendRectangles(g, players, colorScale)
  drawLegendPlayersNames(g, players, colorScale)
  setLegendClickHandler(players, title, colorScale)
}

function drawLegendPlayersNames(g, players, colorScale) {
  const size = 20
  g.selectAll('player-name')
    .data(players)
    .enter()
    .append('text')
    .attr('class', 'player-name')
    .attr('x', 50 + size * 1.2)
    .attr('y', function(d,i) { 
      return 150 + i * (size + 5) + (size / 2) 
    }) 
    .attr('fill', function(d) { 
      return colorScale(d.name) 
    })
    .attr('text-anchor', 'left')
    .attr('dominant-baseline', 'middle')
    .text(function(d) { 
      return d.name 
    })
}

function drawLegendRectangles(g, players, colorScale) {
  const size = 20
  g.selectAll('pie-legend-rect')
    .data(players)
    .enter()
    .append('rect')
    .attr('class', 'pie-legend-rect')
    .attr('x', 20)
    .attr('y', function(d,i) { 
      return 150 + i * (size + 5) 
    }) 
    .attr('width', size)
    .attr('height', size)
    .attr('fill', function(d) { 
      return d.selected ? colorScale(d.name): 'white'
    })
    .attr('stroke', function(d) { 
      return colorScale(d.name) 
    })
    .on('mouseover', function() {
      d3.select(this).attr('opacity', 0.7)
    })
    .on('mouseout', function() {
      d3.select(this).attr('opacity', 1.0)
    })
}

function setLegendClickHandler(players, title, colorScale) {
  d3.selectAll('.pie-legend-rect')
    .on('click', function(d) {
      if (d.name === 'Samuel Piette' || d.name === 'Others') {
        return 
      }
      d.selected = !d.selected
      d3.select(this).attr('fill', d.selected ? colorScale(d.name): 'white')
      removeVisualization()
      buildVisualization(computeNewData(players), title, colorScale)
    })
}

function computeNewData(players) {
  const data = []
  var othersValue = 0
  players.forEach(player => {
    if (player.selected && player.name != 'Others') {
      data.push({
        name: player.name,
        value: player.value,
      })
    } else {
      othersValue += player.value
    }
  })
  data.push({
    name: 'Others',
    value: othersValue,
  })
  return data
}

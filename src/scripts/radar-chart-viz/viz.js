/**
 * This file contains utility functions for drawing the radar chart visualization.
 */
import d3Tip from 'd3-tip'
import * as Helper from './helper.js'
import * as Tooltip from './tooltip.js'

let processed_data = []

function drawLevelLines(svg, levels, nFeatures, radialScale) {
  const levelLines = svg.append('g').attr('class', 'level-lines')
  for (var i = 0; i < levels.length; i++) {
    const g = levelLines.append('g').attr('class', 'level-lines-' + i)
    for (var j = 1; j <= nFeatures; j++) {
      let firstPointAngle = (Math.PI / 2) + (2 * Math.PI * (j - 1) / nFeatures);
      let secondPointAngle = (Math.PI / 2) + (2 * Math.PI * j / nFeatures);
      
      let firstPointCoordinate = Helper.angleToCoordinate(firstPointAngle, levels[i], radialScale);
      let secondPointCoordinate = Helper.angleToCoordinate(secondPointAngle, levels[i], radialScale);
      
      // Draw level line
      g.append('line')
        .attr('x1', firstPointCoordinate.x)
        .attr('y1', firstPointCoordinate.y)
        .attr('x2', secondPointCoordinate.x)
        .attr('y2', secondPointCoordinate.y)
        .attr('stroke','grey')
        .attr('stroke-dasharray', 2);
    }  
  }
}

function drawTicks(svg, levels, radialScale) {
  const g = svg.append('g').attr('class', 'level-labels')
  levels.forEach(level =>
    g.append('text')
      .attr('x', 253)
      .attr('y', 215 - radialScale(level))
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '12')
      .attr('fill','grey')
      .text(level.toString())
  );
}

function drawAxis(svg, features, radialScale) {
  const allAxis = svg.append('g').attr('class', 'axis')
  for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = Helper.angleToCoordinate(angle, 10, radialScale);
    let label_coordinate = Helper.angleToCoordinate(angle, 10.5, radialScale);

    const axis = allAxis.append('g').attr('class', 'axis-' + i)

    // Draw axis line
    axis.append('line')
      .attr('x1', 250)
      .attr('y1', 200)
      .attr('x2', line_coordinate.x)
      .attr('y2', line_coordinate.y)
      .attr('stroke','grey');

    // Draw axis label
    axis.append('text')
      .attr('x', label_coordinate.x)
      .attr('y', label_coordinate.y)
      .attr('dominant-baseline', 'right')
      .attr('text-anchor', label_coordinate.x > 260 ? 'start' : label_coordinate.x < 240 ? 'end' : 'middle')
      .text(ft_name);
  }
}

function drawOnePlayerArea(areaLines, data, color, playerId, tip) {
  const g = areaLines.append('g').attr('class', 'area-lines-' + playerId)

  g.append('polygon')
    .attr('class', 'level-' + playerId)
    .attr("stroke-width", 2)
    .attr("fill", 'none')
    .attr('stroke', color);

  g.selectAll('.dot')
    .data(data['dots'])
    .join('circle')
    .attr('class', 'dot-' + playerId)
    .attr('r', 3)
    .attr('fill', color)
    .attr('stroke', color)
    .on('mouseover', function(d) { 
      this.style.opacity = '0.7'
      this.setAttribute('r', 5)
      tip.show(d, this)
    })
    .on('mouseout', function() {
      this.style.opacity = '1.0'
      this.setAttribute('r', 3)
      tip.hide()
    })
}

function movePlayerArea(data, playerId) {
  d3.select('.level-' + playerId)
    .transition()
    .duration(3)
    .attr('points', data['points'])

  d3.selectAll('.dot-' + playerId)
    .data(data['dots'])
    .transition()
    .duration(3)
    .attr('cx', dot => dot.coords.x)
    .attr('cy', dot => dot.coords.y)
}

function drawPlayerArea(firstPlayer, secondPlayer) {
  movePlayerArea(processed_data[firstPlayer], 1)
  movePlayerArea(processed_data[secondPlayer], 2)
}

export function buildVisualization(data, radialScale) {
  /**
   * This is the global function
   */
  processed_data = data
  const svgWidth = 500
  const svgHeight = 400

  const svg = d3.select('.radar-chart-svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
  const ticks = [2,4,6,8,10];
  const features = data['Samuel Piette']['features'];

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d) { return Tooltip.getContents(d) })
  const g = svg.append('g').attr('class', 'radar-tooltip')
  g.call(tip)

  drawLevelLines(svg, ticks, features.length, radialScale)
  drawTicks(svg, ticks, radialScale)
  drawAxis(svg, features, radialScale)

  drawOnePlayerArea(svg, processed_data['Samuel Piette'], 'blue', 1, tip)
  drawOnePlayerArea(svg, processed_data['Wil Trapp'], 'red', 2, tip)
  drawPlayerArea('Samuel Piette', 'Wil Trapp')
}

export function drawLegend(data, selectedPlayer) {
  const width = 200
  const height = 400
  const svg = d3.select('.radar-chart-legend')
    .attr('width', width)
    .attr('height', height)

  const g = svg.append('g').attr('id', 'radar-legend')
  
  const players = Object.keys(data).map(element => { 
    return {
      name: element,
      color: element === 'Samuel Piette' ? 'blue' :  'red',
      selected: element === 'Samuel Piette' || element === selectedPlayer,
    }
  })
  
  g.append('text')
  .attr('x', 20)
  .attr('y', 130)
  .text('Legend')
  
  drawLegendRectangles(g, players)
  drawLegendPlayersNames(g, players)
  setLegendClickHandler(players)
}

function drawLegendPlayersNames(g, players) {
  const size = 20
  g.selectAll('radar-player-name')
    .data(players)
    .enter()
    .append('text')
    .attr('class', 'radar-player-name')
    .attr('x', 50 + size * 1.2)
    .attr('y', function(d,i) { 
      return 150 + i * (size + 5) + (size / 2) 
    }) 
    .attr('fill', function(d) { 
      return d.color 
    })
    .attr('text-anchor', 'left')
    .attr('dominant-baseline', 'middle')
    .text(function(d) { 
      return d.name 
    })
}

function drawLegendRectangles(g, players) {
  const size = 20
  g.selectAll('radar-legend-rect')
    .data(players)
    .enter()
    .append('rect')
    .attr('class', 'radar-legend-rect')
    .attr('x', 20)
    .attr('y', function(d,i) { 
      return 150 + i * (size + 5) 
    }) 
    .attr('width', size)
    .attr('height', size)
    .attr('fill', function(d) { 
      return d.selected ? d.color: 'white'
    })
    .attr('stroke', function(d) { 
      return d.color 
    })
    .on('mouseover', function() {
      d3.select(this).attr('opacity', 0.7)
    })
    .on('mouseout', function() {
      d3.select(this).attr('opacity', 1.0)
    })
}

function setLegendClickHandler(players) {
  d3.selectAll('.radar-legend-rect')
    .on('click', function(d) {
      if (d.name === 'Samuel Piette') {
        return 
      }
      if (d.selected) {
        return
      }
      d.selected = true
      players.forEach(element => {
        if (element.selected && element.name != d.name && element.name != 'Samuel Piette') {
          element.selected = false
          return
        }
      })
      d3.selectAll('.radar-legend-rect')
        .attr('fill', function(d) { return d.selected ? d.color : 'white' })
      drawPlayerArea('Samuel Piette', d.name)
    })
}

/**
 * This file contains utility functions for drawing the global visualization.
 */

import d3Tip from 'd3-tip'
import * as Tooltip from './tooltip.js'

export function buildVisualization(data) {
  /**
   * This is the global function
   */
  var height;
  var width;
  const svg = d3.select('.global-svg')
    .attr('width', '100%')
    .attr('height', function(d) {
      width = this.scrollWidth
      height = this.scrollWidth * 0.75
      return height
    })

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d, feature) { return Tooltip.getContents(d, feature) })
  const g = svg.append('g').attr('class', 'global-tooltip')
  g.call(tip)

  buildField(svg, height, width)
  drawData(svg, data['data'], tip, height, width)
  buildGlobalInfo(data['global'])
  drawLegend(data['data'], height)
}

function buildField(svg, height, width) {
  const g = svg.append('g').attr('id', 'field')
  g.append('rect')
    .attr('x', 0)
    .attr('y', '2.5%')
    .attr('width', '100%')
    .attr('height', '95%')
    .attr('fill', '#bcec93')

  const fieldHeight = 95
  const fieldWidth = 90
  const offsetX = 5
  const offsetY = 2.5
  g.append('rect')
    .attr('x', offsetX + '%')
    .attr('y', offsetY + '%')
    .attr('width', fieldWidth + '%')
    .attr('height', fieldHeight + '%')
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')

  g.append('line')
    .attr('x1', (fieldWidth + 2 * offsetX) / 2 + '%')
    .attr('y1', offsetY + '%')
    .attr('x2', (fieldWidth + 2 * offsetX) / 2 + '%')
    .attr('y2', (fieldHeight +  offsetY) + '%')
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')

  g.append('circle')
    .attr('cx', (fieldWidth + 2 * offsetX) / 2 + '%')
    .attr('cy', (fieldHeight + 2 * offsetY) / 2 + '%')
    .attr('r', '10%')
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')
    .attr('fill', 'none')

  g.append('rect')
    .attr('x', offsetX + '%')
    .attr('y', (offsetY + fieldHeight / 4) + '%')
    .attr('width', fieldWidth / 6 + '%')
    .attr('height', fieldHeight / 2 + '%')
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')
    .attr('fill', 'none')

  g.append('rect')
    .attr('x', (offsetX + fieldWidth - fieldWidth / 6) + '%')
    .attr('y', (offsetY + fieldHeight / 4) + '%')
    .attr('width', fieldWidth / 6 + '%')
    .attr('height', fieldHeight / 2 + '%')
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')
    .attr('fill', 'none')

  g.append('rect')
    .attr('x', offsetX + '%')
    .attr('y', offsetY + 3 * fieldHeight / 8 + '%')
    .attr('width', fieldWidth / 14 + '%')
    .attr('height', fieldHeight / 4 + '%')
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')
    .attr('fill', 'none')

  g.append('rect')
    .attr('x', (offsetX + fieldWidth - fieldWidth / 14) + '%')
    .attr('y', (offsetY + 3 * fieldHeight / 8) + '%')
    .attr('width', fieldWidth / 14 + '%')
    .attr('height', fieldHeight / 4 + '%')
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')
    .attr('fill', 'none')

  var startPoint = 'M' + (offsetX + fieldWidth / 6) * width / 100  + ' ' + (offsetY + 3 * fieldHeight / 8) * height / 100
  var endPoint = ' ' + (offsetX + fieldWidth / 6) * width / 100  + ' ' + (offsetY + 5 * fieldHeight / 8) * height / 100
  var controlPoint = ' Q ' + (offsetX + fieldWidth / 6 + 5) * width / 100  + ' ' + (offsetY + fieldHeight / 2) * height / 100
  var path = startPoint + controlPoint + endPoint
  g.append('path')
    .attr('d', path)
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')
    .attr('fill', 'none')

  startPoint = 'M' + (offsetX + fieldWidth - fieldWidth / 6)  * width / 100 + ' ' + (offsetY + 3 * fieldHeight / 8) * height / 100
  endPoint = ' ' + (offsetX + fieldWidth - fieldWidth / 6)  * width / 100 + ' ' + (offsetY + 5 * fieldHeight / 8) * height / 100
  controlPoint = ' Q ' + (offsetX + fieldWidth - fieldWidth / 6 - 5)  * width / 100 + ' ' + (offsetY + fieldHeight / 2) * height / 100
  path = startPoint + controlPoint + endPoint
  g.append('path')
    .attr('d', path)
    .attr('stroke', 'white')
    .attr('stroke-width', '2px')
    .attr('fill', 'none')
}

function drawData(svg, data, tip, height, width) {
  const fieldHeight = 95
  const fieldWidth = 90
  const offsetX = 5
  const offsetY = 2.5
  const g = svg.append('g').attr('id', 'field-data')
  g.selectAll(null)
    .data(data['Tackles'])
    .enter()
    .append('circle')
    .attr('cx', function (d, i) {
      return (offsetX + fieldWidth / 10 + (i + 1) * 0.2 * fieldWidth) * width / 100
    })
    .attr('cy', (offsetY + fieldHeight / 5) * height / 100)
    .attr('r', element => element['Percentage'] * 15 + '%')
    .attr('fill', '#9AD0EC')
    .on('mouseover', function(d) {
      d3.select(this).attr('opacity', 0.8)
      tip.show(d, 'Tackles', this)
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('opacity', 1.0)
      tip.hide()
    })

  g.selectAll(null)
    .data(data['Touches'])
    .enter()
    .append('circle')
    .attr('cx', function (d, i) {
      return (offsetX + fieldWidth / 10 + i * 0.2 * fieldWidth) * width / 100
    })
    .attr('cy', (offsetY + fieldHeight / 2) * height / 100)
    .attr('r', element => element['Percentage'] * 15 + '%')
    .attr('fill', '#C3B091')
    .on('mouseover', function(d) {
      d3.select(this).attr('opacity', 0.8)
      tip.show(d, 'Touches', this)
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('opacity', 1.0)
      tip.hide()
    })

  g.selectAll(null)
    .data(data['Pressures'])
    .enter()
    .append('circle')
    .attr('cx', function (d, i) {
      return (offsetX + fieldWidth / 10 + (i + 1) * 0.2 * fieldWidth) * width / 100
    })
    .attr('cy', (offsetY + 4 * fieldHeight / 5) * height / 100)
    .attr('r', element => element['Percentage'] * 15 + '%')
    .attr('fill', '#A6A6A4')
    .on('mouseover', function(d) {
      d3.select(this).attr('opacity', 0.8)
      tip.show(d, 'Pressures', this)
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('opacity', 1.0)
      tip.hide()
    })
}

function buildGlobalInfo(data) {
  const svg = d3.select('#global-info')
  const g = svg.append('g')
  const offset = 20
  g.selectAll(null)
    .data(data)
    .enter()
    .append('text')
    .attr('x', '5%')
    .attr('y', function(d, i) {
      return (i + 1) * offset + '%'
    })
    .text(function(d) { return d['Feature'] })
    .style('font-size', '18px')

  g.selectAll(null)
    .data(data)
    .enter()
    .append('text')
    .attr('x', '40%')
    .attr('y', function(d, i) {
      return (i + 1) * offset + '%'
    })
    .text(function(d) { return d['Value'] })
    .style('font-size', '18px')
}

function drawLegend(data, height) {
  var legendWidth
  const svg = d3.select('.global-legend')
    .attr('width', '100%')
    .attr('height', function(d) {
      legendWidth = this.scrollWidth
      return height
    })

  const g = svg.append('g').attr('id', 'global-legend')
  
  const features = Object.keys(data).sort()
  const colors = ['#9AD0EC', '#A6A6A4', '#C3B091']
  
  g.append('text')
    .attr('x', '0')
    .attr('y', '30%')
    .text('Legend')
  
  drawLegendFeatures(g, features, colors, legendWidth, height)
  drawLegendRectangles(g, colors, legendWidth, height)
}

function drawLegendFeatures(g, features, colors, width, height) {
  const size = 20
  g.selectAll('.global-feature')
    .data(features)
    .enter()
    .append('text')
    .attr('class', 'global-feature')
    .attr('x', (5 + size) + '%')
    .attr('y', function(d,i) { 
      const rectangleHeight = ((width * size / 100) / height) * 100
      return (40 + i * (rectangleHeight + 3) + (rectangleHeight / 2)) + '%'  
    }) 
    .attr('fill', function(d, i) { 
      return colors[i]
    })
    .attr('text-anchor', 'left')
    .attr('dominant-baseline', 'middle')
    .text(element => element)
}

function drawLegendRectangles(g, colors, width, height) {
  const size = 20
  g.selectAll(null)
    .data(colors)
    .enter()
    .append('rect')
    .attr('class', 'global-legend-rect')
    .attr('x', '0')
    .attr('y', function(d,i) { 
      const rectangleHeight = (width * size / 100)
      return (40 + i * ((rectangleHeight / height) * 100 + 3)) + '%' 
    }) 
    .attr('width', size + '%')
    .attr('height', width * size / 100)
    .attr('fill', element => element)
    .attr('stroke', element => element)
}

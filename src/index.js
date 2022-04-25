'use strict'

import * as PreprocessBarChart from './scripts/bar-chart-viz/preprocess.js'
import * as PreprocessGlobal from './scripts/global-viz/preprocess.js'
import * as PreprocessPieChart from './scripts/pie-chart-viz/preprocess.js'
import * as PreprocessRadarChart from './scripts/radar-chart-viz/preprocess.js'
import * as VizBarChart from './scripts/bar-chart-viz/viz.js'
import * as VizGlobal from './scripts/global-viz/viz.js'
import * as VizPieChart from './scripts/pie-chart-viz/viz.js'
import * as VizPlot from './scripts/plot-viz/viz.js'
import * as VizRadarChart from './scripts/radar-chart-viz/viz.js'
import * as HelperPieChart from './scripts/pie-chart-viz/helper'
import * as HelperBarChart from './scripts/bar-chart-viz/helper'

/**
 * @file This file is the code for the INF8808's project.
 * @author Nabil Dabouz - Anoir Dhaoui - Samba Bousso Bal - Khadija Rekik
 * @version v1.0.0
 */
(function (d3) {
  const FILE_PATH_BAR       = './playing-time-cfmontreal.csv'
  const FILE_PATH_GLOBAL1   = './possession-cfmontreal.csv'
  const FILE_PATH_GLOBAL2   = './defensive-actions-cfmontreal.csv'
  const FILE_PATH_PIE       = './passes-shots-cfmontreal.csv'
  const FILE_PATH_RADAR1    = './samuel-piette-shots.csv'
  const FILE_PATH_RADAR2    = './samuel-piette-passes.csv'
  const FILE_PATH_RADAR3    = './samuel-piette-possession.csv'
  const FILE_PATH_RADAR4    = './samuel-piette-defensive-actions.csv'

  /*************************************Scatter Plot******************************/
  VizPlot.buildVisualization()
  /**************************************Bar Chart********************************/
  var barChartProcessedData = {}
  d3.csv(FILE_PATH_BAR).then(function (data) {
    barChartProcessedData = PreprocessBarChart.processData(data)
    VizBarChart.remove()
    VizBarChart.buildVisualization(barChartProcessedData, HelperBarChart.FEATURES_MAP[0])
  })
  /************************************Global Viz**********************************/
  d3.csv(FILE_PATH_GLOBAL1).then(function (possessionData) {
    d3.csv(FILE_PATH_GLOBAL2).then(function (defensiveActionsData) {
      const processed_data = PreprocessGlobal.processData(possessionData, defensiveActionsData)
      VizGlobal.buildVisualization(processed_data)
    })
  })
  /**************************************Pie Chart********************************/
  var pieProcessedData = {}
  d3.csv(FILE_PATH_PIE).then(function (data) {
    pieProcessedData = PreprocessPieChart.processData(data)
    const feature = HelperPieChart.FEATURES_MAP[0]
    const colorScale = HelperPieChart.setColorScale(pieProcessedData[feature])
    VizPieChart.drawLegend(pieProcessedData[feature], feature, colorScale)
    VizPieChart.buildVisualization(pieProcessedData[feature], feature, colorScale)
  })

  /**************************************Radar Chart********************************/
  d3.csv(FILE_PATH_RADAR1).then(function (shotsData) {
    d3.csv(FILE_PATH_RADAR2).then(function (passesData) {
      d3.csv(FILE_PATH_RADAR3).then(function (possessionData) {
        d3.csv(FILE_PATH_RADAR4).then(function (defensiveActionsData) {
          const radialScale = d3.scaleLinear()
            .domain([0,10])
            .range([0,150]);
          const processed_data = PreprocessRadarChart.processData(shotsData, passesData, possessionData, defensiveActionsData, radialScale)
          VizRadarChart.drawLegend(processed_data, 'Wil Trapp')
          VizRadarChart.buildVisualization(processed_data, radialScale)
        })
      })
    })
  })
  /*******************************************************************************/
  document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tabs');
    const instance1 = M.Tabs.init(tabs[0], {onShow: () => {
      VizBarChart.remove()
      VizBarChart.buildVisualization(barChartProcessedData, HelperBarChart.FEATURES_MAP[instance1.index])
    }});
    const instance2 = M.Tabs.init(tabs[1], {onShow: () => {
    const feature = HelperPieChart.FEATURES_MAP[instance2.index]
    const colorScale = HelperPieChart.setColorScale(pieProcessedData[feature])
    VizPieChart.removeLegend()
    VizPieChart.removeVisualization()
    VizPieChart.drawLegend(pieProcessedData[feature], feature, colorScale)
    VizPieChart.buildVisualization(pieProcessedData[feature], feature, colorScale)

    }});
  });
})(d3)

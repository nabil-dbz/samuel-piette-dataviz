/**
 * This file contains utility functions for the data preprocessing. 
 */
import * as Helper from './helper.js'

const FEATURES_MAP = {
  'Shot Accuracy': {
    'columns': ['TC%'],
    'scale': [10, 40]
  },
  'Pass Completion': {
    'columns': ['Cmp - Passes réussis', 'Att - passes tentés'],
    'scale': [60, 100]
  },
  'Successful Pressure': {
    'columns': ['Press%'],
    'scale': [15, 55]
  },
  'Completed Dribbles': {
    'columns': ['Dribbles%'],
    'scale': [50, 100]
  },
  'Tackled Dribbles': {
    'columns': ['Tcl%'],
    'scale': [20, 70]
  },
  'Reception': {
    'columns': ['Rec%'],
    'scale': [50, 100]
  }
}

export function processData(shotsData, passesData, possessionData, defensiveActionsData, radialScale) {
  const data = prepareData(shotsData, passesData, possessionData, defensiveActionsData)
  const features = Object.keys(data['Samuel Piette']);

  const processedData = {}
  for (var element in data) {
    let points = ''
    const dots = []
    for (var j = 0; j < features.length; j++) {
      const pointAngle = (Math.PI / 2) + (2 * Math.PI * j / features.length);
      const pointData = (data[element][features[j]] - FEATURES_MAP[features[j]]['scale'][0]) / (FEATURES_MAP[features[j]]['scale'][1] - FEATURES_MAP[features[j]]['scale'][0]) 
      const pointCoordinates = Helper.angleToCoordinate(pointAngle, pointData * 10, radialScale);
      points += pointCoordinates.x + ',' + pointCoordinates.y + ' '
      dots.push({
        'coords': pointCoordinates,
        'value': data[element][features[j]],
        'player': element,
        'feature': features[j]
      })
    }
    processedData[element] = {
      'dots': dots,
      'points': points,
      'features': features
    }
  }

  return processedData
}

function prepareData(shotsData, passesData, possessionData, defensiveActionsData) {
  const returnValue = {}
  shotsData.forEach(element => {
    returnValue[element['Joueur']] = {}
    returnValue[element['Joueur']]['Shot Accuracy'] = element[FEATURES_MAP['Shot Accuracy']['columns'][0]]
  })
  passesData.forEach(element => {
    returnValue[element['Joueur']]['Pass Completion'] = (element[FEATURES_MAP['Pass Completion']['columns'][0]] / element[FEATURES_MAP['Pass Completion']['columns'][1]]) * 100
  })
  possessionData.forEach(element => {
    returnValue[element['Joueur']]['Completed Dribbles'] = element[FEATURES_MAP['Completed Dribbles']['columns'][0]]
  })
  possessionData.forEach(element => {
    returnValue[element['Joueur']]['Reception'] = element[FEATURES_MAP['Reception']['columns'][0]]
  })
  defensiveActionsData.forEach(element => {
    returnValue[element['Joueur']]['Successful Pressure'] = element[FEATURES_MAP['Successful Pressure']['columns'][0]]
  })
  defensiveActionsData.forEach(element => {
    returnValue[element['Joueur']]['Tackled Dribbles'] = element[FEATURES_MAP['Tackled Dribbles']['columns'][0]]
  })
  return returnValue
}

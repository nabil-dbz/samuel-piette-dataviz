/**
 * This file contains utility functions for the data preprocessing. 
 */

export function processData(possessionData, defensiveActionsData) {
  const data = {
    'global': [
      {
        'Feature': 'Height',
        'Value': '1.71m'
      },
      {
        'Feature': 'Age',
        'Value': 27
      },
      {
        'Feature': 'Nationality',
        'Value': 'Canada'
      },
      {
        'Feature': 'Position',
        'Value': 'Centre Midfielder (CM)'
      },
    ],
    'data': prepareData(possessionData, defensiveActionsData)
  }
  return data
}

function prepareData(possessionData, defensiveActionsData) {
  const pressures = []
  defensiveActionsData.forEach(element => {
    if (element.Player == 'Samuel Piette') {
      const sum = parseInt(element['Press Def 3rd']) + parseInt(element['Press Mid 3rd']) + parseInt(element['Press Att 3rd'])
      pressures.push({
        'Value': element['Press Def 3rd'],
        'Percentage': element['Press Def 3rd'] / sum,
      })
      pressures.push({
        'Value': element['Press Mid 3rd'],
        'Percentage': element['Press Mid 3rd'] / sum,
      })
      pressures.push({
        'Value': element['Press Att 3rd'],
        'Percentage': element['Press Att 3rd'] / sum,
      })
    }
  })
  const touches = []
  possessionData.forEach(element => {
    if (element.Player == 'Samuel Piette') {
      const sum = parseInt(element['Touches Def Pen']) + parseInt(element['Touches Def 3rd']) + parseInt(element['Touches Mid 3rd']) + parseInt(element['Touches Att 3rd']) + parseInt(element['Touches Att Pen'])
      touches.push({
        'Value': element['Touches Def Pen'],
        'Percentage': element['Touches Def Pen'] / sum,
      })
      touches.push({
        'Value': element['Touches Def 3rd'],
        'Percentage': element['Touches Def 3rd'] / sum,
      })
      touches.push({
        'Value': element['Touches Mid 3rd'],
        'Percentage': element['Touches Mid 3rd'] / sum,
      })
      touches.push({
        'Value': element['Touches Att 3rd'],
        'Percentage': element['Touches Att 3rd'] / sum,
      })
      touches.push({
        'Value': element['Touches Att Pen'],
        'Percentage': element['Touches Att Pen'] / sum,
      })
    }
  })
  const tackles = []
  defensiveActionsData.forEach(element => {
    if (element.Player == 'Samuel Piette') {
      const sum = parseInt(element['Tkl Def 3rd']) + parseInt(element['Tkl Mid 3rd']) + parseInt(element['Tkl Att 3rd'])
      tackles.push({
        'Value': element['Tkl Def 3rd'],
        'Percentage': element['Tkl Def 3rd'] / sum,
      })
      tackles.push({
        'Value': element['Tkl Mid 3rd'],
        'Percentage': element['Tkl Mid 3rd'] / sum,
      })
      tackles.push({
        'Value': element['Tkl Att 3rd'],
        'Percentage': element['Tkl Att 3rd'] / sum,
      })
    }
  })
  return {
    'Pressures': pressures,
    'Tackles': tackles,
    'Touches': touches,
  }
}

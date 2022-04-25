/**
 * This file contains utility functions for the data preprocessing. 
 */

export function processData(data) {
  data = data.slice(0, data.length - 2)
  const keyPasses = data.map(element => {
    return { 
      'name': element.Player,
      'Pos': element.Pos,
      'Key Passes': element.KP,
    }
  })

  const completedPasses = data.map(element => {
    return { 
      'name': element.Player,
      'Pos': element.Pos,
      'Completed Passes': element.Cmp,
    }
  })
  const shotsOnTarget = data.map(element => {
    return { 
      'name': element.Player,
      'Pos': element.Pos,
      'Shots On Target': element.SoT,
    }
  })

  const processedCompletedPasses = getMidFielder(completedPasses, 'Completed Passes')
  const processedKeyPasses = getMidFielder(keyPasses, 'Key Passes')
  const processedShotsOnTarget = getMidFielder(shotsOnTarget, 'Shots On Target')


  const midData =  {
    'Completed Passes': processedCompletedPasses,
    'Key Passes': processedKeyPasses,
    'Shots On Target': processedShotsOnTarget,
  }
  return midData
}

function getMidFielder(data, sortingKey) {
  const orderedPlayers = []
  data.forEach((element) => {
    if (element['Pos'].includes('M')) 
      orderedPlayers.push({
        'name': element['name'],
        ['value']: parseInt(element[sortingKey])
      })
  })  
  return getOthers(orderedPlayers)
}

function getOthers(data) {
  const finalData = []
  data.forEach(element => {
    if (element.name == "Samuel Piette")
    finalData.push({
      'name': element.name,
      'value': element.value
    })
  })
  var count = 0
  var otherValue = 0
  const numberOfPlayer = 3
  const returnValue = data.sort((player1, player2) => player2['value'] - player1['value']).forEach(element => {
    if (element.name != "Samuel Piette" && count < numberOfPlayer) {
      finalData.push({
        'name': element['name'],
        'value': element['value']
      })
      count += 1
    } else {
      otherValue += element['value']
    }
  })
  finalData.push({
    'name': 'Others',
    'value': otherValue
  })
  return finalData
}
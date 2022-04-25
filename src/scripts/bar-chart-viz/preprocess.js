/**
 * This file contains utility functions for the data preprocessing. 
 */

export function processData(data) {
  const gamesPlayed = data.map(element => {
    return { 
      'Player': element.Player,
      'Pos': element.Pos,
      'Games Played': element.MP,
    }
  })
  const minutesPlayed = data.map(element => {
    return { 
      'Player': element.Player,
      'Pos': element.Pos,
      'Minutes Played': element.Min,
    }
  })
  const titularizations = data.map(element => {
    return { 
      'Player': element.Player,
      'Pos': element.Pos,
      'Titularizations': element.Starts,
    }
  })
  const processedGamesPlayed = getTopPlayers(gamesPlayed, 7, 'Games Played')
  const processedMinutesPlayed = getTopPlayers(minutesPlayed, 7, 'Minutes Played')
  const processedTitularizations = getTopPlayers(titularizations, 7, 'Titularizations')
  return {
    'Titularizations': processedTitularizations,
    'Minutes Played': processedMinutesPlayed,
    'Games Played': processedGamesPlayed
  }
}

function getTopPlayers(data, limit, sortingKey) {
  const orderedPlayers = []
  data.forEach((element) => {
    if (element['Pos'].includes('M')) 
      orderedPlayers.push({
        'Player': element['Player'],
        [sortingKey]: parseInt(element[sortingKey])
      })
  })
  const returnValue = []
  orderedPlayers.sort((player1, player2) => player2[sortingKey] - player1[sortingKey]).slice(0, limit).forEach(element => {
    returnValue.push({
      'Player': element['Player'],
      [sortingKey]: element[sortingKey]
    })
  })
  return returnValue 
}

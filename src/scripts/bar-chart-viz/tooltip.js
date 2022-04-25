export function getContents(feature, value) {
  var title ='none';
  switch (feature) {
    case 'Titularizations': title ='TITULARIZATIONS'
      break;
    case 'Minutes Played': title ='NUMBER OF MINUTES'
      break;
    case 'Games Played': title ='GAMES PLAYED'
      break;
  }

  return `
  <div>
    <label id="tooltip-title">${title}</label>
    <div>
      <label class="legend-title">Count :</label>
      <label class="tooltip-value">${value}</label>
    </div>

  </div>
  `
}

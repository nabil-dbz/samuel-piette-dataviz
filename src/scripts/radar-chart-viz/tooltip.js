/**
 * This file contains utility functions for drawing the tooltip of the radar chart visualization.
 */

export function getContents (element) {
  return `
    <div>
      <div>
        <label class="legend-title">Player :</label>
        <label class="tooltip-value">${element.player}</label>
      </div>
      <div>
        <label class="legend-title">Feature :</label>
        <label class="tooltip-value">${element.feature}</label>
      </div>
      <div>
        <label class="legend-title">Value :</label>
        <label class="tooltip-value">${parseFloat(element.value).toFixed(2)}%</label>
      </div>
    </div>
  `
}
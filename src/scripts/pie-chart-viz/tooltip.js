/**
 * This file contains utility functions for drawing the tooltip of the global visualization.
 */

export function getContents (player, value) {
  return `
    <div>
      <div>
          <label class="legend-title">Player :</label>
          <label class="tooltip-value">${player}</label>
      </div>
      <div>
          <label class="legend-title">Value :</label>
          <label class="tooltip-value">${(value * 100).toFixed(2)}%</label>
      </div>
    </div>
  `
}
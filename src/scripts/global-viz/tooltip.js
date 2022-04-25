/**
 * This file contains utility functions for drawing the tooltip of the global visualization.
 */

 export function getContents (element, feature) {
  return `
    <div>
      <div>
        <label class="legend-title">Feature :</label>
        <label class="tooltip-value">${feature}</label>
      </div>
      <div>
        <label class="legend-title">Value :</label>
        <label class="tooltip-value">${element.Value}</label>
      </div>
    </div>
  `
}
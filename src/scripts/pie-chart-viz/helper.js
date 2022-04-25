/**
 * This file contains general utility functions.
 */

export const FEATURES_MAP = {
  0: 'Key Passes',
  1: 'Completed Passes',
  2: 'Shots On Target',
}

export function setColorScale(data) {
  return d3.scaleOrdinal()
    .domain(data.map((element) => element.name))
    .range(['blue', 'green', 'grey', 'purple', 'red'])
}

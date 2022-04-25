/**
 * This file contains general utility functions.
 */

export function angleToCoordinate(angle, value, radialScale){
  let x = Math.cos(angle) * radialScale(value);
  let y = Math.sin(angle) * radialScale(value);
  return {'x': 250 + x, 'y': 200 - y};
}

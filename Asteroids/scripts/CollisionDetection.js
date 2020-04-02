"use strict";

/**
 * [checkCollison description]
 * @param  {array<object>} points1 A set of points defining the first polygon.
 * @param  {array<object>} points2 A set of points defining the second polygon.
 * @return {boolean}               Whether or not there is an intersection between the polygons.
 * TODO: detect if a shape is completely inside the other, using ray test (odd intersection=inside, even=outside)
 */
export function checkCollison(points1, points2) {
  const lineSegments1 = createLineSegmentsFromPairsOfPoints(points1);
  const lineSegments2 = createLineSegmentsFromPairsOfPoints(points2);
  // Tests each line segment from the first polygon against each line segment from the second polygon.
  for (const lineSegment1 of lineSegments1) {
    for (const lineSegment2 of lineSegments2) {
      if (checkForIntersection(lineSegment1, lineSegment2)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Creates an array of line segments from a list of points.
 * @param  {array<object>} points The x and y coordinates defining the corners of a polygon.
 * @return {array<object>}        The line segments defining the edges of a polygon.
 */
function createLineSegmentsFromPairsOfPoints(points) {
  const lineSegments = [];
  for (let i = 0; i < points.length - 1; i++) {
    lineSegments.push(defineLineSegmentFromPairOfPoints(points[i], points[i + 1]));
  }
  lineSegments.push(defineLineSegmentFromPairOfPoints(points[points.length - 1], points[0]));
  return lineSegments;
}

/**
 * Defines a line segment from a pair of points.
 * @param  {object} point1 The first x and y coordinate.
 * @param  {object} point2 The second x and y coordinate.
 * @return {object}        The line segment.
 */
function defineLineSegmentFromPairOfPoints(point1, point2) {
  const lineSegment = {vertical: null, xIntercept: null, range: null, slope: null, yIntercept: null, domain: null};
  if (point1.x === point2.x) {
    lineSegment.vertical = true;
    lineSegment.xIntercept = point1.x;
    lineSegment.range = {min: Math.min(point1.y, point2.y), max: Math.max(point1.y, point2.y)};
    // Not used: slope, yIntercept, and domain
  } else {
    lineSegment.vertical = false;
    lineSegment.slope = (point2.y - point1.y)/(point2.x - point1.x);
    lineSegment.yIntercept = point1.y - lineSegment.slope*point1.x;
    lineSegment.domain = {min: Math.min(point1.x, point2.x), max: Math.max(point1.x, point2.x)};
    // Not used: xIntercept and range
  }
  return lineSegment;
}

/**
 * [checkIntersection description]
 * @param  {object}  lineSegment1 [description]
 * @param  {object}  lineSegment2 [description]
 * @return {boolean}              [description]
 */
function checkForIntersection(lineSegment1, lineSegment2) {
  const intersectionPoint = {x: null, y: null};
  // Both non-vertical line segments.
  if (!lineSegment1.vertical && !lineSegment2.vertical) {
    if (lineSegment1.slope === lineSegment2.slope) {
      return lineSegment1.domain.min >= lineSegment2.domain.min && lineSegment1.domain.min <= lineSegment2.domain.max
        || lineSegment1.domain.max >= lineSegment2.domain.min && lineSegment1.domain.max <= lineSegment2.domain.max;
    } else {
      intersectionPoint.x = (lineSegment2.yIntercept - lineSegment1.yIntercept)/(lineSegment1.slope - lineSegment2.slope);
      // Not used: intersectionPoint.y = lineSegment1.slope*intersectionPoint.x + lineSegment1.yIntercept;
      return intersectionPoint.x >= lineSegment1.domain.min && intersectionPoint.x <= lineSegment1.domain.max
        && intersectionPoint.x >= lineSegment2.domain.min && intersectionPoint.x <= lineSegment2.domain.max;
    }
  // Only line segment 2 is vertical.
  } else if (!lineSegment1.vertical && lineSegment2.vertical) {
    intersectionPoint.x = lineSegment2.xIntercept;
    intersectionPoint.y = lineSegment1.slope*intersectionPoint.x + lineSegment1.yIntercept;
    return intersectionPoint.x >= lineSegment1.domain.min && intersectionPoint.x <= lineSegment1.domain.max
      && intersectionPoint.y >= lineSegment2.range.min && intersectionPoint.y <= lineSegment2.range.max;
  // Only line segment 1 is vertical.
  } else if (lineSegment1.vertical && !lineSegment2.vertical) {
    intersectionPoint.x = lineSegment1.xIntercept;
    intersectionPoint.y = lineSegment2.slope*intersectionPoint.x + lineSegment2.yIntercept;
    return intersectionPoint.x >= lineSegment2.domain.min && intersectionPoint.x <= lineSegment2.domain.max
      && intersectionPoint.y >= lineSegment1.range.min && intersectionPoint.y <= lineSegment1.range.max;
  // Both line segments are vertical.
  } else if (lineSegment1.vertical && lineSegment2.vertical) {
    return lineSegment1.range.min >= lineSegment2.range.min && lineSegment1.range.min <= lineSegment2.range.max
      || lineSegment1.range.max >= lineSegment2.range.min && lineSegment1.range.max <= lineSegment2.range.max;
  }
}

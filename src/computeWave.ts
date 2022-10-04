type Point = [number, number];
export type WaveFunc = (phase: number, maxAmp: number) => number;

function getPathPoints(path: SVGPathElement, res: number): Point[] {
  // Get the points of the geometry with the given resolution
  const length = path.getTotalLength();
  const points: Point[] = [];
  if (res < 0.1) res = 0.1; // prevent infinite loop
  for (let i = 0; i <= length + res; i += res) {
    const { x, y } = path.getPointAtLength(i);
    points.push([x, y]);
  }
  return points;
}

function computeWavePoints(
  points: readonly Point[],
  freq: number,
  phase: number,
  waveFunc: WaveFunc,
  maxAmp: number,
) {
  // For each of those points, generate a new point...
  const wavePoints = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    // Numerical computation of the angle between this and the next point
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const ang = Math.atan2(y1 - y0, x1 - x0);
    // Turn that 90 degrees for the normal angle (pointing "left" as far
    // as the geometry is considered):
    const normalAngle = ang - Math.PI / 2;
    // Compute the wave phase at this point.
    const pointPhase = ((i / (points.length - 1)) * freq + phase) * Math.PI * 2;
    // Compute the wave amplitude at this point.
    const amp = waveFunc(pointPhase, maxAmp);
    // Apply that to the current point.
    const x = x0 + Math.cos(normalAngle) * amp;
    const y = y0 + Math.sin(normalAngle) * amp;
    wavePoints.push([x, y]);
  }
  return wavePoints;
}

function getTerminalPoint(
  points: readonly Point[],
  wavePoints: readonly Point[],
): Point {
  // Figure out how to terminate the wave wave.
  const [fx, fy] = points[0];
  const lastPoint = points[points.length - 1];
  const [lx, ly] = lastPoint;
  const distBetweenFirstLast = Math.hypot(fx - lx, fy - ly);
  if (distBetweenFirstLast < 2) {
    // Smells closed; also close the wave.
    return wavePoints[0];
  }
  // Terminate the wave points where the shape ends.
  return lastPoint;
}

export default function computeWave(
  path: SVGPathElement,
  freq: number,
  maxAmp: number,
  phase: number,
  res: number,
  waveFunc: WaveFunc,
) {
  const points = getPathPoints(path, res);
  const wavePoints = computeWavePoints(points, freq, phase, waveFunc, maxAmp);
  const terminalPoint = getTerminalPoint(points, wavePoints);
  wavePoints.push(terminalPoint);
  // Compute SVG polyline string.
  return wavePoints
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
}

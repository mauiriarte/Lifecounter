export interface Seat {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: 0 | 90 | 180 | 270;
}

/**
 * Seat geometry for `n` rotated tiles around a table of size `width` x `height`.
 * Mirrors the original artifact's fixed-canvas layout, generalized to any
 * viewport so the game screen fills whatever device/browser window it runs in.
 */
export function computeSeats(n: number, width: number, height: number): Seat[] {
  const g = 4;
  const x0 = g;
  const y0 = g;
  const W = width - g * 2;
  const H = height - g * 2;

  if (n === 2) {
    const h2 = (H - g) / 2;
    return [
      { x: x0, y: y0, w: W, h: h2, rot: 180 },
      { x: x0, y: y0 + h2 + g, w: W, h: h2, rot: 0 },
    ];
  }

  const seats: Seat[] = [];
  const odd = n % 2 === 1;
  const rows = odd ? 1 + (n - 1) / 2 : n / 2;
  const rh = (H - g * (rows - 1)) / rows;
  const cw = (W - g) / 2;
  let r0 = 0;

  if (odd) {
    seats.push({ x: x0, y: y0, w: W, h: rh, rot: 180 });
    r0 = 1;
  }
  for (let r = r0; r < rows; r++) {
    seats.push({ x: x0 + cw + g, y: y0 + r * (rh + g), w: cw, h: rh, rot: 270 });
  }
  for (let r = rows - 1; r >= r0; r--) {
    seats.push({ x: x0, y: y0 + r * (rh + g), w: cw, h: rh, rot: 90 });
  }
  return seats;
}

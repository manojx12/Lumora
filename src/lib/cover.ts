export interface CoverRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/**
 * `object-fit: cover` geometry: scale the source to fill the destination
 * without distortion, then centre the overflow.
 */
export function computeCoverRect(
  sourceWidth: number,
  sourceHeight: number,
  destWidth: number,
  destHeight: number,
): CoverRect {
  const sourceRatio = sourceWidth / sourceHeight;
  const destRatio = destWidth / destHeight;
  const dw = sourceRatio > destRatio ? destHeight * sourceRatio : destWidth;
  const dh = sourceRatio > destRatio ? destHeight : destWidth / sourceRatio;
  return { dx: (destWidth - dw) / 2, dy: (destHeight - dh) / 2, dw, dh };
}

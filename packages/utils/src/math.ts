/**
 * 数学工具函数
 */

/**
 * 将角度转换为弧度
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * 将弧度转换为角度
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * 限制数值在指定范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * 判断两个浮点数是否近似相等
 */
export function nearlyEqual(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * 生成指定范围内的随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定范围内的随机浮点数
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * 映射数值从一个范围到另一个范围
 */
export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * 平滑阻尼（类似Unity的SmoothDamp）
 */
export function smoothDamp(
  current: number,
  target: number,
  currentVelocity: { value: number },
  smoothTime: number,
  maxSpeed: number = Infinity,
  deltaTime: number
): number {
  // Based on Game Programming Gems 4 Chapter 1.10
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;

  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = current - target;
  const originalTo = target;

  // Clamp maximum speed
  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  target = current - change;

  const temp = (currentVelocity.value + omega * change) * deltaTime;
  currentVelocity.value = (currentVelocity.value - omega * temp) * exp;
  let output = target + (change + temp) * exp;

  // Prevent overshooting
  if (originalTo - current > 0.0 === output > originalTo) {
    output = originalTo;
    currentVelocity.value = (output - originalTo) / deltaTime;
  }

  return output;
}

/**
 * 计算两点之间的距离
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算两点之间的距离平方（避免开方运算，用于性能优化）
 */
export function distanceSquared(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

/**
 * 计算两点之间的角度（弧度）
 */
export function angleToPoint(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

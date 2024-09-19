/**
 * Generates a random integer between min and max (inclusive).
 * @param min Minimum number in milliseconds.
 * @param max Maximum number in milliseconds.
 * @returns A random integer between min and max.
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function waitOneToThreeTime(): number {
  return getRandomInt(1000, 3000); // 1 to 3 seconds
}

export function waitTwoToFiveTime(): number {
  return getRandomInt(2000, 5000); // 2 to 5 seconds
}

export function waitThreeToSevenTime(): number {
  return getRandomInt(3000, 7000); // 3 to 7 seconds
}

export function waitSevenToTenTime(): number {
  return getRandomInt(7000, 10000); // 7 to 10 seconds
}

export function waitOneToTenTime(): number {
  return getRandomInt(1000, 10000); // 7 to 10 seconds
}

export function waitKeyStroke(): number {
  return getRandomInt(15, 50); // 0.015 to 0.050 seconds
}

export function waitNextButton(): number {
  return getRandomInt(400, 750); //
}

/** Level definitions — angles in radians, 0 = right, counter-clockwise positive */

export const LEVELS = [
  {
    name: "Awakening",
    orbitSpeed: 1.4,
    ringRadius: 0.38,
    pulses: [
      { interval: 2.8, angle: 0, speed: 0.55, width: 0.22 },
    ],
    nodes: [{ angle: Math.PI }],
  },
  {
    name: "Split",
    orbitSpeed: 1.5,
    ringRadius: 0.38,
    pulses: [
      { interval: 2.4, angle: 0, speed: 0.6, width: 0.2 },
      { interval: 3.2, angle: Math.PI / 2, speed: 0.6, width: 0.2 },
    ],
    nodes: [
      { angle: Math.PI * 0.5 },
      { angle: Math.PI * 1.5 },
    ],
  },
  {
    name: "Triangle",
    orbitSpeed: 1.6,
    ringRadius: 0.36,
    pulses: [
      { interval: 2.0, angle: 0, speed: 0.65, width: 0.18 },
      { interval: 2.0, angle: (Math.PI * 2) / 3, speed: 0.65, width: 0.18 },
      { interval: 2.0, angle: (Math.PI * 4) / 3, speed: 0.65, width: 0.18 },
    ],
    nodes: [
      { angle: Math.PI / 3 },
      { angle: Math.PI },
      { angle: (Math.PI * 5) / 3 },
    ],
  },
  {
    name: "Crosswind",
    orbitSpeed: 1.75,
    ringRadius: 0.36,
    pulses: [
      { interval: 1.8, angle: Math.PI / 4, speed: 0.7, width: 0.16 },
      { interval: 1.8, angle: (Math.PI * 5) / 4, speed: 0.7, width: 0.16 },
      { interval: 2.6, angle: (Math.PI * 3) / 4, speed: 0.75, width: 0.16 },
    ],
    nodes: [
      { angle: 0 },
      { angle: Math.PI / 2 },
      { angle: Math.PI },
      { angle: (Math.PI * 3) / 2 },
    ],
  },
  {
    name: "Debt",
    orbitSpeed: 1.9,
    ringRadius: 0.35,
    pulses: [
      { interval: 1.5, angle: 0, speed: 0.75, width: 0.15 },
      { interval: 1.5, angle: Math.PI / 3, speed: 0.75, width: 0.15 },
      { interval: 1.5, angle: (Math.PI * 2) / 3, speed: 0.75, width: 0.15 },
      { interval: 2.2, angle: Math.PI, speed: 0.8, width: 0.14 },
    ],
    nodes: [
      { angle: Math.PI / 6 },
      { angle: Math.PI / 2 },
      { angle: (Math.PI * 5) / 6 },
      { angle: (Math.PI * 7) / 6 },
      { angle: (Math.PI * 3) / 2 },
      { angle: (Math.PI * 11) / 6 },
    ],
  },
];

export const MAX_LIVES = 3;

export const NODE_COLLECT_RADIUS = 0.06;
export const PULSE_HIT_RADIUS = 0.025;

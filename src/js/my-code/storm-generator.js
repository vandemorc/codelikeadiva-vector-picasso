import {angleFromCenter, easingSin, xFromCenter, yFromCenter} from "./helpers";
import {
  generateEmoji,
  generateLine,
  generateRandomDot,
  generateStormWrapper,
  generateTrail
} from "./storm-assets";

// magic numbers
const MAX_RADIUS = 120;
const MAX_EMOJI_SIZE = 15;
const MIN_EMOJI_SIZE = 1;
const DEVIATION_MULTIPLIER = 1.5;
const MINIMUM_DEVIATION = .05;
const ANGLE_STEP = 13;
const RADIUS_STEP = .3;
const SWIRL_COUNT = 16;

// consts
// local coordinate system: [0..100][0..100]
const WIDTH = 100;
const HEIGHT = 100;
const xCenter = WIDTH * .5;
const yCenter = HEIGHT * .5;

// maxDeviation - 0..1
function generateSwirl({maxDeviation, maxEmojiSize, svgElementsGenerator}) {
  const svgElements = [];
  let radius = 0;
  let angle = 0;
  let skipIndex = 0;

  while (radius < MAX_RADIUS) {
    const mult = easingSin(radius / MAX_RADIUS);
    const easeRadius = mult * MAX_RADIUS;
    const xPerfect = xFromCenter(angle, easeRadius);
    const yPerfect = yFromCenter(angle, easeRadius);
    const deviation = maxDeviation * easeRadius;
    const x = xCenter + (Math.random() * deviation - deviation / 2) + xPerfect;
    const y = yCenter + (Math.random() * deviation - deviation / 2) + yPerfect;
    const elRadius = mult * maxEmojiSize;

    angle += ANGLE_STEP;
    radius += RADIUS_STEP;

    // decrease count for debuging
    // if (++skipIndex < 64) continue; else skipIndex = 0;

    svgElements.push(...svgElementsGenerator({
      x,
      y,
      x0: xCenter,
      y0: yCenter,
      a: angleFromCenter(xPerfect, yPerfect),
      r: elRadius,
      w: elRadius / 2,
    }));
  }

  return svgElements.join('');
}

export function generateStorm(width, height) {
  const maxSwirlIndex = SWIRL_COUNT - 1;
  const photonsSwirls = Array(SWIRL_COUNT).fill(0)
    .map((_, index) => (generateSwirl({
      maxDeviation: easingSin(1 - index / maxSwirlIndex) * DEVIATION_MULTIPLIER,
      maxEmojiSize: (index / maxSwirlIndex) * MAX_EMOJI_SIZE + MIN_EMOJI_SIZE,
      svgElementsGenerator: stepOptions => [
        generateRandomDot(stepOptions)
      ],
    })))
    .join('');
  const emojisSwirls = Array(SWIRL_COUNT).fill(0)
    .map((_, index) => (generateSwirl({
      maxDeviation: (
        (MINIMUM_DEVIATION + easingSin(1 - index / maxSwirlIndex)) * DEVIATION_MULTIPLIER
      ),
      maxEmojiSize: easingSin(index / maxSwirlIndex) * MAX_EMOJI_SIZE + MIN_EMOJI_SIZE,
      // generate emojis with trails
      svgElementsGenerator: stepOptions => [
        generateLine(stepOptions),
        generateTrail(stepOptions),
        generateEmoji(stepOptions),
      ]
    })))
    .join('');

  return generateStormWrapper({
    content: photonsSwirls + emojisSwirls,
    width,
    height
  });
};

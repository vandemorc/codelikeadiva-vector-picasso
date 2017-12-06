import {angleFromCenter, easingSin, xFromCenter, yFromCenter} from "./helpers";
import {
  generateEmoji,
  generateLine,
  generateRandomDot,
  generateStormWrapper,
  generateTrail
} from "./storm-assets";
import { Random } from "./random";

// consts
// local coordinate system: [0..100][0..100]
// TODO: read from dom
const hwRatio = 596 / 842;
const LOCAL_WIDTH = 100;
const LOCAL_HEIGHT = LOCAL_WIDTH * hwRatio;
const xCenter = LOCAL_WIDTH * .5;
const yCenter = LOCAL_HEIGHT * .5;

// magic numbers
const MAX_RADIUS = Math.sqrt(LOCAL_WIDTH * LOCAL_WIDTH + LOCAL_HEIGHT * LOCAL_HEIGHT);
const MAX_EMOJI_SIZE = 17;
const MIN_EMOJI_SIZE = 1;
const DEVIATION_MULTIPLIER = 2;
const MINIMUM_DEVIATION = .05;
const ANGLE_STEP = 15;
const RADIUS_STEP = .3;
const SWIRL_COUNT = 16;

// maxDeviation - 0..1
function generateSwirl({maxDeviation, maxEmojiSize, svgElementsGenerator, renderedArea, random}) {
  const svgElements = [];
  let radius = 0;
  let angle = 0;
  let skipIndex = 0;

  while (radius < MAX_RADIUS * 1.35) {
    const mult = easingSin(radius / MAX_RADIUS);
    const easeRadius = mult * MAX_RADIUS;
    const xPerfect = xFromCenter(angle, easeRadius);
    const yPerfect = yFromCenter(angle, easeRadius);
    const deviation = maxDeviation * easeRadius;
    const x = xCenter + (random() * deviation - deviation / 2) + xPerfect;
    const y = yCenter + (random() * deviation - deviation / 2) + yPerfect;
    const elRadius = mult * maxEmojiSize;
    const maxElRadius = elRadius + maxDeviation * easeRadius;

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
      renderedArea,
      random,
    }));
  }

  return svgElements.join('');
}

export function generateStorm(width, height, partIndex = 0, dividedBy = 1) {
  const Randomizer = new Random(0);
  const random = Randomizer.next.bind(Randomizer);
  const maxSwirlIndex = SWIRL_COUNT - 1;
  // optimization
  const partCount = dividedBy * dividedBy;
  const partX = partIndex % dividedBy;
  const partY = Math.floor(partIndex / dividedBy);
  const partWidth = LOCAL_WIDTH / dividedBy;
  const partHeight = LOCAL_HEIGHT / dividedBy;
  const renderedArea = {
    x0: partX * partWidth,
    y0: partY * partHeight,
    x1: partX * partWidth + partWidth,
    y1: partY * partHeight + partHeight,
  };
  const photonsSwirls = Array(SWIRL_COUNT).fill(0)
    .map((_, index) => (generateSwirl({
      renderedArea,
      maxDeviation: easingSin(1 - index / maxSwirlIndex) * DEVIATION_MULTIPLIER,
      maxEmojiSize: (index / maxSwirlIndex) * MAX_EMOJI_SIZE + MIN_EMOJI_SIZE,
      svgElementsGenerator: stepOptions => [
        generateRandomDot(stepOptions)
      ],
      random,
    })))
    .join('');
  const emojisSwirls = Array(SWIRL_COUNT).fill(0)
    .map((_, index) => (generateSwirl({
      renderedArea,
      maxDeviation: (
        (MINIMUM_DEVIATION + easingSin(1 - index / maxSwirlIndex)) * DEVIATION_MULTIPLIER
      ),
      maxEmojiSize: easingSin(index / maxSwirlIndex) * MAX_EMOJI_SIZE + MIN_EMOJI_SIZE,
      // generate emojis with trails
      svgElementsGenerator: stepOptions => [
        generateLine(stepOptions),
        generateTrail(stepOptions),
        generateEmoji(stepOptions),
      ],
      random,
    })))
    .join('');

  return generateStormWrapper({
    content: photonsSwirls + emojisSwirls,
    width,
    height,
    localWidth: LOCAL_WIDTH,
    localHeight: LOCAL_HEIGHT,
  });
};

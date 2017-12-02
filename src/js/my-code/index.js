import {EMOJIS} from "./emojis";

// magic numbers
const MAX_RADIUS = 120;
// const MAX_EMOJI_SIZE = 22;
// const MIN_EMOJI_SIZE = .15;
// const DEVIATION_MULTIPLIER = 1.75;
// const ANGLE_STEP = 16;
// const RADIUS_STEP = .55;
// const SWIRL_COUNT = 8;
const MAX_EMOJI_SIZE = 12;
const MIN_EMOJI_SIZE = 1;
const DEVIATION_MULTIPLIER = 1.5;
const ANGLE_STEP = 13;
const RADIUS_STEP = .3;
const SWIRL_COUNT = 16;

// colors
const EMOJI_COLORS = [
  '#fffed6',
  '#fffa91',
  '#ffba00',
  '#ffb100',
  '#f39b00',
];
const EMOJI_STROKE_COLOR = "#ce7400";
const TRAIL_COLOR = '#fffed6';
const LIGHT_COLOR = '#fffff6';
const TOPSTAR_COLOR = '#fffa91';
const BOTTOMSTAR_COLOR = '#000';
const PHOTON_COLOR = '#ffe'

// consts
// local coordinate system: [0..100][0..100]
const WIDTH = 100;
const HEIGHT = 100;
const xCenter = WIDTH * .5;
const yCenter = HEIGHT * .5;

// helpers
const easingSin = k => 1 - Math.cos( k * Math.PI / 2 );
const xFromCenter = (angle, distance) => Math.cos(angle * (Math.PI / 180)) * distance;
const yFromCenter = (angle, distance) => Math.sin(angle * (Math.PI / 180)) * distance;
const angleFromCenter = (x, y) => Math.atan2(y, x) * (180 / Math.PI);





// renders
const getRandomEmoji = () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
const getRandomEmojiColor = () => EMOJI_COLORS[Math.floor(Math.random() * EMOJI_COLORS.length)];

const generateFakeEmoji = ({x, y, r, color}) => `
  <circle 
    cx="${x}" 
    cy="${y}" 
    r="${r / 2}" 
    fill="${color}" 
    stroke="${EMOJI_STROKE_COLOR}" 
    stroke-width="${r / 10}"
  />
`;
const generateEmojiText = ({x, y, r, a, emoji}) => `
  <text
    font-size="${r}"
    text-anchor="middle"
    x="${x}"
    y="${y + r / 2}"
    transform="rotate(${a} ${x} ${y}) scale(1 1.1)"
  >${emoji}</text>
`;
// transform="rotate(${a} ${x} ${y})"
const generateLine = ({x, y, w}) => `
  <line x1="${xCenter}" y1="${yCenter}" x2="${x}" y2="${y}" stroke-width="${.05}" stroke="${TRAIL_COLOR}" stroke-opacity=".1"/>
`;
const generateLogLine = ({x, y, w}) => `
  <line x1="${xCenter}" y1="${yCenter}" x2="${x}" y2="${y}" stroke-width="${.1}" stroke="red" stroke-opacity="1"/>
`;
const generateTrail = ({x, y, r, a}) => `
  <polygon 
    points="0,-1 -15,0 0,1" 
    style="fill: url(#trailGradient);"
    transform="translate(${x} ${y}) rotate(${a} 0 0) scale(${r * .35})" 
  />
 `;
// skipt too small elements to not pollute the center
const generateRandomDot = ({x, y, r, a}) => r < .75 ? '' : `
  <circle 
    cx="${x + Math.random() * r * 8 - r * 4}" 
    cy="${y + Math.random() * r * 8 - r * 4}" 
    r="${r + Math.random() * 3}" 
    fill="${PHOTON_COLOR}"
    opacity="${Math.random() * .5 + .1}"
    transform="skewX(${-15 + Math.random() * 30}) skewY(${-15 + Math.random() * 30})"
  />
`;
// transform="translate(${x} ${y}) rotate(${a * 0} 10 10) scale(${r * .1})"
// <g
// transform="translate(${x - 25 / 2} ${y - 23 / 2}) rotate(${a * 0} 10 10) scale(${r * .1})"
//   >
//   <g
// viewBox="0 0 25 23"
// height="10" width="10"
//   >
//   <polygon opacity="0.75" fill="${TOPSTAR_COLOR}" points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule: nonzero;"/>
//   </g>
//   </g>

function generateEmoji({x, y, r, a}) {
  return r < .2
    ? generateFakeEmoji({x, y, r, color: getRandomEmojiColor()})
    : generateEmojiText({
      x, y, r,
      a: a + 90 + - 5 + Math.random() * 10,
      emoji: getRandomEmoji()});
}

// maxDeviation - 0..1
function generateSwirl({maxDeviation, maxEmojiSize, starId}) {
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

    angle += ANGLE_STEP;
    radius += RADIUS_STEP;

    // decrease count for debuging
    // if (++skipIndex < 64) continue; else skipIndex = 0;

    const a = angleFromCenter(xPerfect, yPerfect);
    const r = mult * maxEmojiSize;

    if (starId) {
      svgElements.push(generateRandomDot({x, y, r: r / 2, a}));
      // svgElements.push(generateLogLine({x, y, w: r / 2}));
    } else {
      // add emojis
      svgElements.push(generateLine({x, y, w: r / 2}));
      svgElements.push(generateTrail({
        x,
        y,
        r,
        a,
      }));
      svgElements.push(generateEmoji({
        x,
        y,
        r,
        a,
      }));
    }
  }

  return svgElements.join('');
}

class Artwork {
  constructor() {}

  init() {
    const svg = document.querySelector('svg');
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');
    const maxSwirlIndex = SWIRL_COUNT - 1;
    const topStars = Array(SWIRL_COUNT).fill(0)
    .map((_, index) => (generateSwirl({
      maxDeviation: easingSin(1 - index / maxSwirlIndex) * DEVIATION_MULTIPLIER,
      maxEmojiSize: (index / maxSwirlIndex) * MAX_EMOJI_SIZE + MIN_EMOJI_SIZE,
      starId: 'bottom-star',
    })));
    const bottomStars = Array(SWIRL_COUNT).fill(0)
    .map((_, index) => (generateSwirl({
      maxDeviation: easingSin(1 - index / maxSwirlIndex) * DEVIATION_MULTIPLIER,
      maxEmojiSize: (index / maxSwirlIndex) * MAX_EMOJI_SIZE + MIN_EMOJI_SIZE,
      starId: 'top-star',
    })));
    const emojis = Array(SWIRL_COUNT).fill(0)
      .map((_, index) => (generateSwirl({
        maxDeviation: easingSin(1 - index / maxSwirlIndex) * DEVIATION_MULTIPLIER,
        // maxEmojiSize: (index / maxSwirlIndex) * 16 + 1,
        maxEmojiSize: (index / maxSwirlIndex) * MAX_EMOJI_SIZE + MIN_EMOJI_SIZE,
      })));

    const content  = (
      topStars.reduce((acc, text) => acc + text) +
      // bottomStars.reduce((acc, text) => acc + text) +
      emojis.reduce((acc, text) => acc + text) +
      ''
    );

    const scaledContent = `
      <svg x="0" y="0" width="${width}" height="${height}" viewBox="0 0 100 100" fill="black">
      
      
        <symbol id="top-star">
          <polygon fill="${TOPSTAR_COLOR}" opacity=".5" points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule: nonzero;"/>
        </symbol>
        <symbol id="bottom-star">
          <polygon fill="${BOTTOMSTAR_COLOR}" opacity="1" points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule: nonzero;"/>
        </symbol>
        
            
        <linearGradient id="trailGradient" x1="1" y1="0" x2="0" y2="0">
          <stop stop-color="${TRAIL_COLOR}" offset="0%" stop-opacity="0.15"/>
          <stop stop-color="${TRAIL_COLOR}"  offset="100%" stop-opacity="0" />
        </linearGradient>
        
        <filter id="colorMeSaturate">
          <feColorMatrix in="SourceGraphic"
              type="saturate"
              values=".9" />
        </filter>
        
        <filter id = "spotlight">
          <feSpecularLighting result="specOut"
              specularExponent="30" lighting-color="${LIGHT_COLOR}">
            <fePointLight x="50" y="50" z="100"/>
          </feSpecularLighting>
          <feComposite in="SourceGraphic" in2="specOut"
              operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
        </filter>        
                  
        <g filter="url(#spotlight)">
          <rect id="background" x="${(100 - width) / 2}" y="${(100 - height) / 2}" width="${width}" height="${height}" fill="#231b00" />
        </g>
        <g filter="url(#colorMeSaturate)">
          ${content}
        </g>        
        
      </svg>`;

    svg.innerHTML = scaledContent;
  }
}

export default Artwork;

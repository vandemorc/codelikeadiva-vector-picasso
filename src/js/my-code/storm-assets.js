import {EMOJIS} from "./emojis";

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
const PHOTON_COLOR = '#ffe';
const BACKGROUND_COLOR = '#231b00';

let lastRandomEmoji = null;
const getRandomEmoji = (random) => {
  const index = Math.floor(random() * EMOJIS.length);

  // prevent same emojis in a row
  if (EMOJIS.length > 1 && index === lastRandomEmoji) {
    return getRandomEmoji(random);
  }

  lastRandomEmoji = index;

  return EMOJIS[index];
}

const getRandomEmojiColor = (random) => EMOJI_COLORS[Math.floor(random() * EMOJI_COLORS.length)];

const generateFakeEmoji = ({x, y, r, color, isDebug = false}) => `
  <circle 
    cx="${x}" 
    cy="${y}" 
    r="${r / 2}" 
    fill="${isDebug ? '#ff3c00' : color}" 
    stroke="${EMOJI_STROKE_COLOR}" 
    stroke-width="${r / 10}"
  />
`;

const generateEmojiText = ({x, y, r, a, emoji}) => `
  <text
    font-size="${r}"
    text-anchor="middle"
    transform="translate(${x} ${y}) rotate(${a} ${r / 8} 0) scale(1 1.1)"
  >${emoji}</text>
`;

// use fake emojies for performance
export const generateEmoji = ({x, y, r, a, renderedArea, random}) => {
  if (r < .2) {
    return generateFakeEmoji({x, y, r, color: getRandomEmojiColor(random)});
  }

  // always generate to not to break random seed increment
  const emojiText = (
    generateEmojiText({
      x, y, r,
      a: a + 90 + - 5 + random() * 10,
      emoji: getRandomEmoji(random),
    })
    // generateFakeEmoji({x, y, r, color: getRandomEmojiColor(random)})    
  );

  const isInRenderArea = (
    x + r > 0 &&
    x - r < renderedArea.xMax &&
    y + r > 0 &&
    y - r < renderedArea.yMax &&
    true
  );

  // TODO: check why not working
  // const isInRenderArea = (
  //   x + r * 2 >= renderedArea.x0 &&
  //   x - r * 2 <= renderedArea.x1 &&
  //   y + r * 2 >= renderedArea.y0 &&
  //   y - r * 2 <= renderedArea.y1 &&
  //   true
  // );

  // add some statistics
  if (isInRenderArea) {
    window.renderedImojisCount = (window.renderedImojisCount || 0) + 1;
  }

  return isInRenderArea
    ? emojiText
    : '';
};

// transform="rotate(${a} ${x} ${y})"
export const generateLine = ({x0, y0, x, y, w, r, renderedArea}) => {
  const isInRenderArea = (
    x + r * 5 > 0 &&
    x - r * 5  < renderedArea.xMax &&
    y + r * 5  > 0 &&
    y - r * 5  < renderedArea.yMax &&
    true
  );

  return !isInRenderArea ? '' : (`
    <line x1="${x0}" y1="${y0}" x2="${x}" y2="${y}" stroke-width="${.05}" stroke="${TRAIL_COLOR}" stroke-opacity=".1"/>
  `);
};

export const generateLogLine = ({x0, y0, x, y, w}) => `
  <line x1="${x0}" y1="${y0}" x2="${x}" y2="${y}" stroke-width="${.1}" stroke="red" stroke-opacity="1"/>
`;

export const generateTrail = ({x, y, r, a, renderedArea}) => {
  const isInRenderArea = (
    x + r * 5 > 0 &&
    x - r * 5  < renderedArea.xMax &&
    y + r * 5  > 0 &&
    y - r * 5  < renderedArea.yMax &&
    true
  );

  return !isInRenderArea ? '' : (`
<polygon 
  points="0,-1 -15,0 0,1" 
  style="fill: url(#trailGradient);"
  transform="translate(${x} ${y}) rotate(${a} 0 0) scale(${r * .35})" 
/>
  `);
}

// skipt too small elements to not pollute the center
export const generateRandomDot = ({x, y, r, a, random}) => r < .75 ? '' : `
  <circle 
    cx="${x + random() * r * 8 - r * 4}" 
    cy="${y + random() * r * 8 - r * 4}" 
    r="${r / 5 + random() * r / 2}" 
    fill="${PHOTON_COLOR}"
    opacity="${random() * .5 + .1}"
    transform="skewX(${-15 + random() * 30}) skewY(${-15 + random() * 30})"
  />
`;

// wrapper template with filters
export const generateStormWrapper = ({
  content,
  width,
  height,
  localWidth,
  localHeight,
  partIndex,
  dividedBy,
  renderedArea,
}) => {
  const {
    x0,
    y0,
    x1,
    y1,
  } = renderedArea;

  return (`
<svg x="0" y="0" width="${width}" height="${height}" viewBox="${x0} ${y0} ${localWidth / dividedBy} ${localHeight / dividedBy}">

  <defs>
    <!--emoji trail-->
    <linearGradient id="trailGradient" x1="1" y1="0" x2="0" y2="0">
      <stop stop-color="${TRAIL_COLOR}" offset="0%" stop-opacity="0.15"/>
      <stop stop-color="${TRAIL_COLOR}"  offset="100%" stop-opacity="0" />
    </linearGradient>

    <!--decrease saturation-->
    <filter id="colorSaturate">
      <feColorMatrix in="SourceGraphic"
          type="saturate"
          values=".95" />
    </filter>

    <!--background light-->
    <filter id = "spotlight">
      <feSpecularLighting result="specOut"
          specularExponent="30" lighting-color="${LIGHT_COLOR}">
        <fePointLight
          x="${localWidth / 2}"
          y="${localHeight / 2}"
          z="${Math.sqrt(localWidth * localWidth + localHeight * localHeight) * .5}"
        />
          </feSpecularLighting>
      <feComposite in="SourceGraphic" in2="specOut"
          operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
    </filter>
  </defs>

  <g filter="url(#spotlight)">
    <rect id="background" x="${0}" y="${0}" width="${localWidth}" height="${localHeight}" fill="${BACKGROUND_COLOR}" />
  </g>
  <g filter="url(#colorSaturate)">
    ${content}
  </g>

  </svg>
  `);
}

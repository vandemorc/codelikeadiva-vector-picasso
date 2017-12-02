import {generateStorm} from "./storm-generator";

class Artwork {
  constructor() {}

  init() {
    const svg = document.querySelector('svg');
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');
    const stormContent = generateStorm(width, height);

    svg.innerHTML = stormContent;
  }
}

export default Artwork;

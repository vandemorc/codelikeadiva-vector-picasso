import {generateStorm} from "./storm-generator";

class Artwork {
  constructor() {}

  init() {
    const svg = document.querySelector('svg');
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');
    const stormContent = generateStorm(width, height);

    // for first page rendering
    setTimeout(() => svg.innerHTML = stormContent, 1000);
  }
}

export default Artwork;

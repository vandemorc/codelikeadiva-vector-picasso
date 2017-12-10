import Config from '../config';

class Project {
  constructor() {
    this.outputTitle = `"${Config.title}"`;
    this.downloadLink = null;
  }

  init() {
    this.generateMenu();
    this.generateOverlay();
    this.updateCredits();

    document.addEventListener('keydown', (event) => {
      const keyCode = event.keyCode || event.which;
      const printKey = 'p';
      const keyCodePrint = printKey.charCodeAt(0) - 32;

      if (keyCode === keyCodePrint) {
        this.saveArtwork();
        this.triggerSaveArtwork();
      }

      // e - for export
      if (event.key === 'e') {
        this.exportAsPNG();
      }
    });
  }

  exportAsPNG() {
    const svg  = document.querySelector('#artwork-wrapper>svg');
    const svgSize = svg.getBoundingClientRect();
    const xml  = new XMLSerializer().serializeToString(svg);
    const data = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)));
    const canvas = document.createElement( 'canvas' );
    const ctx = canvas.getContext( '2d' );
    const img  = new Image();

    // document.write('<img src="'+data+'"/>');

    img.setAttribute('src', data);
    // document.body.appendChild(img);

    img.onload = function() {
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;
      ctx.drawImage(img, 0, 0 );

      const canvasdata = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.download = 'export_'+Date.now()+'.png';
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  }

  updateCredits() {
    document.querySelector('#credits .title').innerText = this.outputTitle;
    document.querySelector('#credits .artist').innerText = Config.author;
  }

  generateMenu() {
    const menu = (`
<div id="menu">
  <a href="#">save artwork</a><p>or press key: <span class="key">P</span></p>
  <hr>
  <p><span class="key">E</span> export as PNG</p>
</div>
    `);
    document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', menu);

    this.downloadLink = document.querySelector('#menu a');
    this.downloadLink.addEventListener('click', () => {
      this.saveArtwork();
    });
  }

  generateOverlay() {
    if (!sessionStorage['status']) {
      sessionStorage['status'] = 'init';

      const overlay = `<div id="overlay"><div class="box"><button></button><span class="title">${this.outputTitle}</span><span class="author">${Config.author}</span><div><span class="instruction">Instructions:</span><p>${Config.instructions}</p></div></div></div>`;
      document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', overlay);

      document.querySelector('#overlay button').addEventListener('click', (event) => {
        event.preventDefault();
        this.closeOverlay();
      });

      document.addEventListener('keydown', (event) => {
        const keyCode = event.keyCode || event.which;

        if (keyCode === 27) {
          this.closeOverlay();
        }
      });
    }
  }

  closeOverlay() {
    document.querySelector('#overlay').classList.add('closed');
  }

  getFilename() {
    const date = new Date();
    const timestamp = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    return `artwork_${Config.author}_${timestamp}.svg`;
  }

  saveArtwork() {
    const svgDOM = document.querySelector('#artwork-wrapper svg');
    const svgData = (new XMLSerializer()).serializeToString(svgDOM);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);

    this.downloadLink.setAttribute('download', this.getFilename());
    this.downloadLink.setAttribute('href', url);
    this.downloadLink.setAttribute('target', '_blank');
  }

  triggerSaveArtwork() {
    this.downloadLink.click();
  }
}

export default Project;

import { QRCode } from './qrcode.ts';

export type RenderType = 'canvas' | 'svg';

export interface RenderOptions {
  text: string;
  width: number;
  height: number;
  typeNumber: number;
  errorCorrectLevel: number;
  foreground: string;
  background: string;
  render: RenderType;
}

export function renderQRCode(options: RenderOptions): HTMLCanvasElement | SVGSVGElement {
  const qrcode = new QRCode(options.typeNumber, options.errorCorrectLevel);
  qrcode.addData(options.text);
  qrcode.make();

  if (options.render === 'canvas') {
    return renderCanvas(qrcode, options);
  } else {
    return renderSVG(qrcode, options);
  }
}

function renderCanvas(
  qrcode: QRCode,
  options: RenderOptions
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;

  const ctx = canvas.getContext('2d')!;
  const moduleCount = qrcode.getModuleCount();
  const cellWidth = options.width / moduleCount;
  const cellHeight = options.height / moduleCount;

  // Draw background
  ctx.fillStyle = options.background;
  ctx.fillRect(0, 0, options.width, options.height);

  // Draw QR code modules
  ctx.fillStyle = options.foreground;
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qrcode.isDark(row, col)) {
        const x = Math.floor(col * cellWidth);
        const y = Math.floor(row * cellHeight);
        const w = Math.ceil((col + 1) * cellWidth) - x;
        const h = Math.ceil((row + 1) * cellHeight) - y;
        ctx.fillRect(x, y, w, h);
      }
    }
  }

  return canvas;
}

function renderSVG(
  qrcode: QRCode,
  options: RenderOptions
): SVGSVGElement {
  const moduleCount = qrcode.getModuleCount();
  const cellWidth = options.width / moduleCount;
  const cellHeight = options.height / moduleCount;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(options.width));
  svg.setAttribute('height', String(options.height));
  svg.setAttribute('viewBox', `0 0 ${options.width} ${options.height}`);

  // Draw background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', String(options.width));
  bg.setAttribute('height', String(options.height));
  bg.setAttribute('fill', options.background);
  svg.appendChild(bg);

  // Draw QR code modules
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qrcode.isDark(row, col)) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const x = Math.floor(col * cellWidth);
        const y = Math.floor(row * cellHeight);
        const w = Math.ceil((col + 1) * cellWidth) - x;
        const h = Math.ceil((row + 1) * cellHeight) - y;

        rect.setAttribute('x', String(x));
        rect.setAttribute('y', String(y));
        rect.setAttribute('width', String(w));
        rect.setAttribute('height', String(h));
        rect.setAttribute('fill', options.foreground);
        svg.appendChild(rect);
      }
    }
  }

  return svg;
}

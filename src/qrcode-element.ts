import { renderQRCode, RenderType } from './render';

/**
 * QRCodeElement - A web component for generating QR codes
 *
 * Usage:
 *   <qr-code data-text="Hello World"></qr-code>
 *
 * Attributes:
 *   - data-text: Text to encode (required)
 *   - data-width: Width in pixels (default: 256)
 *   - data-height: Height in pixels (default: 256)
 *   - data-render: Render type - 'canvas' or 'svg' (default: 'canvas')
 *   - data-foreground: Foreground color (default: '#000000')
 *   - data-background: Background color (default: '#ffffff')
 *   - data-error-level: Error correction level 0-3 (default: 0)
 */
export class QRCodeElement extends HTMLElement {
  private resizeObserver: ResizeObserver | null = null;

  static register(tag = 'qr-code') {
    if (!customElements.get(tag)) {
      customElements.define(tag, QRCodeElement);
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupResizeObserver();
  }

  disconnectedCallback() {
    this.cleanupResizeObserver();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  static get observedAttributes() {
    return [
      'data-text',
      'data-width',
      'data-height',
      'data-render',
      'data-foreground',
      'data-background',
      'data-error-level',
    ];
  }

  get text(): string {
    return this.getAttribute('data-text') || '';
  }

  set text(value: string) {
    this.setAttribute('data-text', value);
  }

  get width(): number {
    return parseInt(this.getAttribute('data-width') || '256', 10);
  }

  set width(value: number) {
    this.setAttribute('data-width', String(value));
  }

  get height(): number {
    return parseInt(this.getAttribute('data-height') || '256', 10);
  }

  set height(value: number) {
    this.setAttribute('data-height', String(value));
  }

  get renderType(): RenderType {
    return (this.getAttribute('data-render') as RenderType) || 'canvas';
  }

  set renderType(value: RenderType) {
    this.setAttribute('data-render', value);
  }

  get foreground(): string {
    return this.getAttribute('data-foreground') || '#000000';
  }

  set foreground(value: string) {
    this.setAttribute('data-foreground', value);
  }

  get background(): string {
    return this.getAttribute('data-background') || '#ffffff';
  }

  set background(value: string) {
    this.setAttribute('data-background', value);
  }

  get errorLevel(): number {
    return parseInt(this.getAttribute('data-error-level') || '0', 10);
  }

  set errorLevel(value: number) {
    this.setAttribute('data-error-level', String(Math.max(0, Math.min(3, value))));
  }

  private render() {
    const shadow = this.shadowRoot;
    if (!shadow) return;

    const text = this.text;
    if (!text) {
      shadow.innerHTML =
        '<style>:host { display: block; } div { color: red; }  </style><div>No text provided</div>';
      return;
    }

    try {
      const qrcodeElement = renderQRCode({
        text,
        width: this.width,
        height: this.height,
        typeNumber: 0,
        errorCorrectLevel: this.errorLevel,
        foreground: this.foreground,
        background: this.background,
        render: this.renderType,
      });

      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: inline-block;
        }
        div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `;

      const container = document.createElement('div');
      container.appendChild(qrcodeElement);

      shadow.innerHTML = '';
      shadow.appendChild(style);
      shadow.appendChild(container);

      this.dispatchEvent(
        new CustomEvent('qrcode-ready', {
          detail: { text, width: this.width, height: this.height },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      const style = document.createElement('style');
      style.textContent = ':host { display: block; } div { color: red; }';
      const div = document.createElement('div');
      div.textContent = `Error: ${error instanceof Error ? error.message : String(error)}`;
      shadow.innerHTML = '';
      shadow.appendChild(style);
      shadow.appendChild(div);
    }
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => {
      this.render();
    });
    this.resizeObserver.observe(this);
  }

  private cleanupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}

// Auto-register the element
if (typeof window !== 'undefined' && !customElements.get('qr-code')) {
  customElements.define('qr-code', QRCodeElement);
}

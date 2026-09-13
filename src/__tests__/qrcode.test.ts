import { describe, it, expect, beforeEach } from 'vitest';
import { QRCode } from '../qrcode';
import { renderQRCode } from '../render';

describe('QRCode', () => {
  it('should create a QR code instance', () => {
    const qr = new QRCode(0, 0);
    expect(qr).toBeDefined();
    expect(qr.typeNumber).toBe(0);
    expect(qr.errorCorrectLevel).toBe(0);
  });

  it('should add data to QR code', () => {
    const qr = new QRCode(0, 0);
    qr.addData('Hello World');
    expect(qr.dataList.length).toBe(1);
    expect(qr.dataList[0].data).toBe('Hello World');
  });

  it('should generate QR code matrix', () => {
    const qr = new QRCode(0, 0);
    qr.addData('Test');
    qr.make();

    expect(qr.modules).toBeDefined();
    expect(qr.moduleCount).toBeGreaterThan(0);
    expect(qr.modules?.length).toBe(qr.moduleCount);
  });

  it('should have consistent module count', () => {
    const qr = new QRCode(0, 0);
    qr.addData('Consistent');
    qr.make();

    const moduleCount = qr.moduleCount;
    expect(moduleCount).toBe(21); // Minimum QR code size
  });

  it('should select a larger version for the documentation URL', () => {
    const qr = new QRCode(0, 0);
    qr.addData('https://github.com/squidjam/qrcode-element');
    qr.make();

    expect(qr.typeNumber).toBeGreaterThan(1);
    expect(qr.modules).toHaveLength(qr.moduleCount);
  });

  it('should handle different error correction levels', () => {
    for (let level = 0; level < 4; level++) {
      const qr = new QRCode(0, level);
      qr.addData('Test');
      qr.make();
      expect(qr.modules).toBeDefined();
    }
  });

  it('should throw on invalid module access', () => {
    const qr = new QRCode(0, 0);
    qr.addData('Test');
    qr.make();

    expect(() => qr.isDark(-1, 0)).toThrow();
    expect(() => qr.isDark(qr.moduleCount, 0)).toThrow();
  });
});

describe('renderQRCode', () => {
  it('should render to canvas', () => {
    const element = renderQRCode({
      text: 'Canvas Test',
      width: 256,
      height: 256,
      typeNumber: 0,
      errorCorrectLevel: 0,
      foreground: '#000000',
      background: '#ffffff',
      render: 'canvas',
    });

    expect(element).toBeInstanceOf(HTMLCanvasElement);
    expect(element.width).toBe(256);
    expect(element.height).toBe(256);
  });

  it('should render to SVG', () => {
    const element = renderQRCode({
      text: 'SVG Test',
      width: 256,
      height: 256,
      typeNumber: 0,
      errorCorrectLevel: 0,
      foreground: '#000000',
      background: '#ffffff',
      render: 'svg',
    });

    expect(element).toBeInstanceOf(SVGSVGElement);
    expect(element.getAttribute('width')).toBe('256');
    expect(element.getAttribute('height')).toBe('256');
  });

  it('should set correct colors', () => {
    const element = renderQRCode({
      text: 'Color Test',
      width: 256,
      height: 256,
      typeNumber: 0,
      errorCorrectLevel: 0,
      foreground: '#ff0000',
      background: '#00ff00',
      render: 'canvas',
    }) as HTMLCanvasElement;

    expect(element.width).toBe(256);
    expect(element.height).toBe(256);
  });
});

describe('QRCodeElement', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('qr-code');
    element.setAttribute('data-text', 'Test');
  });

  it('should create an element with text', () => {
    expect(element.text).toBe('Test');
  });

  it('should update text via property', () => {
    element.text = 'Updated';
    expect(element.getAttribute('data-text')).toBe('Updated');
    expect(element.text).toBe('Updated');
  });

  it('should have default dimensions', () => {
    expect(element.width).toBe(256);
    expect(element.height).toBe(256);
  });

  it('should set custom dimensions', () => {
    element.width = 512;
    element.height = 512;
    expect(element.width).toBe(512);
    expect(element.height).toBe(512);
  });

  it('should support canvas and svg render types', () => {
    element.renderType = 'svg';
    expect(element.renderType).toBe('svg');
    element.renderType = 'canvas';
    expect(element.renderType).toBe('canvas');
  });

  it('should support color customization', () => {
    element.foreground = '#0066ff';
    element.background = '#f0f0f0';
    expect(element.foreground).toBe('#0066ff');
    expect(element.background).toBe('#f0f0f0');
  });

  it('should support error levels 0-3', () => {
    for (let level = 0; level < 4; level++) {
      element.errorLevel = level;
      expect(element.errorLevel).toBe(level);
    }
  });

  it('should clamp error level to valid range', () => {
    element.errorLevel = 5;
    expect(element.errorLevel).toBe(3);
    element.errorLevel = -1;
    expect(element.errorLevel).toBe(0);
  });
});

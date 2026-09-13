# QR Code Element - Web Component

[![npm version](https://img.shields.io/npm/v/@squidjam/qrcode-element.svg)](https://www.npmjs.com/package/@squidjam/qrcode-element)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./MIT-LICENSE.txt)

A lightweight, framework-agnostic web component for generating QR codes directly in the browser. **Zero dependencies**, **~4KB minified+gzipped**, works everywhere.

## Features

✨ **Framework Agnostic** - Works with React, Vue, Svelte, Angular, vanilla JS, or any framework
✨ **No Dependencies** - Pure JavaScript, no external libraries or services
✨ **Fast & Lightweight** - ~4KB minified+gzipped
✨ **Multiple Render Options** - Canvas or SVG rendering
✨ **Customizable** - Colors, sizes, error correction levels
✨ **Standard Web Component** - Uses Custom Elements API
✨ **TypeScript Support** - Full type definitions included
✨ **NPM Package** - Easy installation and distribution

## Installation

### Via NPM

```bash
npm install @squidjam/qrcode-element
```

```javascript
import '@squidjam/qrcode-element';
```

### Via CDN (UMD)

```html
<script src="https://unpkg.com/@squidjam/qrcode-element@latest/dist/qrcode-element.umd.js"></script>
```

### Direct Source

```html
<script type="module" src="path/to/qrcode-element.js"></script>
```

## Basic Usage

### Simple

```html
<qr-code data-text="Hello World"></qr-code>
```

### With Options

```html
<qr-code 
  data-text="https://example.com"
  data-width="256"
  data-height="256"
  data-render="canvas"
  data-foreground="#000000"
  data-background="#ffffff"
  data-error-level="0"
></qr-code>
```

### Programmatic

```javascript
const qrcode = document.createElement('qr-code');
qrcode.text = 'Dynamic Content';
qrcode.width = 200;
qrcode.height = 200;
qrcode.foreground = '#333';
qrcode.background = '#eee';
qrcode.renderType = 'svg';

document.body.appendChild(qrcode);

// Listen for generation complete
qrcode.addEventListener('qrcode-ready', (event) => {
  console.log('QR Code generated:', event.detail);
});
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-text` | string | - | Text or URL to encode **(required)** |
| `data-width` | number | 256 | Width in pixels |
| `data-height` | number | 256 | Height in pixels |
| `data-render` | string | canvas | Render type: `canvas` or `svg` |
| `data-foreground` | string | #000000 | Foreground color (hex) |
| `data-background` | string | #ffffff | Background color (hex) |
| `data-error-level` | number | 0 | Error correction level (0-3) |

### Error Correction Levels

- `0` - ~7% correction
- `1` - ~15% correction
- `2` - ~25% correction
- `3` - ~30% correction

## Properties (JavaScript)

All attributes map to JavaScript properties:

```javascript
const qr = document.querySelector('qr-code');

qr.text = 'New text';
qr.width = 300;
qr.height = 300;
qr.foreground = '#0066cc';
qr.background = '#f5f5f5';
qr.renderType = 'svg'; // 'canvas' | 'svg'
qr.errorLevel = 2; // 0-3
```

## Events

### `qrcode-ready`

Fired when QR code generation is complete.

```javascript
qrcode.addEventListener('qrcode-ready', (event) => {
  console.log(event.detail);
  // { text: 'Hello', width: 256, height: 256 }
});
```

## Framework Examples

### React

```jsx
import '@squidjam/qrcode-element';
import { useEffect, useRef } from 'react';

function QRCodeDisplay() {
  const qrRef = useRef(null);

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.addEventListener('qrcode-ready', () => {
        console.log('QR code rendered');
      });
    }
  }, []);

  return (
    <qr-code
      ref={qrRef}
      data-text="https://example.com"
      data-width="256"
      data-height="256"
    />
  );
}
```

### Vue 3

```vue
<template>
  <qr-code
    :data-text="url"
    :data-width="size"
    :data-height="size"
    data-render="svg"
    @qrcode-ready="onReady"
  />
</template>

<script setup>
import '@squidjam/qrcode-element';
import { ref } from 'vue';

const url = ref('https://example.com');
const size = ref(256);

function onReady(event) {
  console.log('QR code ready:', event.detail);
}
</script>
```

### Svelte

```svelte
<script>
  import '@squidjam/qrcode-element';
  
  let text = 'https://example.com';
  let width = 256;
  
  function handleReady(event) {
    console.log('QR code ready:', event.detail);
  }
</script>

<qr-code
  data-text={text}
  data-width={width}
  data-height={width}
  on:qrcode-ready={handleReady}
/>
```

### Angular

```typescript
import { Component } from '@angular/core';
import '@squidjam/qrcode-element';

@Component({
  selector: 'app-qrcode',
  template: `
    <qr-code
      [attr.data-text]="text"
      [attr.data-width]="width"
      [attr.data-height]="height"
      (qrcode-ready)="onReady($event)"
    ></qr-code>
  `
})
export class QrcodeComponent {
  text = 'https://example.com';
  width = 256;
  height = 256;

  onReady(event: CustomEvent) {
    console.log('QR code ready:', event.detail);
  }
}
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@squidjam/qrcode-element"></script>
</head>
<body>
  <div id="container"></div>

  <script>
    const qr = document.createElement('qr-code');
    qr.setAttribute('data-text', 'https://example.com');
    qr.setAttribute('data-width', '300');
    qr.setAttribute('data-height', '300');
    
    qr.addEventListener('qrcode-ready', (event) => {
      console.log('Generated:', event.detail);
    });
    
    document.getElementById('container').appendChild(qr);
  </script>
</body>
</html>
```

## Styling

The web component uses Shadow DOM for encapsulation. You can style the container:

```css
qr-code {
  display: inline-block;
  border: 2px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}
```

Canvas/SVG rendering is contained within the shadow DOM, but colors are controlled via `data-foreground` and `data-background` attributes.

## Advanced Usage

### Dynamic Updates

```javascript
const qr = document.querySelector('qr-code');

// Update text - automatically re-renders
qr.text = 'New content';

// Change render type
qr.renderType = 'svg';

// Adjust size
qr.width = 512;
qr.height = 512;
```

### Custom Colors

```javascript
const qr = document.querySelector('qr-code');
qr.foreground = '#0066ff';
qr.background = '#f0f0f0';
```

### Error Correction

```javascript
const qr = document.querySelector('qr-code');
// Use higher error correction for damaged/partially obscured codes
qr.errorLevel = 3; // Maximum error correction
```

## Performance

- Initial render: ~5-50ms depending on text length
- Canvas rendering: Faster for large sizes
- SVG rendering: Better for crisp rendering at any scale
- Memory footprint: ~50KB including all algorithms

## Browser Support

- Chrome/Edge 77+
- Firefox 63+
- Safari 10.1+
- Opera 64+
- All modern mobile browsers

**Note:** Requires support for:
- Web Components / Custom Elements API
- Shadow DOM
- Canvas API (for canvas rendering) or SVG (for svg rendering)

## License

MIT License - See [MIT-LICENSE.txt](./MIT-LICENSE.txt)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Based on the original [jquery-qrcode](https://github.com/jeromeetienne/jquery-qrcode) project, converted to a modern web component with zero dependencies.

## Changelog

### 2.0.0 (Current)
- ✨ Converted to Web Component
- ✨ Removed jQuery dependency
- ✨ Added TypeScript support
- ✨ Added SVG rendering option
- ✨ Modern build tooling with Vite
- ✨ Full NPM package distribution

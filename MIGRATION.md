# Migration Guide: jQuery Plugin → Web Component

This guide helps you migrate from the old `jquery-qrcode` jQuery plugin to the new `@squidjam/qrcode-element` web component.

## Quick Comparison

### Old (jQuery Plugin)

```html
<!-- Include jQuery and plugin -->
<script src="jquery.min.js"></script>
<script src="jquery.qrcode.min.js"></script>

<!-- Create container -->
<div id="qrcode"></div>

<!-- Generate QR code -->
<script>
  jQuery('#qrcode').qrcode('Hello World');
</script>
```

### New (Web Component)

```html
<!-- No jQuery needed! -->
<script src="https://unpkg.com/@squidjam/qrcode-element"></script>

<!-- Just use the element -->
<qr-code data-text="Hello World"></qr-code>
```

## Migration Steps

### Step 1: Replace Script Includes

**Before:**
```html
<script src="jquery.min.js"></script>
<script src="jquery.qrcode.min.js"></script>
```

**After:**
```html
<!-- Option A: From CDN -->
<script src="https://unpkg.com/@squidjam/qrcode-element"></script>

<!-- Option B: From npm -->
<script type="module">
  import '@squidjam/qrcode-element';
</script>
```

### Step 2: Replace HTML

**Before:**
```html
<div id="qrcode"></div>
```

**After:**
```html
<qr-code data-text="Your text here"></qr-code>
```

### Step 3: Replace JavaScript

#### Simple text

**Before:**
```javascript
jQuery('#qrcode').qrcode('Hello World');
```

**After:**
```html
<qr-code data-text="Hello World"></qr-code>
```

#### With options

**Before:**
```javascript
jQuery('#qrcode').qrcode({
  width: 256,
  height: 256,
  text: 'Hello World',
  foreground: '#000000',
  background: '#ffffff'
});
```

**After:**
```html
<qr-code
  data-text="Hello World"
  data-width="256"
  data-height="256"
  data-foreground="#000000"
  data-background="#ffffff"
></qr-code>
```

#### Dynamic updates

**Before:**
```javascript
const $qrcode = jQuery('#qrcode');
$qrcode.qrcode('Initial Text');

// Update later
jQuery('#button').click(() => {
  $qrcode.empty();
  $qrcode.qrcode('New Text');
});
```

**After:**
```javascript
const qr = document.querySelector('qr-code');
qr.text = 'Initial Text';

// Update later
document.querySelector('#button').addEventListener('click', () => {
  qr.text = 'New Text';
});
```

## API Mapping

### jQuery Plugin API → Web Component API

| jQuery | Web Component | Notes |
|--------|---------------|-------|
| `.qrcode(text)` | `data-text="text"` or `qr.text = text` | Direct string |
| `.qrcode({text})` | `qr.text` | Property |
| `width` option | `data-width` or `qr.width` | In pixels |
| `height` option | `data-height` or `qr.height` | In pixels |
| `foreground` option | `data-foreground` or `qr.foreground` | Color hex |
| `background` option | `data-background` or `qr.background` | Color hex |
| `render: 'canvas'` | `data-render="canvas"` | Default |
| `render: 'table'` | `data-render="svg"` | SVG alternative |
| N/A | `data-error-level` | Error correction (0-3) |

## Common Patterns

### QR Code with Input

**Before:**
```html
<input type="text" id="input" placeholder="Enter text">
<div id="qrcode"></div>

<script>
jQuery('#input').on('change', function() {
  jQuery('#qrcode').empty();
  jQuery('#qrcode').qrcode(jQuery(this).val());
});
</script>
```

**After:**
```html
<input type="text" id="input" placeholder="Enter text">
<qr-code id="qrcode" data-text=""></qr-code>

<script>
document.querySelector('#input').addEventListener('change', (e) => {
  document.querySelector('#qrcode').text = e.target.value;
});
</script>
```

### QR Code Gallery

**Before:**
```html
<div id="gallery"></div>

<script>
const items = ['Item1', 'Item2', 'Item3'];
items.forEach(item => {
  const $div = jQuery('<div/>').appendTo('#gallery');
  $div.qrcode(item);
});
</script>
```

**After:**
```html
<div id="gallery"></div>

<script>
const items = ['Item1', 'Item2', 'Item3'];
const gallery = document.querySelector('#gallery');

items.forEach(item => {
  const qr = document.createElement('qr-code');
  qr.text = item;
  gallery.appendChild(qr);
});
</script>
```

### Event Handling

**Before:**
```javascript
// jQuery plugin didn't have events
// You had to check when rendering completed manually
```

**After:**
```javascript
const qr = document.querySelector('qr-code');

qr.addEventListener('qrcode-ready', (event) => {
  console.log('QR code generated!', event.detail);
  // event.detail contains: { text, width, height }
});
```

## Framework Migration

### React

**Before:**
```jsx
import $ from 'jquery';
import 'jquery.qrcode';

function QRCode({ text }) {
  useEffect(() => {
    $('#qrcode').qrcode(text);
  }, [text]);
  
  return <div id="qrcode" />;
}
```

**After:**
```jsx
import '@squidjam/qrcode-element';

function QRCode({ text }) {
  return <qr-code data-text={text} />;
}
```

### Vue

**Before:**
```vue
<template>
  <div ref="qrcode"></div>
</template>

<script>
export default {
  props: ['text'],
  watch: {
    text() {
      $(this.$refs.qrcode).empty();
      $(this.$refs.qrcode).qrcode(this.text);
    }
  }
}
</script>
```

**After:**
```vue
<template>
  <qr-code :data-text="text" />
</template>

<script>
import '@squidjam/qrcode-element';

export default {
  props: ['text']
}
</script>
```

## Behavior Changes

### What's the Same

✅ QR code generation algorithm - identical results  
✅ Canvas rendering - same quality and performance  
✅ Color customization  
✅ Error correction levels  
✅ Small bundle size  

### What's Different

⚠️ **No jQuery dependency** - You can remove jQuery entirely  
⚠️ **Shadow DOM encapsulation** - Styles don't leak in/out  
⚠️ **No HTML table rendering** - Use SVG instead  
⚠️ **Events are CustomEvent** - Not jQuery events  
⚠️ **Attributes are data-* prefixed** - Cleaner, more semantic  

## Testing the Migration

### Before Publishing

1. **Test in same browsers** as old plugin
   ```bash
   npm run dev
   # Test in Chrome, Firefox, Safari, Edge
   ```

2. **Compare outputs** - Generate same QR code with both versions
   ```javascript
   // Old: jQuery('#qrcode').qrcode('Test');
   // New: <qr-code data-text="Test"></qr-code>
   // Should be identical
   ```

3. **Test dynamic updates**
   ```javascript
   qr.text = 'Updated';
   // Should re-render instantly
   ```

4. **Test colors**
   ```javascript
   qr.foreground = '#0066ff';
   qr.background = '#f0f0f0';
   // Should update instantly
   ```

## Troubleshooting

### "qr-code is not defined"

**Problem:** Element not registered  
**Solution:** Ensure script is loaded
```html
<script src="https://unpkg.com/@squidjam/qrcode-element"></script>
```

### No QR code appears

**Problem:** Missing `data-text` attribute  
**Solution:** Always provide text
```html
<qr-code data-text="Required!"></qr-code>
```

### QR code not updating

**Problem:** Using setAttribute instead of properties  
**Solution:** Use properties for reactive updates
```javascript
// ❌ Wrong (in some frameworks)
qr.setAttribute('data-text', 'New');

// ✅ Right
qr.text = 'New';
```

### Styling not working

**Problem:** Trying to style shadow DOM elements  
**Solution:** Style the component itself
```css
/* ❌ Won't work */
qr-code canvas { border: 1px solid red; }

/* ✅ Works */
qr-code {
  display: inline-block;
  border: 2px solid red;
  padding: 10px;
}
```

## Performance Comparison

| Metric | Old jQuery | New Web Component |
|--------|------------|-------------------|
| Bundle Size | 4KB + jQuery (30KB) | 4KB (no deps) |
| Time to Render | ~10-50ms | ~5-50ms |
| Framework Support | jQuery only | All frameworks |
| Render Types | Canvas, Table | Canvas, SVG |
| TypeScript | ❌ | ✅ |

## Need Help?

Check out:
- [README.md](./README.md) - Full documentation
- [demo/index.html](./demo/index.html) - Interactive demo
- [demo/frameworks.html](./demo/frameworks.html) - Framework examples
- [BUILD.md](./BUILD.md) - Development guide

## Summary

| Aspect | Benefit |
|--------|----------|
| **No jQuery** | Smaller bundle, no conflicts |
| **Web Component** | Works anywhere - any framework |
| **Modern API** | Properties, events, attributes |
| **Better DX** | TypeScript, better tooling |
| **Same Algorithm** | QR codes are identical |

## Repository

For the latest version and to report issues, visit:
https://github.com/squidjam/qrcode-element

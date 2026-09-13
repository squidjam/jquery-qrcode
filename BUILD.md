# Build Instructions

## Development Setup

```bash
npm install
```

## Development Server

```bash
npm run dev
```

This starts a local dev server at `http://localhost:5173` with hot module replacement.

## Building for Production

```bash
npm run build
```

Produces:
- `dist/qrcode-element.js` - ES module
- `dist/qrcode-element.umd.js` - UMD bundle for `<script>` tags
- `dist/qrcode-element.min.js` - Minified version (if included in build)
- Source maps for debugging

## Testing

```bash
npm run test          # Run tests once
npm run test:ui       # Interactive test UI
```

## Type Checking

```bash
npm run type-check
```

## Linting

```bash
npm run lint          # Check for issues
npm run format        # Auto-fix formatting
```

## Publishing to NPM

```bash
# Ensure all tests pass
npm run test

# Build distribution
npm run build

# Login to npm (if not already logged in)
npm login

# Publish
npm publish
```

The package will be published to NPM as `@squidjam/qrcode-element`.

## Package Distribution

### NPM Usage

```bash
npm install @squidjam/qrcode-element
```

```javascript
import '@squidjam/qrcode-element';
```

### CDN Usage

```html
<script src="https://unpkg.com/@squidjam/qrcode-element@latest/dist/qrcode-element.umd.js"></script>
```

### From Source

```html
<script type="module" src="path/to/qrcode-element.js"></script>
```

## File Structure

```
src/
  qrcode.ts              # QR code algorithm
  render.ts              # Canvas/SVG rendering
  qrcode-element.ts      # Web component
  index.ts               # Public API
  __tests__/             # Test files

dist/                    # Built output (generated)

demo/
  index.html             # Main demo page
  frameworks.html        # Framework examples

package.json             # Package configuration
tsconfig.json            # TypeScript config
vite.config.ts           # Vite build config
```

## Build Output Details

### ES Module (`qrcode-element.js`)
- Modern JavaScript with ES2020 target
- Tree-shakeable
- Used by bundlers (webpack, Vite, etc.)
- Import: `import '@squidjam/qrcode-element'`

### UMD Bundle (`qrcode-element.umd.js`)
- Universal Module Definition
- Works in browsers via `<script>` tag
- Also works with AMD, CommonJS, etc.
- Global variable: `window.QRCodeElement`

## Size Optimization

The compiled bundle is optimized to be under 4KB minified+gzipped:
- QR algorithm: ~3KB
- Rendering logic: ~1KB
- Web component wrapper: ~0.5KB
- Total: ~4.5KB (with TypeScript overhead removed)

For production, use terser minification and gzip compression.

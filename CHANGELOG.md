# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-09-13

### Added
- ✨ Complete rewrite as a Web Component
- Framework-agnostic Custom Element implementation
- SVG rendering option (in addition to Canvas)
- TypeScript full type support
- Modern build tooling with Vite
- Comprehensive test suite with Vitest
- Interactive demo pages with multiple examples
- NPM package distribution (@squidjam/qrcode-element)
- CDN/UMD bundle support
- Full API documentation
- Framework integration guides (React, Vue, Svelte, Angular)

### Changed
- **BREAKING**: Removed jQuery dependency
- **BREAKING**: Changed API from jQuery plugin to Web Component
  - Old: `$('#qrcode').qrcode({text, width, height})`
  - New: `<qr-code data-text="" data-width="" data-height=""></qr-code>`
- Replaced table rendering with SVG for better scalability
- Improved error correction level handling (0-3 range)
- Better attribute naming with `data-*` prefix
- Repository renamed from `jquery-qrcode` to `qrcode-element`

### Removed
- jQuery dependency
- Table rendering option (replaced with SVG)
- Legacy browser support (requires modern Web Components support)

### Fixed
- Memory leaks in resize observer
- Color handling in different render modes
- Type safety with TypeScript

### Performance
- Smaller bundle size: 4KB (was 4KB + jQuery 30KB dependency)
- Faster initial render in frameworks
- More efficient re-renders

## [1.0.0] - Original Release (jquery-qrcode)

### Features
- jQuery plugin for QR code generation
- Standalone, no external services
- Canvas rendering
- Table rendering fallback
- Customizable colors and size
- Error correction levels
- ~4KB minified+gzipped

---

## Version Format

Versions follow Semantic Versioning: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## How to Release

See [BUILD.md](./BUILD.md) for detailed publishing instructions.

## Repository

https://github.com/squidjam/qrcode-element

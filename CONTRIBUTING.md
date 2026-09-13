# Contributing to QR Code Element

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/squidjam/qrcode-element.git
cd qrcode-element
git checkout web-component-conversion
npm install
```

## Development Workflow

1. **Start dev server**
   ```bash
   npm run dev
   ```
   Opens demo at `http://localhost:5173`

2. **Make your changes**
   - Edit files in `src/`
   - Dev server has hot reload

3. **Run tests**
   ```bash
   npm run test
   npm run test:ui  # Interactive mode
   ```

4. **Check types**
   ```bash
   npm run type-check
   ```

5. **Format code**
   ```bash
   npm run format
   npm run lint
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
  qrcode.ts              # QR algorithm (don't modify lightly)
  render.ts              # Canvas/SVG rendering
  qrcode-element.ts      # Web component class
  index.ts               # Public API
  __tests__/             # Tests

demo/                    # Demo pages
dist/                    # Built files (generated)
```

## Areas for Contribution

### Algorithm Improvements
- Optimize QR code generation speed
- Reduce memory footprint
- Support additional data modes

### Features
- Better SVG styling options
- WebP/AVIF export support
- Batch generation
- Accessibility improvements

### Documentation
- More framework examples
- Performance benchmarks
- Tutorial videos
- Use case examples

### Testing
- More edge case tests
- Browser compatibility tests
- Performance benchmarks
- Visual regression tests

### Build & Release
- CI/CD improvements
- Changelog maintenance
- Release automation

## Code Style

- Use TypeScript for type safety
- Follow existing code style
- Add comments for complex logic
- Keep functions focused and small

## Testing Requirements

All contributions should include tests:

```typescript
it('should do something', () => {
  const qr = new QRCode(0, 0);
  qr.addData('Test');
  qr.make();
  expect(qr.modules).toBeDefined();
});
```

Run tests with:
```bash
npm run test
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Add tests if applicable
5. Run `npm run lint` and `npm run format`
6. Run `npm run test` to ensure tests pass
7. Commit with clear messages
8. Push to your fork
9. Create a Pull Request describing your changes

## Commit Messages

Use clear, descriptive commit messages:

```
✨ Add feature: support for custom QR patterns
Fix: correct color handling in SVG render
📚 Docs: update README with new examples
🧪 Test: add edge case tests
♻️ Refactor: simplify render logic
```

## Performance Guidelines

- Keep bundle size under 5KB (current: ~4KB)
- QR generation should complete in < 100ms
- Avoid unnecessary re-renders
- Profile with DevTools before optimizing

## Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Adding examples

Documentation files:
- `README.md` - Main documentation
- `MIGRATION.md` - Migration guide
- `BUILD.md` - Development guide
- `demo/` - Interactive examples

## Questions?

Open an issue or discussion on GitHub. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

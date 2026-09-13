import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/qrcode-element.ts',
      name: 'QRCodeElement',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'qrcode-element.js';
        if (format === 'umd') return 'qrcode-element.umd.js';
        return 'qrcode-element.js';
      },
    },
    minify: 'terser',
    sourcemap: true,
    target: 'ES2020',
  },
  server: {
    open: '/demo/index.html',
  },
});

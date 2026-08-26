// Enhanced build configuration for TypeScript compatibility
import { build } from 'esbuild';
import { resolve } from 'path';

async function buildServer() {
  try {
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node20',
      format: 'esm',
      outdir: 'dist',
      packages: 'external',
      loader: {
        '.ts': 'ts',
        '.js': 'js'
      },
      tsconfig: 'tsconfig.json',
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      external: [
        'edge-tts',
        '@neondatabase/serverless',
        'drizzle-orm',
        'ws',
        'express',
        'multer',
        'passport',
        'connect-pg-simple',
        'express-session'
      ],
      minify: false,
      sourcemap: true,
      logLevel: 'info',
      resolveExtensions: ['.ts', '.js', '.mjs', '.json'],
      mainFields: ['module', 'main'],
      conditions: ['import', 'module', 'default']
    });
    
    console.log('✓ Server build completed successfully');
  } catch (error) {
    console.error('✗ Server build failed:', error);
    process.exit(1);
  }
}

buildServer();
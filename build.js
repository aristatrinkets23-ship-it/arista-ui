const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const frontendDir = __dirname;
const distDir = path.join(frontendDir, 'dist');

console.log('=== ARISTA TRINKETS FRONTEND PRODUCTION BUILD ===');

// Step 1: Type Checking
console.log('1. Running TypeScript Typecheck (tsc --noEmit)...');
try {
  execSync('npx tsc --noEmit', { cwd: frontendDir, stdio: 'inherit' });
  console.log('   ✓ TypeScript typecheck passed clean.');
} catch (err) {
  console.error('   ✗ Typecheck failed:', err.message);
  process.exit(1);
}

// Step 2: Ensure dist directory exists & clean previous build
console.log('2. Preparing dist/ directory...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Step 3: Bundle Angular application with esbuild
console.log('3. Bundling Angular 22 application with esbuild (--minify)...');
try {
  execSync(
    'npx esbuild src/main.ts --bundle --outfile=dist/bundle.js --format=esm --target=es2022 --loader:.ts=ts --minify',
    { cwd: frontendDir, stdio: 'inherit' }
  );
  console.log('   ✓ Production bundle generated at dist/bundle.js');
} catch (err) {
  console.error('   ✗ Esbuild bundling failed:', err.message);
  process.exit(1);
}

// Step 4: Copy Static Assets
console.log('4. Copying static HTML, CSS, and asset files to dist/...');

// Helper to copy files/folders recursively
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

// Copy index.html
if (fs.existsSync(path.join(frontendDir, 'src', 'index.html'))) {
  fs.copyFileSync(path.join(frontendDir, 'src', 'index.html'), path.join(distDir, 'index.html'));
}

// Copy favicon.ico and favicon.webp
if (fs.existsSync(path.join(frontendDir, 'src', 'favicon.ico'))) {
  fs.copyFileSync(path.join(frontendDir, 'src', 'favicon.ico'), path.join(distDir, 'favicon.ico'));
}
if (fs.existsSync(path.join(frontendDir, 'src', 'favicon.webp'))) {
  fs.copyFileSync(path.join(frontendDir, 'src', 'favicon.webp'), path.join(distDir, 'favicon.webp'));
}

// Copy src/styles.css
if (fs.existsSync(path.join(frontendDir, 'src', 'styles.css'))) {
  fs.copyFileSync(path.join(frontendDir, 'src', 'styles.css'), path.join(distDir, 'styles.css'));
}

// Copy styles/tokens.css -> dist/styles/tokens.css
if (fs.existsSync(path.join(frontendDir, 'styles', 'tokens.css'))) {
  fs.mkdirSync(path.join(distDir, 'styles'), { recursive: true });
  fs.copyFileSync(path.join(frontendDir, 'styles', 'tokens.css'), path.join(distDir, 'styles', 'tokens.css'));
}

// Copy src/assets -> dist/assets
if (fs.existsSync(path.join(frontendDir, 'src', 'assets'))) {
  copyRecursive(path.join(frontendDir, 'src', 'assets'), path.join(distDir, 'assets'));
}

console.log('   ✓ Static assets copied successfully.');
console.log('=== BUILD COMPLETE: Production bundle ready in dist/ ===');

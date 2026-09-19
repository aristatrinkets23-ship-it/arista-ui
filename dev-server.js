const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 4200;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Remove legacy src/bundle.js if present
const legacyBundle = path.join(__dirname, 'src', 'bundle.js');
if (fs.existsSync(legacyBundle)) {
  try { fs.unlinkSync(legacyBundle); } catch (e) {}
}

// Build bundle.js on server startup into dist/bundle.js
function buildBundle() {
  try {
    console.log('Compiling Angular TypeScript bundle to dist/bundle.js...');
    execSync('npx esbuild src/main.ts --bundle --outfile=dist/bundle.js --format=esm --target=es2022 --loader:.ts=ts', {
      cwd: __dirname,
      stdio: 'inherit'
    });
    console.log('Bundle compiled successfully.');
  } catch (err) {
    console.error('Bundle compilation error:', err.message);
  }
}

buildBundle();

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Handle bundle.js request from dist/bundle.js
  if (urlPath === '/bundle.js') {
    const bundlePath = path.join(__dirname, 'dist', 'bundle.js');
    if (fs.existsSync(bundlePath)) {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      return fs.createReadStream(bundlePath).pipe(res);
    }
  }

  // Handle styles/tokens.css request
  if (urlPath.includes('/styles/tokens.css')) {
    const tokensPath = path.join(__dirname, 'styles', 'tokens.css');
    if (fs.existsSync(tokensPath)) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      return fs.createReadStream(tokensPath).pipe(res);
    }
  }

  // Handle ANY request containing /assets/ regardless of nested route prefixes
  if (urlPath.includes('/assets/')) {
    const relativeAssetPath = urlPath.substring(urlPath.indexOf('/assets/'));
    let assetPath = path.join(__dirname, 'src', relativeAssetPath);
    if (!fs.existsSync(assetPath)) {
      assetPath = path.join(__dirname, 'dist', relativeAssetPath);
    }
    if (fs.existsSync(assetPath)) {
      const extname = String(path.extname(assetPath)).toLowerCase();
      const contentType = MIME_TYPES[extname] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      return fs.createReadStream(assetPath).pipe(res);
    }
  }

  let filePath = path.join(__dirname, 'src', urlPath === '/' ? 'index.html' : urlPath);

  // Fallback for SPA Routing if file doesn't exist or has no extension
  if (!path.extname(filePath) || !fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'src', 'index.html');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Server Error: ${error.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Arista Trinkets Frontend Dev Server running on http://localhost:${PORT}`);
});

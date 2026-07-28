import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// src/ is the web root — serve all assets under the /src URL prefix
app.use(
  '/src',
  express.static(path.join(__dirname, 'src'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();

      // Cache heavy/immutable assets aggressively (images, fonts, audio, video, icons)
      if (
        filePath.includes('/assets/') ||
        ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.mp4', '.webm'].includes(ext)
      ) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // Sensible caching for core code, styles, and structured content (JS, CSS, JSON)
      else if (['.js', '.mjs', '.css', '.json'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
      }
    }
  })
);

// Serve SEO/metadata files from the URL root (they now live in src/)
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'src', 'favicon.ico'));
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'src', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'src', 'sitemap.xml'));
});

// Fallback: serve src/index.html for all HTML navigation requests
app.get('*', (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  const ext = path.extname(req.path).toLowerCase();

  if (acceptHeader.includes('text/html') || (!ext && !req.path.startsWith('/api/'))) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(path.join(__dirname, 'src', 'index.html'));
  }

  // Otherwise, let it fall through to a standard 404 response
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

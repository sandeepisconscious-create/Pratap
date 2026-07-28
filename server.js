import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets specifically from the /src prefix path
app.use(
  '/src',
  express.static(path.join(__dirname, 'src'), {
    maxAge: '1d', // Default fallback maxAge of 1 day
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

// Explicitly serve metadata/SEO/essential files from the root to prevent exposing raw server files
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// Fallback to index.html only for navigation/HTML requests.
// This prevents missing static asset requests (e.g. non-existent .png or .js files)
// from incorrectly receiving the index.html page as a response, which can cause browser parsing errors.
app.get('*', (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  const ext = path.extname(req.path).toLowerCase();

  // If request expects HTML, or does not have a file extension (meaning it's a client routing path)
  if (acceptHeader.includes('text/html') || (!ext && !req.path.startsWith('/api/'))) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // Otherwise, let it fall through to a standard 404 response
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

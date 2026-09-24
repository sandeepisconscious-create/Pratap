import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security & baseline privacy headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// src/ is the web root — serve all assets under the /src URL prefix
app.use(
  "/src",
  express.static(path.join(__dirname, "src"), {
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();

      // Cache heavy/immutable assets aggressively (images, fonts, audio, video, icons)
      if (
        filePath.includes("/assets/") ||
        [
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".svg",
          ".webp",
          ".ico",
          ".woff",
          ".woff2",
          ".mp4",
          ".webm",
        ].includes(ext)
      ) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
      // Development & updates: Ensure code, styles, and structured data are never stale
      else if ([".js", ".mjs", ".css", ".json"].includes(ext)) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
    },
  }),
);

// Serve SEO/metadata files from the URL root (they now live in src/)
app.get("/favicon.ico", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(path.join(__dirname, "favicon.ico"));
});

app.get("/robots.txt", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(path.join(__dirname, "robots.txt"));
});

app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(path.join(__dirname, "sitemap.xml"));
});

// Fallback: serve src/index.html for all HTML navigation requests
app.get("*", (req, res, next) => {
  const acceptHeader = req.headers.accept || "";
  const ext = path.extname(req.path).toLowerCase();

  if (
    acceptHeader.includes("text/html") ||
    (!ext && !req.path.startsWith("/api/"))
  ) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    return res.sendFile(path.join(__dirname, "index.html"));
  }

  // Otherwise, let it fall through to a standard 404 response
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

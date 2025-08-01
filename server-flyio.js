const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Custom middleware to set correct MIME types
app.use((req, res, next) => {
  // Fix MIME types for JavaScript files
  if (req.url.endsWith('.js') || req.url.endsWith('.mjs')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  
  // Fix MIME types for CSS files
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  }
  
  // Fix MIME types for HTML files
  if (req.url.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  next();
});

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, 'dist/spa'), {
  setHeaders: (res, path) => {
    // Set caching for assets
    if (path.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    
    // No cache for HTML
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Handle React Router routes - serve index.html for all non-file requests
app.get('*', (req, res) => {
  // Check if request is for a file (has extension)
  if (path.extname(req.path)) {
    // If file not found, send 404
    res.status(404).send('File not found');
  } else {
    // For routes without extensions, serve index.html
    res.sendFile(path.join(__dirname, 'dist/spa/index.html'));
  }
});

// Health check endpoint for fly.io
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    app: 'MR HOST'
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MR HOST server running on port ${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'dist/spa')}`);
  console.log(`🔧 MIME types fixed for JavaScript modules`);
});

module.exports = app;

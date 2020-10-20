workbox.core.setCacheNameDetails({prefix: "owd-client"});

/*
self.addEventListener('message', (event) => {

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
*/

workbox.core.skipWaiting();

workbox.core.clientsClaim();

workbox.precaching.cleanupOutdatedCaches();

/*
workbox.precaching.precacheAndRoute([
  // precached file list
])
*/

// Serve all html files with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  /\.html$/,
  new workbox.strategies.StaleWhileRevalidate()
);

// Serve all css files with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.StaleWhileRevalidate()
);

// Serve all css files with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.StaleWhileRevalidate()
);

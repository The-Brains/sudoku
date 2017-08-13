var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '',
    'style.css',
    'scripts/main.js',
    'scripts/solveworker.js',
    'scripts/sudoku.js',
    'scripts/sudoku.wasm',
    'scripts/sudokucsolver.js',
    'scripts/sudokusolver.js',
    'https://unpkg.com/react@15/dist/react.min.js',
    'https://unpkg.com/react-dom@15/dist/react-dom.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                var fetchRequest = event.request.clone();

                fetchResponse = fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );

                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetchResponse;
            })
    );
});
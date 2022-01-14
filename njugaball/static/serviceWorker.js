
importScripts('./cache-polyfill.js');
const cache_name = 'xound-music';

var files = [
    "/root.html",
    'views/root.html',
    'js/moult-ui.js',
    'js/main.js',
    'components/indexUI.json',
    'components/header.json',
    'components/sidebar.json',
    'css/zaphy',
    'css/zaphy-min'
    ]
    
self.addEventListener('install',(event )=> {
    event.waitUntil(
        caches.open(cache_name)
        .then((caches) =>{
            
            return cache.addAll(files)
            .then(()=>{
                alert('cached');
                return self.skipWarning();
            })
            .cache((error)=>{
                alert('Not Cached');
            });
            
        })
        
        );
});


self.addEventListener('fetch',(event)=>{
    alert('fetching data');
    
    var req = event.request;
    var url = new URL(request.url);
    
    if(url.origin === location.origin) {
       alert('static files');
       event.respondWith(cacheFirst);
    } else {
        alert('Dynamic API cache');
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(request) {
    const dynamicCache = await caches.open(cache_name);
    
    try {
        const networkResponse = await fetch(request);
        dynamicCache.put(request,networkResponse.clone()).catch((err) =>{
            alert(err.message);
        });
        return networkResponse;
    } catch (err) {
        const cachedResponse = await dynamicCache.match(request);
        return cachedResponse;
    }
}

self.addEventListener('activate',(event) =>{
    
    event.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.map((cache)=>{
                    if(cache !== cache_name) {
                        return caches.delete(cache);
                    }
                })
                )
        })
        .then(function(){
            
            return self.clients.claim();
            
        })
        );
        
        
});

self.addEventListener('push',(event)=>{
    
    event.waitUntil(self.registration. showNotification('hi',{"body":"more"}));
});
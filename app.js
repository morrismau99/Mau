//obtenemos la url del servidor
var url=window.location.href;
//definimos que nuestro sw.js se encuentra en el repositorio
var ubicacionSw='/service-worker.js';

if ( navigator.serviceWorker ) {

    if(url.includes('127.0.0.1')){
        ubicacionSw='/service-worker.js';
    }
    navigator.serviceWorker.register(ubicacionSw);
}
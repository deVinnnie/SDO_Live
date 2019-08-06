import React from 'react';
import ReactDOM from 'react-dom';
import {Main} from './Main';
import {Spinner} from './Spinner';

window.onload = function () {
    launchFullScreen(document.documentElement);
    //Request Full Screen. Normally requires user interaction. Use Firefox and alter config so that:
    //full-screen-api.allow-trusted-requests-only = false
    //See: http://stackoverflow.com/questions/9454125/javascript-request-fullscreen-is-unreliable

    let spinner = new Spinner();

    ReactDOM.render(
        <Main spinner={spinner}/>,
        document.getElementById('root')
    );
}


// From: http://davidwalsh.name/fullscreen
// Find the right method, call on correct element
function launchFullScreen(element) {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}

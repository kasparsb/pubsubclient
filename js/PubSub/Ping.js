import {ping as messagePing} from './messages';
import isWsOpen from './isWsOpen';
import timer from './timer';
import Watch from './Watch';

import Log from './Log';

function Ping(interval, pongTimeout, log) {
    this.ws = null;

    this.interval = interval;
    this.pongTimeout = pongTimeout;

    // Kad nosūtīts ping uz serveri
    this.sent = false;

    this.failedCb = function(){}

    // Logging function
    this.log = typeof log == 'undefined' ? function(){} : log;
}
Ping.prototype = {

    start() {
        this.watch = new Watch(() => this.ping(), this.interval)
    },

    stop() {
        if (!this.watch) {
            return;
        }

        this.watch.stop();
    },

    failed(cb) {
        this.failedCb = cb;
    },

    setWs(websocket) {
        this.ws = websocket;

        if (this.ws) {
            this.start();
        }
        else {
            this.sent = false;
            this.stop();
        }
    },

    pongRecieved() {
        this.log('pong '+this.sent.duration());

        this.sent = false;
    },

    ping() {
        if (!this.ws) {
            return;
        }

        // Nesūtām atkārtou ping, ja pong nav saņemts
        if (!this.sent) {
            this.sent = this.send();
        }

        if (this.sent && this.sent.duration() > this.pongTimeout) {
            this.sent = false;

            this.failedCb();
        }
    },

    send() {
        if (!isWsOpen(this.ws)) {
            return false;
        }

        this.log('ping');

        this.ws.send(messagePing());

        return timer();
    },
}

export default Ping
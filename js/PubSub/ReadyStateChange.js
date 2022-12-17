import Watch from './Watch';

const enumReadyState = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
};

const wsNotInitialized = 100;

function ReadyStateChange(cb, timeout) {
    this.cb = cb;
    this.ws = null;

    this.timeout = timeout;

    this.readyState = wsNotInitialized;
}
ReadyStateChange.prototype = {
    setWs(websocket) {
        // Nolasām state pirms uzstādīt websocket
        this.readState();

        this.ws = websocket;

        if (this.ws) {
            // Start watch
            this.start();
        }
        else {
            this.stop();
        }
    },

    changed() {
        this.watch.watch();
    },

    start() {
        this.watch = new Watch(() => this.readState(), this.timeout)
    },

    stop() {
        if (this.watch) {
            this.watch.stop();
        }
    },

    readState() {
        if (this.readyState === (this.ws ? this.ws.readyState : wsNotInitialized)) {
            return;
        }

        if (this.ws) {
            this.readyState = this.ws.readyState;
            this.cb(enumReadyState[this.readyState]);
        }
        else {
            this.readyState = wsNotInitialized;
            this.cb('NOTINITIALIZED');
        }
    }
}

export default ReadyStateChange
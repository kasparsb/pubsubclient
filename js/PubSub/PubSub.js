import {
    text as messageText,
    adminWatch as messageAdminWatch,
    adminUnwatch as messageAdminUnwatch,
    adminUnwatchAll as messageAdminUnwatchAll
} from './messages';
import isWsOpen from './isWsOpen';
import isPong from './isPong';
import isMessageStatus from './isMessageStatus';
import isMessageMessage from './isMessageMessage';
import timer from './timer';
import ReadyStateChange from './ReadyStateChange';
import Ping from './Ping';
import Retry from './Retry';
import Log from './Log';


const timeout = {
    retry: 2000,
    monitor: 1000,
    ping: 5000,
    pongWait: 2000
}

function PubSub(wsUri, channel, client) {

    this.isStarted = false;

    this.wsUri = wsUri;

    this.websocket = null;

    // Kanāls pie, kura slēgties
    this.channel = channel;
    // Client ID
    // Pats izdomā, šeit tiek izmantots account hash
    this.client = client;

    this.onMessageCb = function(){};
    this.onSubscriberStatusCb = function(){};
    this.onReadyStateChangeCb = function(){};
    this.onConnectCb = function(){};

    // Message listeners by messageType
    this.onMessageTypeCb = [];

    this.monitorRs = new ReadyStateChange(state => this.handleReadyStateChange(state), timeout.monitor);

    this.monitorPing = new Ping(timeout.ping, timeout.pongWait, (message) => this.log(message))
    this.monitorPing.failed(() => this.handlePingFailed());

    this.connectRetry = new Retry(() => this.connect(), timeout.retry);

    this.debug = false;

    // Auto connect
    //setTimeout(() => this.connect(), 1);

    return this;
}

PubSub.prototype = {
    /**
     * Connect with client id
     */
    connect(channel, client) {

        if (typeof channel != 'undefined') {
            this.channel = channel;
        }

        if (typeof client != 'undefined') {
            this.client = client;
        }

        this.isStarted = true;

        this.websocket = new WebSocket(this.wsUri+'?channel='+this.channel+'&client='+this.client);

        this.monitorRs.setWs(this.websocket);

        this.websocket.onopen = ev => this.handleOpen();
        this.websocket.onclose = ev => this.handleClose('closed');
        this.websocket.onerror = ev => this.handleClose('error');
        this.websocket.onmessage = ev => this.handleMessage(ev.data);

        return this;
    },

    disconnect() {
        this.isStarted = false;
        this.websocket.close();
    },

    handleOpen() {
        this.log('socket open');

        this.monitorRs.changed();

        this.monitorPing.setWs(this.websocket);

        this.onConnectCb();
    },

    handleClose(reason) {
        this.monitorRs.setWs(null);
        this.monitorPing.setWs(null);

        if (this.isStarted) {
            this.connectRetry.retry('socket '+reason);
        }
    },

    handlePingFailed() {
        this.log('ping not recieved')

        // Ja pong nav saņemts, tad close. Lai notiek reconnect
        if (this.websocket) {
            let c = timer();
            this.websocket.close();
            this.log('close duration '+c.duration())
        }
    },

    handleMessage(data) {
        data = JSON.parse(data);

        if (isPong(data)) {
            this.monitorPing.pongRecieved();
        }
        else if (isMessageStatus(data)) {
            this.onSubscriberStatusCb(data.status, data.subscriber)
        }
        else if (isMessageMessage(data)) {
            this.onMessageCb(data.message, data.payload, data.sender)
        }
        else {
            if (typeof data.type != 'undefined') {
                if (typeof this.onMessageTypeCb[data.type] != 'undefined') {
                    this.onMessageTypeCb[data.type].forEach(cb => cb(data.payload))
                }
            }
        }
    },

    handleReadyStateChange(state) {
        this.log('rs: '+state);

        if (this.onReadyStateChangeCb) {
            this.onReadyStateChangeCb(state)
        }
    },

    /**
     * Send message to channel
     */
    send(message, type) {
        if (isWsOpen(this.websocket)) {
            this.websocket.send(messageText(message));
        }
    },

    /**
     * Use case: admin
     * Listen on admin side event
     */
    watch(event, data) {
        this.websocket.send(messageAdminWatch(event, data));
    },

    unwatch(event, data) {
        this.websocket.send(messageAdminUnwatch(event, data));
    },

    unwatchAll() {
        console.log(messageAdminUnwatchAll());
        this.websocket.send(messageAdminUnwatchAll());
    },

    onMessage(cb) {
        this.onMessageCb = cb;

        return this
    },

    on(messageType, cb) {
        if (typeof this.onMessageTypeCb[messageType] == 'undefined') {
            this.onMessageTypeCb[messageType] = [];
        }
        this.onMessageTypeCb[messageType].push(cb);
    },

    /**
     * Channel subscriber status
     */
    onSubscriberStatus(cb) {
        this.onSubscriberStatusCb = cb;
    },

    onReadyStateChange(cb) {
        this.onReadyStateChangeCb = cb;

        return this;
    },

    onConnect(cb) {
        this.onConnectCb = cb;

        return this;
    },

    log(message) {
        if (this.debug) {
            Log(message)
        }
    }
}

export default PubSub;
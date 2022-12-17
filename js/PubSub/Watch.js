function Watch(cb, timeout) {
    this.timeout = timeout;
    this.cb = cb;

    this.interval = 0;

    this.start();
}
Watch.prototype = {
    start() {
        this.interval = setInterval(() => this.watch(), this.timeout)
    },
    stop() {
        clearInterval(this.interval);
    },
    watch() {
        this.cb();
    }
}

export default Watch
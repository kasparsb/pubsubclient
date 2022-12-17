import Log from './Log';

function Retry(cb, timeout) {
    this.inProgress = false;
    this.reason = '';

    this.cb = cb;
    this.timeout = timeout;
}
Retry.prototype = {
    retry(reason) {
        if (this.inProgress) {
            return;
        }
        this.reason = reason;
        this.inProgress = true;

        Log('retry in '+this.timeout);

        setTimeout(() => {
            Log('retry again because '+this.reason)

            this.inProgress = false;
            this.cb();
        }, this.timeout);
    }
}

export default Retry;
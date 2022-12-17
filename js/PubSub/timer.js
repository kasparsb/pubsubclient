function Timer() {
    this.start = (new Date()).getTime();
}
Timer.prototype = {
    duration() {
        return (new Date()).getTime() - this.start;
    }
}

export default function(){
    return new Timer()
}
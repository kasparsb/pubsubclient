function text(message) {
    return JSON.stringify({
        type: 'message',
        message: message
    })
}

 function ping() {
    return JSON.stringify({
        type: 'ping'
    })
}

function adminWatch(eventName, subjects) {
    return JSON.stringify({
        type: 'watch',
        eventName: eventName,
        subjects: subjects
    })
}

function adminUnwatch(eventName, subjects) {
    return JSON.stringify({
        type: 'unwatch',
        eventName: eventName,
        subjects: subjects
    })
}

function adminUnwatchAll() {
    return JSON.stringify({
        type: 'unwatchall'
    })
}

export {text, ping, adminWatch, adminUnwatch, adminUnwatchAll}
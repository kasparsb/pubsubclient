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

export {text, ping}
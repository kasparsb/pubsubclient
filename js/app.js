import {q, click, value} from 'dom-helpers';

const url = 'ws://pubsub.darbs.xyz:8068';

import PubSub from './PubSub/PubSub';

//let connection = new PubSub('ws://192.168.0.42:8165', 'channnel', 'client1');
let connection = new PubSub(url);

connection.onReadyStateChange(state => {
    q('.connection-status').innerHTML = state;
    console.log(state)
});
connection.onMessage(message => {
    console.log(message)
    value('.response', message);
});



click('[name=send]', () => connection.send(value('[name=message]')))
click('[name=connect]', () => {
    connection.connect(value('[name=channel]'), value('[name=client]'))
})
click('[name=disconnect]', () => connection.disconnect())

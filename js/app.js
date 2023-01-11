import {q, click, value} from 'dom-helpers';

const url = 'ws://pubsub.darbs.xyz:8068';

import PubSub from './PubSub/PubSub';

function createConnection(index) {
    let connection = new PubSub(url);
    connection.onConnect(() => {
        console.log(index+' connected');
    });
    connection.connect('admin', index+'client');
}
for (let i = 0; i < 240; i++) {
    createConnection(i)
}


//let connection = new PubSub(url);

// connection.onReadyStateChange(state => {
//     q('.connection-status').innerHTML = state;
// });
// connection.onConnect(() => {
//     if (value('[name=listen_channel_change_events]') == 'on') {
//         connection.watch('channelChange', [
//             'tablet',
//             'admin'
//         ])
//     }
// });
// connection.onMessage((message, payload, sender) => {
//     console.log('MESSAGE', message, payload, sender);
//     q('[name=response]').value += (sender ? sender.client : 'app server')+': '+message+"\n";
// });

// connection.on('channelChange', (data) => {
//     console.log('channelChange', data);

//     data.forEach(channel => {
//         q('.channel-'+channel.channel+' span').innerHTML = channel.data.subscribers_count;
//     })

// });
// connection.on('subscriberChange', (data) => {
//     console.log('subscriberChange', data);
// });
// connection.onSubscriberStatus((status, subscriber) => {
//     console.log(status, subscriber);
// });



// click('[name=send]', () => {
//     connection.send(value('[name=message]'))
//     q('[name=message]').value = '';
// })
// click('[name=connect]', () => {
//     connection.connect(value('[name=channel]'), value('[name=client]'))
// })
// click('[name=disconnect]', () => connection.disconnect())


// click('[name=listen_subscribers]', () => {
//     connection.watch('subscriberChange', value('[name=subscriber_ids]').split(/\r?\n/))
// })
// click('[name=unwatch_subscribers]', () => {
//     connection.unwatch('subscriberChange', value('[name=subscriber_ids]').split(/\r?\n/))
// })

// click('[name=unwatch_all]', () => {
//     connection.unwatchAll()
// })

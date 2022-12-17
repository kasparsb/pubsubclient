import {jsx, prepend, q} from 'dom-helpers';

let el = q('#log');

export default function(message) {
    console.log(message);
    if (el) {
        prepend(q('#log'), <div>{message}</div>)
    }
}
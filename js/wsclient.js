import WebSocket from 'ws'
import ReadLine from 'readline';

const ws = new WebSocket('wss://api.bitfinex.com/ws/2');


ws.on('open', function open() {
   ws.send('something');
});

ws.on('message', function incoming(data) {
   console.log('<=', data);
});

const rl = ReadLine.createInterface({
   input: process.stdin
});

var msg = '';
rl.on('line', (input) => {
   if (input.length > 0) {
      msg = msg.concat(input);
   } else {
      if (msg.length !== 0) {
         let json = JSON.parse(msg);
         console.log('=>', json);
         ws.send(JSON.stringify(json));
         msg = '';
      }
   }
   //console.log(`Received: ${input}`);
   // ws.send(input)
});

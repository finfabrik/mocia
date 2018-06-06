import WebSocket from 'ws'
import ReadLine from 'readline';

const noop = () => {};
const heartbeat = () => {
   this.isAlive = true;
};

const rl = ReadLine.createInterface({
   input: process.stdin
});

const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', (ws, req) => {
   ws.isAlive = true;
   console.log('ws connected ', req);
   ws.on('message', msg => {
      console.log('received: ', msg);
   });

   rl.on('line', (input) => {
      console.log(`Received: ${input}`);
      ws.send(input)
   });
});

export default wss;

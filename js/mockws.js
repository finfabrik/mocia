import WebSocket from 'ws'
import ReadLine from 'readline';
import config from 'config';

const noop = () => {};
const heartbeat = () => {
   this.isAlive = true;
};

const rl = ReadLine.createInterface({
   input: process.stdin
});

const wsPort = config.get('server.ws');
const wss = new WebSocket.Server({ port: wsPort });
console.log("WS listens on", wsPort);

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

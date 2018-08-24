import "babel-polyfill";
import Mongoose, { Schema } from 'mongoose';

let orders = [];

let quoinexScheme = new Schema({
    id : String,
    order_type: String,
    side: String,
    status: String
});

const quoinexPlugin = {
   name: 'quoinexPlugin',
   version: '1.0.0',
   register: async function (server, options) {
      server.route([   
        {
            method: 'GET',
            path: '/products',
            handler: (request, h) => {
                request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
                let res = [
                    {
                        "currency": "USD",
                        "currency_pair_code": "BTCUSD",
                        "quoted_currency": "USD",
                        "base_currency": "BTC"
                    },
                    {
                        "currency": "USD",
                        "currency_pair_code": "ETHUSD",
                        "quoted_currency": "USD",
                        "base_currency": "ETH"
                    }
                ];
                return res;
            }
         },

         {
            method: 'POST',
            path: '/orders/',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let id = Math.floor(Date.now()/10);
               let res = {
                    "id": id,
                    "order_type": request.payload['order']['order_type'],
                    "side": request.payload['order']['side'],
                    "status": "live"
                };
                let store = {
                    "id": id,
                    "order_type": request.payload['order']['order_type'],
                    "side": request.payload['order']['side'],
                    "status": "filled"
                };
                orders.push(store);
                //Mongoose.Collection('quoinex').insert(store);
                return res;
            }
         },

         {
            method: 'GET',
            path: '/orders',
            handler: (request, h) => {
            //    request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
            //    let res = {
            //     "models": orders
            //   };
            //    return res;
            let store = {
                "id": "12",
                "order_type": "xyz",
                "side": "xyz",
                "status": "filled"
            };
            //Mongoose.Collection('quoinex').insert(store);
            console.log(Mongoose.connection.readyState);
                return {};
            }
         },

         {
            method: 'GET',
            path: '/orders/{id}',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = orders.pop();
               return res;
            }
         },

         {
            method: 'PUT',
            path: '/orders/{id}/cancel',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = 
               {
                    "id": request.params.id,
                    "status": "cancelled"
               };
                orders = orders.filter(function( obj ) {
                    return obj.id !== request.params.id;
                });

               return res;
            }
         }
      ]);
   }
};

export default quoinexPlugin;

import "babel-polyfill";
import Mongoose, { Schema } from 'mongoose';
import MongoUtils from './mongoutils';

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
                    "status": "filled"
                };
                let order = new MongoUtils.quoinexOrder(res);
                res["status"] = order.save((err, order) => {
                    if(err) return "rejected";
                    else return "live";
                });
                return res;
            }
         },

         {
            method: 'GET',
            path: '/orders',
            handler: (request, h) => {
                let res = MongoUtils.quoinexOrder.find((err, orders) => {
                    if(!err) return orders;
                    else return [];
                });
                return res;
            }
         },

         {
            method: 'GET',
            path: '/orders/{id}',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = MongoUtils.quoinexOrder.findOne({id : request.params.id}, (err, order) => {
                   if(!err) return order;
                   else return {};
               });
               return res;
            }
         },

         {
            method: 'PUT',
            path: '/orders/{id}/cancel',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = MongoUtils.quoinexOrder.findOneAndUpdate({id : request.params.id},{ $set: { status: 'cancelled' }} ,(err, cancelledOrder) => {
                   if(!err) return cancelledOrder;
                   else return {};
               });
               return res;
            }
         }
      ]);
   }
};

export default quoinexPlugin;

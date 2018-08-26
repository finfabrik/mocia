import "babel-polyfill";
import Mongoose from 'mongoose';
import MongoUtils from './mongoutils';


const bitfinexPlugin = {
   name: 'bitfinexPlugin',
   version: '1.0.0',
   register: async function (server, options) {
      server.route([   
        {
            method: 'GET',
            path: '/v1/symbols',
            handler: (request, h) => {
                request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
                let res = [
                    "btcusd",
                    "ethusd"
                ];
                return res;
            }
         },

         {
            method: 'GET',
            path: '/v1/symbols_details',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = [{
                  "pair":"btcusd",
                  "price_precision":5,
                  "initial_margin":"30.0",
                  "minimum_margin":"15.0",
                  "maximum_order_size":"2000.0",
                  "minimum_order_size":"0.01"
               },
               {
                "pair":"ethusd",
                "price_precision":5,
                "initial_margin":"30.0",
                "minimum_margin":"15.0",
                "maximum_order_size":"2000.0",
                "minimum_order_size":"0.01"
             }];
               return res;
            }
         },

         {
            method: 'POST',
            path: '/v1/account_fees',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = {
                  "withdraw":{
                     "BTC": "0.0005",
                     "ETH": 0
                  }
               };
               return res;
            }
         },

         {
            method: 'POST',
            path: '/v1/account_infos',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = [{
                  "maker_fees":"0.1",
                  "taker_fees":"0.2",
                  "fees":[{
                     "pairs":"BTC",
                     "maker_fees":"0.1",
                     "taker_fees":"0.2"
                  },
                  {
                    "pairs":"ETH",
                    "maker_fees":"0.1",
                    "taker_fees":"0.2"
                 }]
               }];
               return res;
            }
         },

         {
            method: 'POST',
            path: '/v1/order/new',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let id = Math.floor(Date.now()/10);
               let amount = parseFloat(request.payload["amount"]);
               let partialAmount = amount/2;
               let res = {
                  "id": id,
                  "is_live": false,
                  "is_cancelled": false,
                  "original_amount": String(amount),
                  "remaining_amount": String(partialAmount),
                  "executed_amount": String(partialAmount),
                  "side":"buy",
                  "type":"exchange limit",
                  "symbol":"btcusd",
                  "timestamp":"1444272165.252370982",
               };
               let order = new MongoUtils.bitfinexOrder(res);
               order.save((err, order) => {
                   if(err) console.log("Error saving bitfinex order : " + err);
               });
               res["is_live"] = true;
               res["remaining_amount"] = String(amount);
               res["executed_amount"] = "0.0";
               return res;
            }
         },

         {
            method: 'POST',
            path: '/v1/order/status',
            handler: async (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let id = request.payload["order_id"];
               let res = await MongoUtils.bitfinexOrder.findOne({id : id}, (err, order) => {
                   return order;
               });
               let original_amount = new MongoUtils.bitfinexOrder(res).getOriginalAmount();
               await MongoUtils.bitfinexOrder.findOneAndUpdate({id : id},{ $set: { remaining_amount: "0.0", executed_amount: original_amount }} ,(err, order) => {
                   return {};
               });
               return res;
            }
         },

         {
            method: 'POST',
            path: '/v1/order/cancel',
            handler: async (request, h) => {
                request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
                let id = request.payload["order_id"];
                let res = await MongoUtils.bitfinexOrder.findOneAndUpdate({id : id},{ $set: { is_live: false, is_cancelled: true }} ,(err, cancelledOrder) => {
                    if(!err) return cancelledOrder;
                    else return {};
                });
                return res;
            }
         }
      ]);
   }
};

export default bitfinexPlugin;

import "babel-polyfill";
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
                        "id": 1,
                        "currency": "USD",
                        "currency_pair_code": "BTCUSD",
                        "quoted_currency": "USD",
                        "base_currency": "BTC"
                    },
                    {
                        "id": 2,
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
            handler: async (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let id = Math.floor(Date.now()/10);
               let res = {
                    "id": id,
                    "order_type": request.payload['order']['order_type'],
                    "side": request.payload['order']['side'],
                    "status": "partially_filled",
                    "updated": "false",
                    "quantity": request.payload['order']['quantity'],
                    "filled_quantity": String(parseFloat(request.payload['order']['quantity']) * Math.random()),
                    "disc_quantity": "0.0",
                    "iceberg_total_quantity": "0.0",
                    "price": "500.0",
                    "created_at": 1462123639,
                    "updated_at": 1462123639,
                    "leverage_level": 1,
                    "source_exchange": "QUOINE",
                    "product_id": request.payload['order']['product_id'],
                    "product_code": "CASH",
                    "funding_currency": "USD",
                    "currency_pair_code": "BTCUSD",
                    "order_fee": "0.0",
                    "margin_used": "0.0",
                    "margin_interest": "0.0"
                };

                let order = new MongoUtils.quoinexOrder(res);

                try {
                    await order.save().catch((err) => { throw err;});

                    res.status = 'live';
                } catch (err) {
                    res.status = 'rejected';
                }

                res["filled_quantity"] = "0.0";

                return res;
            }
         },

         {
            method: 'GET',
            path: '/orders',
            handler: async (request, h) => {
                request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
                let orderList = await MongoUtils.quoinexOrder.find({ status : {$nin :["cancelled", "rejected"]}, updated : false},(err, orders) => {
                    if(!err) return orders;
                    else return {};
                });
                MongoUtils.quoinexOrder.updateMany({status : "filled", updated : false}, { $set: { updated: true }} ,() => {
                    return null;
                });

                let res = {
                    "models" : orderList,
                    "current_page": 1,
                    "total_pages": 1
                };

                console.log(orderList);
                return res;
            }
         },

         {
            method: 'GET',
            path: '/orders/{id}',
            handler: async (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = await MongoUtils.quoinexOrder.findOne({id : request.params.id}, (err, order) => {
                   return order;
               });

               let original_amount = new MongoUtils.quoinexOrder(res).quantity;
               
               MongoUtils.quoinexOrder.findOneAndUpdate({id : request.params.id},{ $set: { status: "filled", filled_quantity: original_amount }} ,(err, cancelledOrder) => {
                if(!err) return cancelledOrder;
                else return {};
            });

               return res;
            }
         },

         {
            method: 'PUT',
            path: '/orders/{id}/cancel',
            handler: async (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = await MongoUtils.quoinexOrder.findOneAndUpdate({id : request.params.id},{ $set: { status: 'cancelled' }} ,(err, cancelledOrder) => {
                   if(!err) {
                       return cancelledOrder;
                   }
                   else {
                       console.log("ERROR. Returning empty object.")
                       return {};
                   }
               });
              
                return res;
            }
         },

         {
            method: 'GET',
            path: '/fiat_accounts',
            handler: async (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = [
                {
                  "id": 22,
                  "currency": "USD",
                  "balance": "3000.50"
                }
              ];
               return res;
            }
        },

        {
            method: 'GET',
            path: '/accounts/balance',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = [
                   {
                       "currency" : "BTC",
                       "balance" : "20.85"
                   },{
                       "currency" : "ETH",
                       "balance" : "60.95"
                   },{
                       "currency" : "USD",
                        "balance" : "3000.50"
                    }
               ];
               return res;
            }
         },

         {
             method: 'GET',
             path: '/crypto_accounts',
             handler: (request, h) => {
                request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
                let res = [
                    {
                        "id": 11,
                        "balance": "20.85",
                        "currency": "BTC"
                    },
                    {
                        "id": 21,
                        "balance": "60.95",
                        "currency": "ETH"
                    }
                ];
                return res;
             }
         }
      ]);
   }
};

export default quoinexPlugin;



import "babel-polyfill";

//======> Data Population work around Helpers
const dbName = "response_test";
var data = require('./../test_data/data.json');
var collections = ['test_1', 'test_2', 'test_3', 'test_4' ,'test_5' ,'test_6'];
function customInsertMany(db){
    collections.forEach(element => {
        db.collection(element).insert(data[element], {ordered: false});
    });
}
function customDropMany(db){
    collections.forEach(element => {
        db.dropCollection(element);
    });
}
//<======= Data Population work around helpers


const bitfinexPlugin = {
   name: 'bitfinexPlugin',
   version: '1.0.0',
   register: async function (server, options) {
      server.route([   

        //==========> Additional routes to handle data population
        {
            method: 'GET',
            path: '/v1/addData',
            handler: (request, h) => {
                request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
                let db = options['dbClient'].db(dbName);
                customInsertMany(db);
                let res = "success";
                return res;
            }
        },
        {
            method: 'GET',
            path: '/v1/removeData',
            handler: (request, h) => {
                request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
                let db = options['dbClient'].db(dbName);
                customDropMany(db);
                let res = "success";
                return res;
            }
        },
        //<========== Additional routes to help data population
        
        {
            method: 'GET',
            path: '/v1/symbols',
            handler: (request, h) => {
                request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
                let db = options['dbClient'].db(dbName);
                let id = request["headers"]["test_id"];
                let res = db.collection('test_' + id).find().toArray();
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
                  "minimum_order_size":"0.01",
                  "expiration":"NA"
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
                     "LTC": 0,
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
               let res = {
                  "id":448411154,
                  "symbol":"btcusd",
                  "exchange":"bitfinex",
                  "price":"0.01",
                  "avg_execution_price":"0.0",
                  "side":"buy",
                  "type":"exchange limit",
                  "timestamp":"1444272165.252370982",
                  "is_live":true,
                  "is_cancelled":false,
                  "is_hidden":false,
                  "was_forced":false,
                  "original_amount":"0.01",
                  "remaining_amount":"0.01",
                  "executed_amount":"0.0",
                  "order_id":448364250
               };
               return res;
            }
         },

         {
            method: 'POST',
            path: '/v1/order/status',
            handler: (request, h) => {
               request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));
               let res = {
                  "id":448411154,
                  "symbol":"btcusd",
                  "exchange":null,
                  "price":"1",
                  "avg_execution_price":"1",
                  "side":"buy",
                  "type":"exchange limit",
                  "timestamp":"1444276570.0",
                  "is_live":false,
                  "is_cancelled":true,
                  "is_hidden":false,
                  "oco_order":null,
                  "was_forced":false,
                  "original_amount":"0.01",
                  "remaining_amount":"0.0",
                  "executed_amount":"0.01"
               };
               return res;
            }
         }
      ]);
   }
};

export default bitfinexPlugin;

import "babel-polyfill";
import MongoUtils from './mongoutils';

const bitstampPlugin = {
    name: 'bitstampPlugin',
    version: '1.0.0',
    register: async function (server, options) {
        server.route([
            {
                method: 'POST',
                path: '/bitstamp/api/order_status/',
                handler:  async (request, h) => {
                    request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));

                    var requested_order_id = request.headers ? request.headers.id : undefined;

                    if (!requested_order_id) {
                        return {
                            error: ["Invalid order id"]
                        }
                    }

                    let response = await MongoUtils.bitstampOrders.findOne({id: requested_order_id}, (err, order) => {
                        if(!err) return order;
                        else return {
                            error: ["Order not found."]
                        };
                    });

                    return response;
                }
            },
            {
                method: 'POST',
                path: '/bitstamp/api/v2/balance/',
                handler:  async (request, h) => {
                    request.logger.info('Endpoint => %s: %s', request.path, JSON.stringify(request.payload));

                    let response = {
                        usd_balance: 5000.50,
                        btc_balance: 15.3,
                        btcusd_fee: 10,
                        fee: 15
                    };

                    return response;
                }
            }
        ]);
    }
};

export default bitstampPlugin;
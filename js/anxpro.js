import "babel-polyfill";
const anxPlugin = {
   name: 'anxPlugin',
   version: '1.0.0',
   register: async function (server, options) {
      server.route(
         {
            method: 'POST',
            path: '/api/2/money/info',
            handler: (request, h) => {
               request.logger.info('Endpoint %s', request.path);
               let res = {
                  "result": "success",
                  "data": {}
               };
               return res;
            }
         }
      );
   }
};

export default anxPlugin;

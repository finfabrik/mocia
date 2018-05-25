const routes = [
   {
      method: 'GET',
      path: '/{id}',
      handler: (request, h) => {
         return `Hello, ${encodeURIComponent(request.params.name)}!`;
      }
   },
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
];

export default routes;

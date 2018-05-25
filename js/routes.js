const routes = [
   {
      method: 'GET',
      path: '/{name}',
      handler: (request, h) => {
         return `Hello, ${encodeURIComponent(request.params.name)}!`;
      }
   }
];

export default routes;

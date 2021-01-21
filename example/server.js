const fastify = require('fastify')();
const { join } = require('path');
const plugin = require('../plugin');

fastify
  .register(plugin, { config: join(__dirname, 'snowpack.config.js') })
  .register(require('fastify-static'), {
    root: join(__dirname, 'public'),
    prefix: '/',
  })
  .get('/', (request, reply) => {
    return reply.sendFile('index.html');
  });

fastify.listen(3000);

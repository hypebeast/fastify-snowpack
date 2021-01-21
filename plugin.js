'use strict';

const fp = require('fastify-plugin');
const { join } = require('path');
const { createConfiguration, loadConfiguration, startServer } = require('snowpack');

function matchPath(mount, url) {
  for (const key in mount) {
    if (Object.prototype.hasOwnProperty.call(mount, key)) {
      const element = mount[key];
      if (url.startsWith(element.url)) return true;
    }
  }

  return false;
}

function onRequest(server, mount) {
  return async (req, reply) => {
    if (!matchPath(mount, req.url)) {
      return;
    }

    const result = await server.loadUrl(req.url, { isSSR: true });

    reply.header('Content-Type', result.contentType);
    reply.send(result.contents);
  };
}

async function fastifySnowpack(fastify, opts) {
  if (fastify.hasDecorator('snowpack')) {
    throw new Error('[fastify-snowpack]: fastify.snowpack has registered already.');
  }

  let { config } = opts;

  if (typeof config !== 'object' && !Array.isArray(config)) {
    const path = config || join(__dirname, 'snowpack.config.js');
    config = await loadConfiguration({}, path);
  } else {
    config = createConfiguration(config);
  }

  const server = await startServer({ config });

  fastify
    .decorate('snowpack', { server })
    .addHook('onRequest', onRequest(server, config.mount))
    .addHook('onClose', (fastify, next) => {
      server.shutdown();
      next();
    });
}

module.exports = fp(fastifySnowpack, {
  fastify: '>=3.x',
  name: 'fastify-snowpack',
});

# fastify-snowpack

`fastify-snowpack` is a `fastify` plugin that add supports for using [snowpack](https://www.snowpack.dev/) as a frontend build tool for server side rendered pages (e.g. with [point-of-view](https://github.com/fastify/point-of-view)).

It starts [Snowpack's dev server](https://www.snowpack.dev/concepts/dev-server) and processes all assets defined in your [snowpack.config.js](https://www.snowpack.dev/reference/configuration).

Supports Fastify versions `3.x`.

> :warning: This project is meant to be used in development environment only.

## Install

```terminal
npm i fastify-snowpack
```

## Usage

Require `fastify-snowpack` and register it as a plugin, it will add a `onRequest` hook.

```javascript
const fastify = require('fastify')();

fastify
  .register(require('fastify-snowpack'), {
    // put your config here
  })
  .register(require('fastify-static'), {
    root: join(__dirname, 'public'),
    prefix: '/',
  })
  .get('/', (request, reply) => {
    return reply.sendFile('index.html');
  });

fastify.listen(3000);
```

See [./example/server.js](./example/server.js) for a full example how to use this plugin.

### Options

- `config`: This option configures the Snowpack dev server. The value of config could be of different types:
  - `String` - set `config` to the path of a valid Snowpack configuration file.
  - `Object` - pass directly a valid Snowpack configuration.

## License

See [License](./LICENSE).

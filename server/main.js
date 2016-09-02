import Hapi from 'hapi'
import Inert from 'inert'
import Vision from 'vision'
import swagger from 'hapi-swagger'
import { resolve } from 'path'
import _debug from 'debug'

import config from '../config'
import hapiWebpack from './webpack/hapiWebpack'
import api from './api'

const startServer = (port, callback) => {
  const debug = _debug('app:server')
  const paths = config.utils_paths
  const server = new Hapi.Server()
  server.connection({ port });

  server.register([
    { register: Inert },
    { register: Vision },
    {
      register: hapiWebpack,
      options: {
        env: config.env,
      },
    },
    {
      register: api,
      routes: {
        prefix: config.api.routes.path,
      },
    },
    {
      register: swagger,
      options: {
        documentationPath: config.api.swagger.documentationPath,
      },
    },
  ], (err) => {
    if (err) {
      throw err
    }
  })

  if (config.env === 'development') {
    // Serve static assets from ~/src/static since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: paths.client('static'),
        },
      },
    })
  } else {
    debug(
      'Server is being run outside of live development mode, meaning it will ' +
      'only serve the compiled application bundle in ~/dist. Generally you ' +
      'do not need an application server for this and can instead use a web ' +
      'server such as nginx to serve your static files. See the "deployment" ' +
      'section in the README for more information on deployment strategies.'
    )

    // Serving ~/dist by default. Ideally these files should be served by
    // the web server and not the app server, but this helps to demo the
    // server in production.
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: serve(paths.dist()),
        },
      },
    })
  }

  server.route({
    method: 'GET',
    path: '/counter',
    handler: function (request, reply) {
      reply.file(resolve(__dirname, '..', 'dist', 'index.html'))
    },
  });

  return server.start(() => callback(server))
}

export default startServer

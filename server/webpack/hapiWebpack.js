import Webpack from 'webpack'
import _webpackDevMiddleware from 'webpack-dev-middleware'
import _webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../../build/webpack.config'
import _debug from 'debug'
import config from '../../config'

const paths = config.utils_paths
const debug = _debug('app:server:webpack-dev')

const register = (server, options, next) => {
  if (options.env === 'development') {
    debug('Enable webpack dev middleware.')

    const compiler = new Webpack(webpackConfig)
    const { publicPath } = webpackConfig.output

    const webpackDevMiddleware = _webpackDevMiddleware(compiler, {
      publicPath,
      contentBase: paths.client(),
      hot: true,
      quiet: config.compiler_quiet,
      noInfo: config.compiler_quiet,
      lazy: false,
      stats: config.compiler_stats,
    })

    const webpackHotMiddleware = _webpackHotMiddleware(compiler, {
      timeout: '20000',
      reload: true,
    })

    server.ext('onRequest', (request, reply) => {
      const { req, res } = request.raw
      webpackDevMiddleware(req, res, error => {
        if (error) {
          return reply(error)
        }

        reply.continue()
      })
    })

    server.ext('onRequest', (request, reply) => {
      const { req, res } = request.raw
      webpackHotMiddleware(req, res, error => {
        if (error) {
          return reply(error)
        }

        reply.continue()
      })
    })

    server.expose({ compiler })
  }

  return next()
}

register.attributes = {
  name: 'hapiWebpack',
  version: '0.0.1',
}

export default register

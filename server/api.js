import routes from './controllers'
import config from '../config'

const register = ( server, options, next ) => {
  for (const key in routes) {
    if (routes.hasOwnProperty(key)) {
      server.route(routes[key])
    }
  }

  next()
}

register.attributes = {
  name: config.api.name,
  version: config.api.version,
}

export default register

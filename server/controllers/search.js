import Joi from 'joi'
import { fetchSkyskannerHotels } from './functions/search'

/*
 * Hapi Routes for controlling search
 * - Fetch hotels from skyskanner
 */
const searchController = [
  /*
   * Search hotels
   */
  {
    method: 'POST',
    path: '/search',
    config: {
      tags: [ 'api', 'search' ],
      description: 'Search hotels',
      validate: {
        payload: {
          description: Joi.string().min(4).max(24).required(),
          ciDate: Joi.string().min(4).max(24).required(),
          coDate: Joi.string().min(4).max(24).required(),
          adults: Joi.number().integer().required(),
          rooms: Joi.number().integer().required(),
        },
      },
    },
    handler: ( request, reply ) => {
      fetchSkyskannerHotels(request, result => {
        if (result !== null) {
          reply({
            statusCode: 200,
            message: 'Hotels fetched successfully',
            data: result,
          }).code(200)
        } else {
          reply({
            statusCode: 500,
            message: 'Something bad happened.',
            error: 'err',
          }).code(500)
        }
      })
    },
  },
];

export { searchController as default }

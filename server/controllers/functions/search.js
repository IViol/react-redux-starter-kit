import Promise from 'bluebird'

export function fetchSkyskannerHotels(request, callback) {
  console.log(request.payload)

  const {
    description,
    ciDate,
    coDate,
    adults,
    rooms,
  } = request.payload

  return callback({ foo: 'bar' })
}

class ApiError extends Error {
  static status: number // eslint-disable-line
  static defaultMessage: string // eslint-disable-line
}
class Api400 extends ApiError {}
Api400.status = 400
Api400.defaultMessage = 'Invalid request'
class Api401 extends ApiError {}
Api401.status = 401
Api401.defaultMessage = 'Unauthorized'
class Api404 extends ApiError {}
Api404.status = 404
Api404.defaultMessage = 'Not found'
class Api409 extends ApiError {}
Api409.status = 409
Api409.defaultMessage = 'Conflict'
class Api500 extends ApiError {}
Api500.status = 500
Api500.defaultMessage = 'Internal error.  File a bug to us, please!'
class Api501 extends ApiError {}
Api501.status = 501
Api501.defaultMessage = 'Not implemented'
class Api503 extends ApiError {}
Api503.status = 503
Api503.defaultMessage = 'Service unavailable'

export { ApiError, Api400, Api401, Api404, Api409, Api500, Api501, Api503 }

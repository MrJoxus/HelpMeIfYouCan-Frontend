const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()
const API_ENDPOINT = 'auth/signup'

export default function(req, res, next) {
  proxy.web(req, res, {
    target: `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/${API_ENDPOINT}`,
    ignorePath: true
  })
}

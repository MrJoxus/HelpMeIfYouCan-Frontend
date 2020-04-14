const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()
const API_ENDPOINT = 'user/me?lazy=false'

// für CRUD

export default function(req, res, next) {
  proxy.web(req, res, {
    target: `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/${API_ENDPOINT}`,
    ignorePath: true
  })
}

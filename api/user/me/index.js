const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()
const API_ENDPOINT = 'user/me'
const API_QUERY= '?lazy=false'

export default function(req, res, next) {

  proxy.web(req, res, {
    target: `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/${API_ENDPOINT}${req.url}${API_QUERY}`,
    ignorePath: true
  })
}

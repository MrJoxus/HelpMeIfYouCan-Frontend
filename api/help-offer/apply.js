const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()

export default function(req, res, next) {
  let API_ENDPOINT = `offers${req.url}/apply`

  proxy.web(req, res, {
    target: `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/${API_ENDPOINT}`,
    ignorePath: true
  })
}

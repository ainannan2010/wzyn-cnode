const axios = require('axios')
const baseUrl = 'https://cnodejs.org/api/v1';
const querystring = require("query-string")
// 代理接口, 就是前端请求后端，后端请求其他网站的接口，然后把返回的结果，返回给前端
module.exports = function (req, res, next) {
  const path = req.path
  const user = req.session.user || {}
  const needAccessToken = req.query.needAccessToken
  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query, {
    accessToken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })
  if (query.needAccessToken) delete query.needAccessToken
  const data = querystring.stringify(Object.assign({}, req.body, {
    accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
  }))
  axios(`${baseUrl}${path}`, {
    // cnode 有个问题需要加headers,axios发送的Content-Type是application, 而cnode有些api是application/x-www-form-urlencode，为了不出问题，不发送json的格式请求，使用form-data的格式发送请求 统一设置成application/x-www-form-urlencode
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'  // 解析前面的data参数 '{accesstoken: user.accessToken}' =>>> 'accesstoken=user.accessToken'
    },
    method: req.method,
    params: query,
    data,
  })
    .then(resp => {
      if (resp.status === 200) {
        res.send(resp.data)
      } else {
        res.status(resp.status).send(resp.data)
      }
    })
    .catch(err => {
      if (err.response) {
        res.status(500).send(err.response.data)
      } else {
        res.status(500).send({
          success: false,
          msg: '未知错误'
        })
      }
    })
}

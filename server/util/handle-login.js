const router = require('express').Router();
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1';
// 大致的思路是这样的， 当前端请求/login接口时， 后端去请求cnodejs的接口，然后把请求的结果储存在了req.session.user， 同时也给前端返回了请求到的数据
router.post('/login', function (req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken,
  })
    .then((resp) => {
      if (resp.status === 200, resp.data.success) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url
        }
        res.json({
          success: true,
          data: resp.data
        })
      }
    })
    .catch(err => {
      if (err.response) {
        res.json({
          success: false,
          data: err.response.data
        })
      } else {
        next(err)
      }
    })
})

module.exports = router

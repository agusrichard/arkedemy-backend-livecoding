const Auth = require('express').Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()

Auth.post('/login', (req, res) => {
  const { username, password } = req.body

  if (username && password) {
    if ((username === 'admin') && (password === 'admin')) {
      const data = { email: 'admin@server.com' }
      const token = jwt.sign(data, process.env.APP_KEY, {expiresIn: '15m'})
      res.send({
        sucess: true,
        msg: 'Login Success',
        data: {
          token
        }
      })
    }
  }

  res.send({
    success: false,
    msg: 'Wrong username or password'
  })
})

module.exports = { Auth }
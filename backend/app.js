const express = require('express')
const userRouter = require('./routes/user.js')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const port = 8000
app.use(express.json())
const mongoUrl = process.env.MONGO_URI
mongoose.connect(mongoUrl, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('connected to mongoose')
})

app.use('/api/user', userRouter)

// middleware example
app.post(
  '/sign-in',
  (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return res.json({ error: 'email/password missing!' })
    next()
  },
  (req, res) => {
    res.send('<h1>Hello I am about page</h1>')
  },
)

app.listen(port, () => console.log(`Movie Reviewer is listening on port ${port}!`))



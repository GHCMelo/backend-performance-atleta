const express = require("express")
const cors = require("cors")

// require('./database')

const app = express()

const routes = require('./routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.json({ type: "application/json" }))
app.use(cors())
app.use(routes)

module.exports  = app
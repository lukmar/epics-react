var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var epics = require('epics')

// TODO: create the following array from file
var pvList = ['TEST:AI', 'TEST:BINARY', 'TEST:BLINK', 'TEST:CALC', 'TEST:PROGRESS']

io.on('connection', function (socket) {
  console.log('Client connected')
})

pvSocket = {}

// register listeners for each pv
pvList.forEach(function (pvInstance) {
  pvSocket[pvInstance] = new epics.Channel(pvInstance)
  console.log('Connected to ' + pvInstance)
  pvSocket[pvInstance].on('value', function (data) {
    io.emit('update pv', {'pv': pvInstance, 'val': data})
  })
  pvSocket[pvInstance].connect(function () {
    pvSocket[pvInstance].monitor()
  })
})

io.on('client update', function (aa) {
  console.log(aa)
})

app.use(express.static(__dirname + '/build'))

app.get('/', function (req, res) {
  res.render('index.html')
})

server.listen(8081, function () {
  console.log('listening on 8081')
})

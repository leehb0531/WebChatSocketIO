let express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  path = require('path');
  local = 3000;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
  res.render('chat');
});

let count = 1;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  let name = 'unknown' + count++;
  socket.name = name;

  io.to(socket.id).emit('create name', name);

  socket.on('disconnect', function(){
    console.log('user disconnected: ' + socket.id + ' ' + socket.name);
  });

  socket.on('send message', function(name, text){
    let msg = name + ' : ' + text;
    socket.name = name;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen(local, function(){
  console.log('server on...'+ 'localhost:' +local);
});
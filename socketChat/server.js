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
let people = [];
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  let name = 'unknown' + count++;
  socket.name = name;

  io.to(socket.id).emit('create name', name);
  people.push(name);
  io.emit('new_connect',name);
  io.emit('list name',name, people);

  socket.on('disconnect', function(){
    people.splice(people.indexOf(name),1);
    console.log('user disconnected: ' + socket.id + ' ' + socket.name);
    io.emit('new_disconnect', socket.name);
    io.emit('list name',name, people);
  });

  socket.on('send message', function(name, text){
    let msg = name + ' : ' + text;
    if(name != socket.name)
      io.emit('change name', socket.name, name);
    socket.name = name;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen(local, function(){
  console.log('server on...'+ 'localhost:' +local);
});
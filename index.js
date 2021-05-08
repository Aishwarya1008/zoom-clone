const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(app, {
    debug: true
});
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST"]
    }
  });
httpServer.listen(5000);

app.use(express.urlencoded());

app.use(cors());

app.use(express.static('./assests'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/peerjs', peerServer);

app.use('/', require('./routes/index'));

io.on('connection', (socket) => {
    console.log('connection established!', socket.id);

    socket.on('join_room', (data) => {
        console.log('Joined Room', data.roomId);
        socket.join(data.roomId);
        socket.to(data.roomId).emit('User_Joined', data.userId);
        socket.on('message', (d) => {
            console.log(d.msg);
            io.in(data.roomId).emit('send_message', {
                msg: d.msg
            });
        });
    });


});

app.listen(port, function(err){
    if(err){
        console.log('Error in Listening', err);
        return;
    }
    console.log('Server running Successfully');
})
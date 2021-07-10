//require= same as 'include' keyword, takes the name of the package as a string and returns as a package
const express = require('express');  

const app = express();

//explicitly create the http server
const server = require('http').Server(app);

// Socket.IO enables real-time, bidirectional and event-based communication
const io = require('socket.io')(server);

const {v4:uuidV4} = require('uuid');

//importing peerJS
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

const users = {};

const bodyParser = require("body-parser");



//set ejs as templating engine, ejs by default looks into the 'view' folder for templates
//Instead of responding with text when someone visits our root route, we’d like to respond with an HTML file. For this, we’ll be using EJS (Embedded JavaScript). EJS is a templating language
app.set('view engine', 'ejs');

//following code helps to serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static('public'));

//use the peerJS for peer-to-peer connection
app.use('/peerjs', peerServer);

app.use(bodyParser.urlencoded({extended:true}));





// '.get' is a method to fetch data from server which is '/' in this case, and then execute the function with parameters response and request.
// response is for response of the server, request is the request that user makes to the server
app.get('/', (req, res)=>{
    // in response to the req, the user is redirected to the room with that unique uuid generated.
    res.render('index')
})

app.get('/meeting', (req,res) => {
    res.redirect(`/meeting/${uuidV4()}`);
})

app.post('/meeting', (req, res) => {
    var rId = req.body.MeetId;
    res.redirect(`/meeting/${rId}`);
})

//:room is a parameter
app.get('/meeting/:room', (req, res) => {
    // now the room.ejs page will be displayed on requested localhost, params stands for parameter, a built-in feature, 
    //in roomId we will be storing the roomId of the user and will be passed to the frontend
    res.render('room', { roomId: req.params.room});
})






//on connecting with the url, you will need to "join" a room, server will handle assigning a socket to a room, the room name will be decied by the client side
//catches the emitted event from the client
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId, username) => {

        if (users[roomId]) users[roomId].push({ id: userId, name: username, video: true, audio: true }); //one user is already present in the room
        else users[roomId] = [{ id: userId, name: username, video: true, audio: true }]; //first user to join

        socket.join(roomId); //joins the specific room
        socket.broadcast.to(roomId).emit('user-connected', userId, username); //its going to broadcast in the room that a user has joined
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message, userId, username )
        })

        io.in(roomId).emit("participants", users[roomId]);

        //for disconnecting
        socket.on("disconnect", () => {
            socket.broadcast.to(roomId).emit("user-disconnected", userId, username);
            users[roomId] = users[roomId].filter((user) => user.id !== userId);
            if (users[roomId].length === 0) delete users[roomId];
            //this will ensure that the participant's list is updated
            else io.in(roomId).emit("participants", users[roomId]);
        });
    })
})



//starts the server, mention the port number as the parameter
server.listen(process.env.PORT || 3030);
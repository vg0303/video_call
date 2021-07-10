# plan of action

1) initialise our node.js project
2) initialise our first view(what you will see in the front-end)
3) create a room
4) add the ability to view our own video
5) add ability to allow other to stream their videos
6) add styling
7) add chat
8) add mute button
9) add stop video button
10) add participants list
11) add invite button which will give a prompt when clicked
12) work on screen adjustment when the chat/participants button gets clicked
13) add a leave button
14) add a dark/light theme button
15) add a landing page


# flow: 

1) initialse a npm file "npm init"
2) install express "npm install express"
3) install nodemon to auto run the server "npm install -g nodemon"
4) use ctrl + c to exit the server
5) run nodemon for server.js "nodemon server.js"
6) install ejs for the ejs files "npm install ejs"
7) install uuid for generating unique ids "npm install uuid"
8) install socket.io for real time communication "npm install socket.io"
9) install peerJS for peer-to-peer connection 


# SOME POINTS:

- video streaming is peer-to-peer
- Node.js for backend 
- we will use express for our server
- expressJS is a web framework, it is a module of node.js
- ejs is EMBEDED JAVASCRIPT, we can pass the variables from backend to the frontend, acts as a mediator
- we are using uuid to generate random ids so that each room has a unique id through which that room can be joined
- socket.io is for real time communication, its a library, and we were able to see our video using this
- will be using peerJS which is a library to establish peer-to-peer connection which itself uses webRTC to connect 
- webRTC is used to allow web browsers to connect to each other in real time
- socket.io helps in establishing a link between the server and the clients and exchnage feed and messages etc.


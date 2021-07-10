//client side

const socket= io('/');

const videogrid = document.getElementById('video-grid');
const myvideo = document.createElement('video'); 
myvideo.muted = true; //mute your own video to avoid echo
let myvideostream;
var myID= "";
var peers = {};
var activeScreen = "";

// setting up a peer which will be hosted on whatever host is there, on port 3030 for now
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});




// this helps to get the video and audio from the chrome, getUserMedia is a promise i.e its an event in the future, it would be resolved or rejected
// after we have given access, "then" do ...
// we need to get the video stream aka "user media", and then add that stream to a video element.
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true 
}).then( stream => {
    myvideostream = stream;
    addvideostream( myvideo, stream);
    console.log('added my video stream')

    peer.on('call', call => {
        // the other user calls and wants to join the specific room
        call.answer(stream);
        console.log('user2: I am calling; user1: I am answering your call');
        const video = document.createElement('video');
        // add his/her video stream in a video ele
        call.on('stream', uservideostream => {
            addvideostream(video, uservideostream);
            console.log(' user1 video added on the user2 page');
        })
    })

    //once the user has joined at the server level, call the function "connecttonewuser()"
    socket.on('user-connected', (userId, username) => {
        console.log('user connecting');
        setTimeout(() => {
            // user joined; "stream" is coming from the promise
            connecttonewuser(userId, stream);
            systemMessage(username, true);
          }, 1000)
    })

    socket.on("user-disconnected", (userId, username) => {
        console.log("New User Disconnected");
        if (peers[userId]) peers[userId].close();   //close() defined at line 128.
        systemMessage(username);
    });

})




//this gives a specific id "id" for the person connecting on opening 
peer.on('open', id => {
    console.log('self id: '+id);
    //sends the event of joining room to the server
    //we will be joining a specific room with the given ROOM_ID
    socket.emit('join-room', ROOM_ID, id, USERNAME); 
    myID=id;
    console.log('I have joined the room');
})




//using JQuery to get the messaging function active 
let text = $('input');
//we will be listening for the keyboard keys being pressed specifically the 'enter' key with code=13
$('html').keydown((e) => {
    if(e.which == 13 && text.val().length != 0){
        //we are sending the text from the frontend to the server
        socket.emit('message', text.val());
        text.val(''); 
        text.focus();
    }
})
//sending messages by clicking on the send button
const btn = document.getElementById("send-btn");
btn.addEventListener("click", ()=> {
    if(text.val().length != 0){
        socket.emit('message', text.val()); 
        text.val(''); 
        text.focus();
    }
})




//this is to print the message being received by the server in the room
socket.on('createMessage', (message, userId, username) => {
    // on receiving the text from the server, we need to display it on the frontend, using html tags, we will add the text as "list elements" in the "ul"
    if(userId==myID)
        $('.messages').append(`<li class="message message-right"><span class="user right-user"></span>
        <div class="text text_right">${message}</div></li>`);
    else
        $('.messages').append(`<li class="message message-left"><span class="user left-user">${username}</span>
        <div class="text text_left">${message}</div></li>`);

    scrolltobottom();
})




//function in play when someone else connects, a new user.
const connecttonewuser = (userId, stream) => { 
    const call = peer.call(userId, stream);
    //create a video ele that can be used by the other user
    const video = document.createElement('video'); 
    call.on('stream', uservideostream => {
        //on receiving other user's stream, put the 'uservideostream' in the 'video' ele created just above
        addvideostream(video, uservideostream); 
        console.log('added users video');
    })
    call.on("close", () => {
        video.remove();
    });

    peers[userId] = call;
}



//for sending the messages on the chat whether a user joined or left.
const systemMessage = (username, join = false) => {
    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    const format = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const lists = document.querySelector(".messages");
    const list = document.createElement("li");
    list.className = "system-message";
    list.innerHTML = `<span class="center margin-hour">${hours}:${minutes}${format}</span><span class="user center margin-name">${username} has ${
        join ? "joined" : "left"
    } the meeting</span>`;

    lists.append(list);
    scrolltobottom();
};



// function to add videostreams to the video element
const addvideostream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play();
    })
    videogrid.append(video);
}




//func for scrolling
const scrolltobottom = () => {
    let d= $('.main_chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}




//for mute and unmute functionality
const muteUnmute = () => {
    const enabled = myvideostream.getAudioTracks()[0].enabled;
    if (enabled) {
      myvideostream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myvideostream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}
  
const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}




//for disabling the video
const playStop = () => {
    let enabled = myvideostream.getVideoTracks()[0].enabled;
    if (enabled) {
      myvideostream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myvideostream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}
  
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}




//for the participants list
socket.on("participants", (users) => {
    const lists = document.getElementById("users");
    lists.innerHTML = "";
    lists.textContent = "";
  
    users.forEach((u) => {
        const list = document.createElement("li");
        list.className = "user-participant";
        list.innerHTML = `
            <div class="user_avatar">${u.name[0].toUpperCase()}</div>
            <span class="user_name">${u.name}${u.id == myID ? " (You)" : ""}</span>
        `;
        lists.append(list);
    });
});




// for handling the views of the right and left screen
const isHidden = (screen) => screen.classList.contains("screen-hide");

const handleScreen = (screen) => {
    const left_container = document.querySelector(".main_left");
    const right_container = document.querySelector(".main_right");
    const chatScreen = document.getElementById("chat-screen");
    const usersScreen = document.getElementById("users-screen");
  
    if (screen.id === "chats") {
        if (activeScreen === "") {
            chatScreen.classList.remove("screen-hide");
            activeScreen = "chats";
        } else if (activeScreen === "chats") {
            chatScreen.classList.add("screen-hide");
            activeScreen = "";
        } else {
            chatScreen.classList.remove("screen-hide");
            usersScreen.classList.add("screen-hide");
            activeScreen = "chats";
        }
    } else {
        if (activeScreen === "") {
            usersScreen.classList.remove("screen-hide");
            activeScreen = "users";
        } else if (activeScreen === "users") {
            usersScreen.classList.add("screen-hide");
            activeScreen = "";
        } else {
            usersScreen.classList.remove("screen-hide");
            chatScreen.classList.add("screen-hide");
            activeScreen = "users";
        }
    }
  
    if (isHidden(right_container)) {
        right_container.classList.remove("screen-hide");
        left_container.classList.remove("screen-full");
    } else if (activeScreen === "") {
        right_container.classList.add("screen-hide");
        left_container.classList.add("screen-full");
    }
};
  



//for the alert to be displayed while clicking on invite
const handleInvite = () => {
    prompt("Invite people to your room:\nCopy this link to join:", window.location.href);
};




//end call
document.getElementById("end-button").addEventListener("click", endCall);

function endCall() {
  window.location.href = "/";
}
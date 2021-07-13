# myTeam
One-stop solution for video-calling and chatting.

# Description
myTeam's home page has 2 main sections: MEETING and CHAT. 

The **Meeting** section has 2 options, either to "start" a meeting or to "join" a meeting. To join a meeting, the unique meeting ID is required. Once you select an option, you will be greeted with a prompt asking you to input your name. I used **nodeJS** and **expressJS** for the server, **Socket.io** for communicating between the client and the user and **peerJS** for establishing a peer-to-peer communication. For generating unique room ID I used **uuid** Styling was added through **CSS** and the skeleton of the page was built using **EJS**.

The **Chat** section has a button to open the chat page. Upon clicking the button user will be taken to another page and will need to sign-in using Google account. 
I used **React**, **Firebase** and **Chat Engine** for building the chat. Through Firebase adding social authentiction is easy and it also keeps track of all the users. Chat Engine proved to be an easy way to use APIs to build a chat-website quickly.

# Features
1) **Home Page**
<pre>
    i) has an option to change the language to one of the 90 options available
    ii) has 2 main sections:
          (a) Meeting
          (b) Chat
    iii) upon clicking on the section in navbar, the user is taken to that section
</pre>
2) **Video Call Page**
<pre>
    i) theme button
    ii) mute button, video on/off button
    iii) Participants list
          a) gets updated when a user leaves
          b) upon clicking the button again, the list hides
    iv) invite button
          a) gives a prompt, asking to copy the meeting id
    v) chat button for in-call chat
          a) message sent by me appears on the right and the rest on left
          b) the username appears on top of the message
          c) background colour is different for left and right messages
          d) when a user joins or leaves the room, a system-message is sent in the chat-box stating the username and time and activity.
          e) upon clicking on chat button again, the chat-window hides
    vi) end button
          a) on clikcing end button, the user is redirected to the home page
          b) for everyone else in the room, the video-grid of the user disappears and the participant list is updated and a system message is sent in chat.
</pre>
3) **Chat Page**
<pre>
    i) Login through Google and logout
    ii) form and delete rooms
    iii) share text and pictures in the room
    iv) view the members of the room
    v) upon receiving a message the user will be notified
    vi) the active/inactive state of the user is also visible
    vii) while the user types, the other people in the room can see that the user is typing
</pre>

# Local set-up
<pre>
  npm install
</pre>
<pre>
  nodemon server.js
</pre>



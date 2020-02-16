function joinNs(endpoint) {
    if (nsSocket) {
        // nsSocket is assign with some value then close 
        nsSocket.close();
        //remove event listener as soon as user swith namespace
        document.querySelector('#user-input').removeEventListener('submit', formSubmission);
    }
    nsSocket = io(`http://localhost:9000${endpoint}`);
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";
        nsRooms.forEach((room) => {
            let glyp;
            if (room.priavteRoom) {
                glyp = 'lock';
            } else {
                glyp = 'globe';
            }
            roomList.innerHTML += `<li class = "room"> <span class = "glyphicon glyphicon-${glyp}"> </span>${room.roomTitle}</li>`
        });
        //add click listener
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem) => {
            elem.addEventListener('click', (e) => {
                console.log(`someone has joined the room ${e.target.innerText}`)
                joinRoom(e.target.innerText);
            });
        });

        // add room once user join the namespace
        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        joinRoom(topRoomName);
    });

    nsSocket.on('messageToClients', (msg) => {
        const newMsg = buildHtml(msg);
        document.querySelector('#messages').innerHTML += newMsg
    });

    document.querySelector('.message-form').addEventListener('submit', formSubmission);
}

function formSubmission(event) {
    event.preventDefault();
    const userMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessgaeToServer', { text: userMessage })
}

function buildHtml(msg) {
    const toDate = new Date(msg.time).toLocaleDateString();
    const newHtml = `<li>
    <div class="user-image">
        <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
        <div class="user-name-time">
            ${msg.userName}<span> ${toDate}</span>
        </div>
        <div class="message-text">${msg.text}</div>
    </div>
</li>`
    return newHtml;
}
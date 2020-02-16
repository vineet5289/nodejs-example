function joinRoom(roomName) {
    // send this name to room so that server can join
    nsSocket.emit('joinRoom', roomName, (numberOfUser) => {
        // update room member count
    document.querySelector('.curr-room-num-users').innerHTML = `${numberOfUser} <span class="glyphicon glyphicon-user"></span>`;
    });

    nsSocket.on('historyCatchUp', (history) => {
        const messageUl = document.querySelector('#messages');
        messageUl.innerHTML = "";
        history.forEach((msg) => {
            const newMsg = buildHtml(msg);
            const currMsg = messageUl.innerHTML;
            messageUl.innerHTML = currMsg + newMsg;
        });
        messageUl.scrollTo(0, messageUl.scrollHeight);
    });

    nsSocket.on('updateMembers', (numberOfUser) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numberOfUser} <span class="glyphicon glyphicon-user"></span>`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    });
};
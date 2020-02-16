const socket = io('http://localhost:9000');
    socket.on('messageFromServer', (dataFromServer) => {
        console.log(dataFromServer);
        socket.emit('messageToServer', {data: "Data from the client!"});
    });

    document.querySelector('#message-form').addEventListener('submit', (event) =>{
        event.preventDefault();
        const userMessage = document.querySelector('#user-message').value;
        socket.emit('newMessgaeToServer', {text: userMessage})
        console.log(userMessage);
    });

    socket.on('messageToClient', (msg) => {
        document.querySelector('#message').innerHTML += `<li>${msg.text}</li>`
    });
    // socket.on('ping', () => {
    //     console.log('Ping was received from the server');
    // });

    // socket.on('pong', (latency) => {
    //     console.log(latency);
    //     console.log('Pong was sent to the server');
    // });
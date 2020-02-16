const socket = io('http://localhost:9000'); // default '/' namespace
const socketAdmin = io('http://localhost:9000/admin'); // admin '/admin' namespace

socket.on('messageFromServer', (dataFromServer) => {
    socket.emit('messageToServer', { data: "Data from the client!" });
});

socket.on('joined', (msg) => {
    console.log(msg);
});

socketAdmin.on('welcome', (dataFromServer) => {
    console.log(dataFromServer);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const userMessage = document.querySelector('#user-message').value;
    socket.emit('newMessgaeToServer', { text: userMessage })
});


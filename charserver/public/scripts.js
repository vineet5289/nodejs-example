//const socket = io('http://localhost:9000'); // default '/' namespace
const userName = prompt('Enter your user name');
const socket = io('http://localhost:9000', {
    query: {
        userName: userName
    }
});
let nsSocket = "";

// socket.on('connect', (msg) => {
//     console.log(msg);
// });
//listen for the ns list
socket.on('nsList', (nsData) => {
    console.log('The list of namespace has arrived');
    let namespaceDev = document.querySelector('.namespaces');
    namespaceDev.innerHTML = "";
    nsData.forEach((ns) => {
        namespaceDev.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /> </div>`
    });
    //add click listener
    Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
        elem.addEventListener('click', (e) => {
            //console.log(e.target); // fetch clicked elemet
            const nsEndPoint = elem.getAttribute('ns');
            joinNs(nsEndPoint);
        });
    });
    
    joinNs('/wiki')
});
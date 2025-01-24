const express = require('express'); // serwer http na express
const https = require('https'); // serwer https
const fs = require('fs'); // operacja na plikach
const io = require('socket.io'); // serwer socket.io

const app = express(); // serwer http
const server = https.createServer({ // serwer https
    key: fs.readFileSync('ssl/ssl.key'),
    cert: fs.readFileSync('ssl/ssl.crt')
}, app);
app.use(express.static('public')); // serwer plików statycznych


server.listen(443, () => { 
    console.log("Server started on https://localhost:443");
});

let ss = io(server); // serwer socket.io

let baza  = []; // baza danych

const UD = (userid) =>{
    return baza.filter((el) => el.userid == userid)[0];
}

ss.on('connection', (socket) => 
    { // połączenie z klientem

        let userid = socket.handshake.query.id || socket.headers['user-id'];

            console.log("Client connected");
            baza.push({id:socket.id, userid:userid, name:"", lasttime: (new Date).getTime()});

            socket.on('dolacz', (name) => {
                let ud = UD(userid);
                if(ud.name == ""){
                console.log("Dolaczono " + name);
                UD(userid).name = name;
                }
            });

            socket.on('keepalive', () => {
                console.log("Keepalive from " + userid);
                UD(userid).lasttime = (new Date).getTime();
            });


            socket.on('disconnect', () => {
                console.log("Client disconnected " + userid);
            });

    });
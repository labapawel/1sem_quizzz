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
ss.on('connection', (socket) => 
    { // połączenie z klientem
            console.log("Client connected");

    });
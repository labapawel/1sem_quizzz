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

let pytania = [
    {'pytanie':'Jak utworzyć zmienną w JS', 'odpowiedzi':['dim zmienna = 22;','int zminna = 22;','$zmienna=22;','let zmienna = 22;'], 'poprawna':3},
    {'pytanie':'Jak wyświetlić tekst w konsoli', 'odpowiedzi':['console.log("tekst");','print("tekst");','echo("tekst");','write("tekst");'], 'poprawna':1},
    {'pytanie':'Jak zadeklarować funkcję w JS', 'odpowiedzi':['function nazwa(){}','void nazwa(){}','def nazwa(){}','function nazwa()'], 'poprawna':0},
    {'pytanie':'Jak zadeklarować tablicę w JS', 'odpowiedzi':['tab tablica = [];','array tablica = [];','let tablica = [];','array tablica = []'], 'poprawna':2},
    {'pytanie':'Jak zadeklarować obiekt w JS', 'odpowiedzi':['object obiekt = {};','let obiekt = {};','obj obiekt = {};','object obiekt = []'], 'poprawna':1},
    {'pytanie':'Jak zadeklarować klasę w JS', 'odpowiedzi':['class Nazwa{}','class Nazwa(){}','class Nazwa[]','class Nazwa'], 'poprawna':0},
    {'pytanie':'Jak zadeklarować zmienną globalną w JS', 'odpowiedzi':['global zmienna = 22;','let zmienna = 22;','var zmienna = 22;','const zmienna = 22;'], 'poprawna':2},
    {'pytanie':'Jak zadeklarować zmienną lokalną w JS', 'odpowiedzi':['global zmienna = 22;','let zmienna = 22;','var zmienna = 22;','const zmienna = 22;'], 'poprawna':1},
    {'pytanie':'Jak zadeklarować stałą w JS', 'odpowiedzi':['global zmienna = 22;','let zmienna = 22;','var zmienna = 22;','const zmienna = 22;'], 'poprawna':3},
    {'pytanie':'Jak zadeklarować zmienną w PHP', 'odpowiedzi':['dim zmienna = 22;','int zminna = 22;','$zmienna=22;','let zmienna = 22;'], 'poprawna':2},
    {'pytanie':'Jak wyświetlić tekst w PHP', 'odpowiedzi':['console.log("tekst");','print("tekst");','echo("tekst");','write("tekst");'], 'poprawna':1},
    {'pytanie':'Jak zadeklarować funkcję w PHP', 'odpowiedzi':['function nazwa(){}','void nazwa(){}','def nazwa(){}','function nazwa()'], 'poprawna':0},
    {'pytanie':'Jak zadeklarować tablicę w PHP', 'odpowiedzi':['tab tablica = [];','array tablica = [];','let tablica = [];','array tablica = []'], 'poprawna':1},
    {'pytanie':'Jak zadeklarować obiekt w PHP', 'odpowiedzi':['object obiekt = {};','let obiekt = {};','obj obiekt = {};','object obiekt = []'], 'poprawna':2},
    {'pytanie':'Jak zadeklarować klasę w PHP', 'odpowiedzi':['class Nazwa{}','class Nazwa(){}','class Nazwa[]','class Nazwa'], 'poprawna':0},
    {'pytanie':'Jak zadeklarować zmienną globalną w PHP', 'odpowiedzi':['global zmienna = 22;','let zmienna = 22;','var zmienna = 22;','const zmienna = 22;'], 'poprawna':2},
]

let gamestatus = {
    'started':false,
    'current':0,
    'time':0,
    'maxtime':30,
    'clientcount':0,
    'answer':{pytanie:"", odpowiedzi: [], poprawna:-1},
    'results':[]
};


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

            gamestatus.clientcount = ss.engine.clientsCount;
            ss.emit('status', gamestatus);

            let ud = UD(userid);
            if(!ud)
            {
               baza.push({id:socket.id, userid:userid, name:"", lasttime: (new Date).getTime()});
               ud = UD(userid);
            }
            if(ud.name != ""){
                socket.emit('ud', ud);
            }

            socket.on('dolacz', (name) => {
               // let ud = UD(userid);
                console.log(ud);
                
                if(ud.name == ""){
                console.log("Dolaczono " + name);
                ud.name = name;
                socket.emit('ok', ud);
                }
            });

            socket.on('start', () => {
                gamestatus.started = true;
                gamestatus.current = 0;
                gamestatus.time = new Date().getTime();
                gamestatus.answer = pytania[gamestatus.current];
                gamestatus.results = [];
                ss.emit('status', gamestatus);
            });

            socket.on('keepalive', () => {
                console.log("Keepalive from " + userid);
                socket.emit('status', gamestatus);                
                ud.lasttime = (new Date).getTime();
            });


            socket.on('disconnect', () => {
                console.log("Rozlączenie klienta " + userid);
                gamestatus.clientcount = ss.engine.clientsCount-1;
                ss.emit('status', gamestatus);
            });

    });
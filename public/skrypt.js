console.log(document.cookie);
const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);


if(!document.cookie.includes('userid')){
        let cookie = Math.floor(new Date().getTime()*Math.random()*500);
        document.cookie = `userid=${cookie}`;
} 

let cookies = {};

let cookiestmp = document.cookie.split(';');
cookiestmp.forEach((el) => {
        let [key, value] = el.split('=');
        cookies[key] = decodeURIComponent(value);
});




const sock = io('wss://',{
    query: {
        id:cookies['userid']
    },
    rejectUnauthorized: false,
    timeout: 5000,
    connect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 5,
    connect_timeout: 5000,
});

sock.on('connect', () => {
    console.log(`Jesteś połączony z hostem, moje id: ${sock.id}`);

    
});

$('.status button').addEventListener('click', (e)=>{
    sock.emit('start');
});


sock.on('status', (gamestatus) => {

    console.log(gamestatus);
    
    if(gamestatus.started){
        $('.status').classList.add('hide');
        $('.pytanie').classList.remove('hide');

        $('.pytanie').innerText = gamestatus.answer.pytanie;
        let odpowiedzi = $$('.answer-grid .answer-button');
        odpowiedzi.forEach((el, i) => {
            console.log(el);
            
            el.querySelector('span').innerText = gamestatus.answer.odpowiedzi[i];
        });
    }
    else    {
        $('.status').classList.remove('hide');
        $('.pytanie').classList.add('hide');
    }

    $('#clients').innerText = gamestatus.clientcount;
});

sock.on("ok", (ud)=>{
  
    console.log(ud.name);
    window.location.href = 'client.html';
    
})

setInterval(() => {
    // wysłanie keepalive co 20 sekund
    sock.emit('keepalive');
}, 20000);

function dolacz(){
    let imie = $('#name').value
    if(imie.length > 0){
        sock.emit('dolacz', imie);
    }
}
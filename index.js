const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.get('/', (req, res) => {
    // res.send('<h1>Hello World</h1>');
    res.sendFile(`${__dirname}/app/index.html`);
})
let numUsers = -1;
io.on('connection', (socket) => {
    console.log(`A user connected`);

    socket.on('chat message', (msg) => {
        const timeStamp = new Date();
        io.emit('chat message', `${msg.username} : ${msg.text} ${timeStamp.getHours()}:${timeStamp.getMinutes()}`);
    });

    socket.on('isTyping', (alert) => {
        socket.broadcast.emit('isTyping', `${alert.username} is typing...`)
    })

    socket.on('username', (username) => {
        numUsers+=1;
        socket.broadcast.emit('username', { alert: `${username} Connected`, numUsers : `Seen By ${numUsers}`});
    })

    socket.on('disconnect', () => {
        console.log(`A user Disconnected`);
        numUsers-=1;
        io.emit('end user', {
            alert: 'A user Disconnected', numUsers: `Seen By ${numUsers}`})
    })
    
})
const port = process.env.PORT || 3002;
http.listen(port, (err) => {
    if(err) {
        console.log(`Error Connecting to Server : ${err}`);
    }
    console.log(`Server listening on  : ${port}`);
})
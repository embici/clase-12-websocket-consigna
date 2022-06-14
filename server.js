const express = require('express');
const path = require('path')
const http = require('http');
const { Server } = require('socket.io');
const ejs = require('ejs');
const productsRouter = require('./routes/productsRouter');
const moment = require('moment');

const app = express();
const httpServer = http.createServer(app); // pasamanos de express a http
const io = new Server(httpServer);
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))
// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

const messages = [
    { author: 'Juan', text: '¡Hola! ¿Que tal?', date: currentDate},
    { author: 'Pedro', text: '¡Muy bien! ¿Y vos?', date: currentDate },
    { author: 'Ana', text: 'Genial!', date: currentDate }
];

const products = [];

app.use('/api/productos', productsRouter);


app.get('/', (req, res) => {
    res.render('pages/index', {messages: messages});
});



io.on('connection', (socket) => {
    console.log('User conectado, id: ' + socket.id);
    socket.emit('messages', messages);
    socket.emit('products', products);

    socket.on('new-message', (data) => {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

    socket.on('new-product', (data) => {
        products.push(data);
        console.log('products', products);
        io.sockets.emit('products', products);
    });
});

httpServer.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:'+PORT);
});
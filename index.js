var express = require('express');
var app = express();
var cors = require('cors')
var path = require('path');
var chatRoutes = require('./routes/populate-chatbot');
var adminRoutes = require('./routes/admin-routes');
var loginRoutes = require('./routes/auth');
var config = require('./config/variables');

var corsOptions = {
    origin: config.serverURL,
};

app.use(express.static('views'));
 
app.use(cors())

app.use('/admin',adminRoutes);

app.use('/chat', chatRoutes);

app.use('/login', loginRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/html/chatbot.html'))
});
app.listen(3000);
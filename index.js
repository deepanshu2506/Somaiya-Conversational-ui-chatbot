var express = require('express');
var app = express();
var path = require('path');
var chatRoutes = require('./routes/populate-chatbot');
var adminRoutes = require('./routes/admin-routes');
var loginRoutes = require('./routes/auth');
app.use(express.static('views'));

app.use('/admin',adminRoutes);

app.use('/chat', chatRoutes);

app.use('/login', loginRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/html/chatbot.html'))
});
app.listen(3000);
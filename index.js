var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

server.listen(PORT, function() {
  console.log('Chat server running');
});

// var io = require('socket.io')(server);

// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });

// client.connect();

// io.on('connection', function(socket)
// {
//   socket.on('login', function(data)
//   {
//       client.query('SELECT * FROM logins;', (err, res) => {
//         if (err) throw err;w
//         for (let row of res.rows) {
//           io.emit('loginStatus', JSON.stringify(row));
//         }
//         client.end();
//       });
//       io.emit('loginStatus', process.env.DATABASE_URL);
//   });
// });

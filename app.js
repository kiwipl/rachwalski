const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

// utworzenie serwera HTTP
const server = http.createServer(function(req, res) {
	fs.readFile('index.html', function(err, data) {
		if (err) {
			res.writeHead(404);
			res.write('Nie znaleziono pliku');
			res.end();
		} else {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.end();
		}
	});
});

// utworzenie serwera WebSocket
const wss = new WebSocket.Server({ server });

// wywołanie funkcji, gdy klient nawiąże połączenie
wss.on('connection', function connection(ws) {
	console.log('Połączono z klientem');

	// wywołanie funkcji, gdy serwer otrzyma wiadomość od klienta
	ws.on('message', function incoming(message) {
		console.log('Otrzymano wiadomość: %s', message);

		// przesłanie treści notatnika do innych klientów
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});

	// wywołanie funkcji, gdy klient zamyka połączenie
	ws.on('close', function() {
		console.log('Połączenie z klientem zostało zamknięte');
	});
});

server.listen(3000, function() {
	console.log('Serwer HTTP działa na porcie 3000');
});

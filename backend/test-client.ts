const io = require('socket.io-client');

// Geben Sie die URL Ihres Socket.io-Servers an
const socket = io('http://localhost:3000'); // Ersetzen Sie die URL durch die Ihres Servers

// Event-Listener für die Verbindungsherstellung
socket.on('connect', () => {
  console.log('Socket.io-Verbindung hergestellt');

  // Hier können Sie beliebige Aktionen ausführen, um die Verbindung zu testen
  // Zum Beispiel: socket.emit('customEvent', { data: 'Testdaten' });
});

socket.on('chooseGameMode', (data: any) => {
  console.log('Nachricht vom Server:', data.message);

});

// Event-Listener für benutzerdefinierte Ereignisse
socket.on('customEventResponse', (data) => {
  console.log('Empfangene Antwort von Server:', data);
});

// Event-Listener für Fehler
socket.on('error', (error) => {
  console.error('Fehler in der Socket.io-Verbindung:', error);
});

// Event-Listener für die Trennung
socket.on('disconnect', () => {
  console.log('Socket.io-Verbindung getrennt');
});

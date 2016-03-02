// setup websocket with callbacks
var ws = new WebSocket('ws://localhost:9000/');
ws.onopen = function() {
    log('CONNECT');
    ws.send("I'm the client!")
};

ws.onclose = function() {
    log('DISCONNECT');
};

ws.onmessage = function(event) {
    log('MESSAGE: ' + event.data);
};

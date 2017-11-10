(function() {
    console.log('bla');
    var ws = new WebSocket("ws://websocket-service.herokuapp.com/");
    ws.onmessage = function(msg) {
        console.log(msg);
    }
})()
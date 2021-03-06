(function() {
    
    var console = window.console;
    var document = window.document;

    var goodWeather = false;

    var msgBuffer = [];

    var canUpdate = false;
    var ws
    var connect = function() {
        var ws = new WebSocket("wss://websocket-service.herokuapp.com/");
        ws.onmessage = function(msg) {
            
            console.log(msg)
            try {
                msgBuffer.push(JSON.parse(msg.data));
            } catch(e) {}
            
        }
        ws.onclose = function() {
            console.log('websocket close');
            connect();
        }
        ws.onerror = function() {
            console.log('websocket error');
            connect();
        }
    }

    connect();

    
    
    window.onload = function(){

        document.onclick = function() {
            console.log('click');
        }

        var urlParams = new URLSearchParams(window.location.search);
        goodWeather = urlParams.has("weather") ? 
            urlParams.get("weather") === 'good':
            false;
        
        var cover = document.getElementById("coverweather");
        cover.classList.remove("bad");
        cover.classList.remove("good");
        cover.className += goodWeather ? " good" : " bad";
        
        if (goodWeather) {
            if (goodWeather) {
                var sun = document.getElementById("bigsun");
                sun.className += " hide";
                var man = document.getElementById("sunny-man");
                man.className += " hide"
            }
        }

        // set headline text
        var headline = document.getElementById("headline-text");
        headline.innerHTML = goodWeather ?
            'TODAY IS SUNNY <span><object class="sun-small" data="/images/small_sun.svg" type="image/svg+xml"></object></span> JUST GO ENJOY HAMBURG!':
            "LOOKING FOR THE SUN?";
        
        // initialize
        cover.classList.remove("hide");
        var cover2 = document.getElementById("covernews");
        cover2.classList.remove("hide")
        
        // set intervals
        var COVER_LENGTH = 5000;
        var UPDATE_INTERVAL = 20000;
        
        setTimeout(function() {
            // start after 5 sec
            startMessages();
            setInterval(function(){
                stopMessages();
                setTimeout(function() {
                    startMessages();
                }, COVER_LENGTH);
            }, UPDATE_INTERVAL);

            updateMessage();

            var MIN_MESSAGE_LENGTH = 5000;
            setInterval(function() {
                console.log(msgBuffer, canUpdate)
                if(msgBuffer.length > 0 && canUpdate) {
                    updateMessage();
                }
            }, MIN_MESSAGE_LENGTH);
            
        }, COVER_LENGTH)    
    }

    
    var lastMsg;

    var updateMessage = function() {
        var msgObj = msgBuffer.shift();
        var text = parseServerMsg(msgObj);
        if(lastMsg !== text) {
            updateMsg(text);
        }
        lastMsg = text;
    }

    var startMessages = function() {

        canUpdate = true;

        setTimeout(function() {

            var cover = document.getElementById("coverweather")
            cover.className += " fade-out"
    
            var headline = document.getElementById("headline");
            headline.className += " fade-out-up";

            var gn = document.getElementById('good-news-container');
            gn.className += " fade-in-up";
            
        }, 200)

        if (!goodWeather) {
            var sun = document.getElementById("bigsun");
            sun.className += " fade-out-up";

            var man = document.getElementById("sunny-man");
            man.className += " fade-out-down"
        }
    }

    var stopMessages = function() {

        canUpdate = false;

        var cover = document.getElementById("coverweather");
            cover.classList.remove("fade-out");
            
        var headline = document.getElementById("headline");
        headline.classList.remove("fade-out-up");
        
        if (!goodWeather) {

            setTimeout(function() {

                var sun = document.getElementById("bigsun");
                sun.classList.remove("fade-out-up");
        
                var man = document.getElementById("sunny-man");
                man.classList.remove("fade-out-down");
            }, 200)
        }

        var gn = document.getElementById('good-news-container');
        gn.className += " fade-in-up";
    };

    var parseServerMsg = function(msgObj) {
        if (msgObj) {
            var message = msgObj.message || "";
            var txt = '<div>' + message + '</div>';
            
            var score;
            try {
                score = parseFloat(msgObj.score);
            }
            catch(e) {
                score = .9;
            }
            if(isNaN(score)) {
                score = .9;
            }
            
            var author = msgObj.author || 'NMA';
            if(author && typeof score === 'number') {
                var countSuns = scoreToRating(score);
                var rating = createRating(countSuns);
                var credit = '<div class="message-credit">Thank you ' + author + ' for making Hamburg ' + rating + ' brighter!</div>';
                txt += credit;
            }
            return txt;
        }
        return ":)";
    }

    var createRating = function(score) {

        var max = 5;
        var active = '<span><object class="rating-sun" data="/images/sun_star_active.svg" type="image/svg+xml"></object></span>';
        var inactive = '<span><object class="rating-sun" data="/images/sun_star_inactive.svg" type="image/svg+xml"></object></span>';
        var ratings = [];
        while(max-- > 0) {
            if(score > max) {
                ratings.push(active);
            } else {
               ratings.push(inactive); 
            }
        }
        return ratings.reverse().join(' ');
    }

    var scoreToRating = function(score) {
        if (score > .9) {
            return 5;
        }
        if(score > .7) {
            return 4;
        }
        if(score > .5) {
            return 3;
        }
        if(score > .3) {
            return 2;
        }
        return 1;
    }

    var updateMsg = function(txt) {

        txt ='Here\'s some <span class="text-invers">sunny news</span>: </br>' + txt;
        
        var gnc = document.getElementsByClassName("good-news-container");
        var i = gnc.length;
        while(i-- > 0) {
            gnc[i].className += " fade-out-up";
            (function(item) {
                setTimeout(function() {
                    item.remove();
                }, 1000);
            })(gnc[i]);
        }
    
        // fade in new news
        var newGn = document.createElement('div');
        newGn.id = "good-news-container";
        newGn.className = "good-news-container";

        var newGnMsg = document.createElement('div');
        newGnMsg.className = "good-news-text";

        newGnMsg.innerHTML = txt;
        newGn.appendChild(newGnMsg);
        var cover = document.getElementById("covernews");

        cover.appendChild(newGn);
        setTimeout(function() {
            newGn.className += " fade-in-up";
        }, 200)
        
    }
})()


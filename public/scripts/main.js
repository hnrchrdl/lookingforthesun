(function() {
    var goodWeather = false;
    var ws = new WebSocket("wss://websocket-service.herokuapp.com/");
    ws.onmessage = function(msg) {
        
        console.log(msg)

        var msgObj = JSON.parse(msg.data);
        
        var txt = msgObj.message;
        // var score = msgObj.score;
        updateMsg(txt);
        // updateMsg(txt + score ? " " + score.toString(): "");
    }
    window.onload = function(){

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
        

        setTimeout(function() {
            
            startMessages();

            setInterval(function(){
                console.log('stop')
                 stopMessages();
                 setTimeout(function() {
                    console.log('start')
                    startMessages();
                 }, 5000);
            }, 15000);

        }, 5000)

        
    }

    var startMessages = function() {

        var cover = document.getElementById("coverweather")
        cover.className += " fade-out"

        var headline = document.getElementById("headline");
        headline.className += " fade-out-up";

        if (!goodWeather) {
            var sun = document.getElementById("bigsun");
            sun.className += " fade-out-up";

            var man = document.getElementById("sunny-man");
            man.className += " fade-out-down"
        }

        var gn = document.getElementById('good-news-container');
        gn.className += " fade-in-up";

    }

    var stopMessages = function() {
        var cover = document.getElementById("coverweather");
            cover.classList.remove("fade-out");
            
        var headline = document.getElementById("headline");
        headline.classList.remove("fade-out-up");
        
        if (!goodWeather) {
            var sun = document.getElementById("bigsun");
            sun.classList.remove("fade-out-up");
    
            var man = document.getElementById("sunny-man");
            man.classList.remove("fade-out-down");
        }

        var gn = document.getElementById('good-news-container');
        gn.className += " fade-in-up";
    };

    var updateMsg = function(txt) {
        console.log(txt)
        txt ='Here\'s some <span class="text-invers">sunny news</span>: </br>' + txt;
        
        var gnc = document.getElementsByClassName("good-news-container");
        var i = gnc.length;
        while(i-- > 0) {
            gnc[i].className += " fade-out-up";
            (function(item) {
                setTimeout(function() {
                    item.remove();
                    // if(gn) {
                    //     gn.remove();
                    // }
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
        
        // console.log(newGn);
        
        
    }
    })()


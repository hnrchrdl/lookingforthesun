

(function() {
    var isSlided = false;
    var ws = new WebSocket("ws://websocket-service.herokuapp.com/");
    ws.onmessage = function(msg) {
        var txt = JSON.parse(msg.data).message;
        updateMsg(txt);
    }
    window.onload = function(){

        // document.onclick = function(event) {    
        //     if(!isSlided) {
        //         startSlide();
        //     }
        // };

        setTimeout(function() {
            if(!isSlided) {
                startMessages();
            }

            setInterval(function(){
                console.log('stop')
                 stopMessages();
                 setTimeout(function() {
                    console.log('start')
                    startMessages();
                 }, 5000);
            }, 30000);

        }, 5000)

        
    }

    var startMessages = function() {

        var cover = document.getElementById("coverbadwheather");
        cover.className += " fade-out"
        
        var sun = document.getElementById("bigsun");
        sun.className += " fade-out-up";

        var man = document.getElementById("sunny-man");
        man.className += " fade-out-down"

        var headline = document.getElementById("headline");
        headline.className += " fade-out-up";

        var gn = document.getElementById('good-news-container');
        gn.className += " fade-in-up";
    }


    var stopMessages = function() {
        var cover = document.getElementById("coverbadwheather");
        cover.classList.remove("fade-out");
        
        var sun = document.getElementById("bigsun");
        sun.classList.remove("fade-out-up");

        var man = document.getElementById("sunny-man");
        man.classList.remove("fade-out-down");

        var headline = document.getElementById("headline");
        headline.classList.remove("fade-out-up");

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


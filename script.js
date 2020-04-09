const button = document.getElementById("button");
button.addEventListener("click", getJokes);

// Get jokes from Joke API
function getJokes() {
  fetch("https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=nsfw,racist,sexist")
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      if (data.setup) {
        // console.log(data.setup);
        // console.log(data.delivery);
        joke = data.setup + " ... " + data.delivery;
        jokeLength = joke.length + 150;
      } else {
        // console.log(data.joke);
        joke = data.joke.replace(/\\n/gi, " ... ");
        jokeLength = joke.length;
      }
      tellMe(joke);
      button.disabled = true;
      console.log(joke.length);
      // dynamically changing amount of time for button to be disabled
      if (jokeLength < 80) {
        setTimeout(() => (button.disabled = false), 4000);
      } else if (jokeLength >= 80) {
        setTimeout(() => (button.disabled = false), 7000);
      } else if (jokeLength >= 160) {
        setTimeout(() => (button.disabled = false), 10000);
      }
    });
}

// Using the Joke to return audio data from text-to-speech API
function tellMe(joke) {
  console.log(joke);
  let jokeString = joke.trim().replace(/ /g, "%20");
  // console.log(jokeString);

  VoiceRSS.speech({
    key: "e985f868e96c46d9b0789c3855350152",
    src: jokeString,
    hl: "en-us",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false
  });
}

// Voice RSS Javascript SDK
"use strict";var VoiceRSS={speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;new Audio(t.responseText).play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};
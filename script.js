let joke;
const audioEl = document.getElementById('audio');

function getJokes() {
    fetch('https://sv443.net/jokeapi/v2/joke/Programming')
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        if (data.setup) {
            // console.log(data.setup);
            // console.log(data.delivery);
            joke = data.setup + ',,.' + data.delivery;
        } else {
            // console.log(data.joke);
            joke = (data.joke).replace(/\\n/gi, ',,.');
        }
        tellMe(joke);
    });
}

function tellMe(joke) {
    console.log(joke);
    jokeString = joke.trim().replace(/ /g, '%20').replace(/\'/g, '%27').replace(/\"/g, '%22');
    console.log(jokeString)
    let jokeRequest = 'http://api.voicerss.org/?key=e985f868e96c46d9b0789c3855350152&src=Hello%252C%20world!&hl=en-us';
    console.log(jokeRequest)
    // fetch(jokeRequest)
    // .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    // });

  //   fetch('http://api.voicerss.org/?key=e985f868e96c46d9b0789c3855350152&src=Hello%252C%20world!&hl=en-us')
  // .then(
  //   function(response) {
  //     if (response.status !== 200) {
  //       console.log('Looks like there was a problem. Status Code: ' +
  //         response.status);
  //       return;
  //     }

  //     // Examine the text in the response
  //     response.json().then(function(data) {
  //       console.log(data);
  //     });
  //   }
  // )
  // .catch(function(err) {
  //   console.log('Fetch Error :-S', err);
  // });

//   fetch("https://voicerss-text-to-speech.p.rapidapi.com/?r=0&c=mp3&f=8khz_8bit_mono&src=Hello%252C%20world!&hl=en-us", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "voicerss-text-to-speech.p.rapidapi.com",
// 		"x-rapidapi-key": "6f40c67e57msh400dfb7bb0ad02dp119b95jsn47449ab609ab"
// 	}
// })
// .then(response => {
//   console.log(response);
  
//   // var blob = new Blob([response.body], { type: 'audio/mp4' });
//   //   var url = window.URL.createObjectURL(blob)
//     // window.audio = new Audio();
//     // window.audio.src = url;
//     // window.audio.controls = 'true';
//     // window.audio.autoplay = 'true';
//     // audioEl.innerHTML = `<audio src="${url}" autoplay controls></audio>`
//     // audioEl.play();
// })
// .catch(err => {
// 	console.log(err);
// });



  //
// loads remote file using fetch() streams and "pipe" it to webaudio API
// remote file must have CORS enabled if on another domain
//
// mostly from http://stackoverflow.com/questions/20475982/choppy-inaudible-playback-with-chunked-audio-through-web-audio-api
// 

function appendBuffer( buffer1, buffer2 ) {
  var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
  tmp.set( new Uint8Array( buffer1 ), 0 );
  tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
  return tmp.buffer;
}

function play(urlMusic) {
  let apiUrl = "http://api.voicerss.org/?key=e985f868e96c46d9b0789c3855350152&src=Hello%20world!&hl=en-us";
  var context = new (window.AudioContext || window.webkitAudioContext)();
  var audioStack = [];
  var nextTime = 0;

  fetch(apiUrl).then(function(response) {
    var reader = response.body.getReader();
    var header = null;//first 44bytes

    function read() {
      return reader.read().then(({ value, done })=> {
      	var audioBuffer = null;
      	if (header == null){
      		//copy first 44 bytes (wav header)
      		header = value.buffer.slice(0,44);
      		audioBuffer = value.buffer;
      	} else {
      		audioBuffer = appendBuffer(header, value.buffer);
      	}
      	
        context.decodeAudioData(audioBuffer, function(buffer) {

          audioStack.push(buffer);
          if (audioStack.length) {
              scheduleBuffers();
          }
        }, function(err) {
          console.log("err(decodeAudioData): "+err);
        });
        if (done) {
          console.log('done');
          return;
        }
        //read next buffer
        read();
      });
    }
    read();
  })

  function scheduleBuffers() {
      while ( audioStack.length) {
          var buffer    = audioStack.shift();
          var source    = context.createBufferSource();
          source.buffer = buffer;
          source.connect(context.destination);
          if (nextTime == 0)
              nextTime = context.currentTime + 0.02;  /// add 50ms latency to work well across systems - tune this if you like
          source.start(nextTime);
          nextTime += source.buffer.duration; // Make the next buffer wait the length of the last buffer before being played
      };
  }
}

var urlMusic = '/beats1.wav'
play(urlMusic);







  // // fetch() returns a promise that
  // // resolves once headers have been received
  // fetch(url).then(response => {
  //   // response.body is a readable stream.
  //   // Calling getReader() gives us exclusive access to
  //   // the stream's content
  //   var reader = response.body.getReader();
  //   var bytesReceived = 0;

  //   // read() returns a promise that resolves
  //   // when a value has been received
  //   return reader.read().then(function processResult(result) {
  //     // Result objects contain two properties:
  //     // done  - true if the stream has already given
  //     //         you all its data.
  //     // value - some data. Always undefined when
  //     //         done is true.
  //     if (result.done) {
  //       console.log("Fetch complete");
  //       return;
  //     }

  //     // result.value for fetch streams is a Uint8Array
  //     bytesReceived += result.value.length;
  //     console.log('Received', bytesReceived, 'bytes of data so far');

  //     // Read some more, and call this function again
  //     console.log(reader);
  //     return reader.read().then(processResult);

      // var blob = new Blob([response.body], { type: 'audio/mp4' });
      // var url = window.URL.createObjectURL(blob)
      // window.audio = new Audio();
      // window.audio.src = url;
      // window.audio.controls = 'true';
      // window.audio.autoplay = 'true';
      // audioEl.innerHTML = `<audio src="${url}" autoplay controls></audio>`
      // audioEl.play();
    // });
  // });

}

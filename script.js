let jokeString;
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
  jokeString = joke.trim().replace(/ /g, '%20');
  // .replace(/\'/g, '%27').replace(/\"/g, '%22');
  console.log(jokeString);
  let jokeRequest = `http://api.voicerss.org/?key=e985f868e96c46d9b0789c3855350152&src=${jokeString}&hl=en-us`;
  console.log(jokeRequest);

  // loads remote file using fetch() streams and "pipe" it to webaudio API
  // remote file must have CORS enabled if on another domain
  function appendBuffer( buffer1, buffer2 ) {
    var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
    tmp.set( new Uint8Array( buffer1 ), 0 );
    tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
    return tmp.buffer;
  }

  function play(urlMusic) {
    // let apiUrl = "http://api.voicerss.org/?key=e985f868e96c46d9b0789c3855350152&src=Hello%20world!&hl=en-us";
    let apiUrl = `http://api.voicerss.org/?key=e985f868e96c46d9b0789c3855350152&src=${jokeString}&hl=en-us&c=mp3&f=48khz_16bit_stereo`;
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
                nextTime = context.currentTime + 0.5;  /// add 50ms latency to work well across systems - tune this if you like
            source.start(nextTime);
            nextTime += source.buffer.duration; // Make the next buffer wait the length of the last buffer before being played
        };
    }
  }

  var urlMusic = '/beats1.mp3'
  play(urlMusic);

}

var http = require('http'),
fs = require('fs');

const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient({
      keyFile: '/Users/mac/Desktop/google-cloud-speech/gc-speech-1317c8a1a4e4.json',
      projectId: 'gc-speech-1515091348818'
});

const request = {
  config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
  },
  interimResults: false, // If you want interim results, set this to true
};

var text = "";


http.createServer(function(request, response) {

  fs.readFile('./speech.html', function (err, html) {
      if (err) {
        response.writeHead(404);
        response.write('Contents you are looking are Not Found');
      } else {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
      }
  });

}).listen(3000);

console.log('Server Started listening on port 3000');

function convertSpeechToText() {
  console.log("convert function is invoked!!");
    // Create a recognize stream
    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', console.error)
      .on('data', data =>
        text = data.results[0] && data.results[0].alternatives[0]
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : `\n\nReached transcription time limit, press Ctrl+C\n`
      );

    // Start recording and send the microphone input to the Speech API
    record
      .start({
        sampleRateHertz: 16000,
        threshold: 0,
        // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
        verbose: false,
        recordProgram: 'rec', // Try also "arecord" or "sox"
        silence: '10.0',
      })
      .on('error', console.error)
      .pipe(recognizeStream);

      response.writeHeader(200, {"Content-Type": "text/html"});
      response.write(html);
      response.end();
}

function stop() {

}

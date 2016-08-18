/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express');
var router = express.Router();
var watson = require('watson-developer-cloud');
var fs = require('fs');
var tempfile = require('tempfile');
var cfenv = require('cfenv');
var extend = require('util')._extend;

var appEnv = cfenv.getAppEnv();

// Text to speech service credentials
var ttsCreds = extend({
  version: 'v1',
  username: '<username>',
  password: '<password>'
}, appEnv.getServiceCreds('text-to-speech-service'));

var textToSpeech = watson.text_to_speech(ttsCreds);

// Speech to text service credentials
var sttCreds = extend({
  version: 'v1',
  username: '<username>',
  password: '<password>'
}, appEnv.getServiceCreds('speech-to-text-service'));

var speechToText = watson.speech_to_text(sttCreds);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Got request to home page");
  res.render('index', { title: '空耳英語変換ツール by Watson' });
});

//Japanese text -> Japanese audio -> English text.
router.get('/api/entext', function(req, res){
  var jptext = req.query.jptext;
  var audioFileName = tempfile('.wav');
  console.log("audioFileName: ", audioFileName);
  console.log("jptext: ", jptext);

  var tts_params = {
    text: jptext,
    voice: 'ja-JP_EmiVoice',
    accept: 'audio/wav'
  };

  var transcript = textToSpeech.synthesize(tts_params);
  transcript.pipe(fs.createWriteStream(audioFileName));

  //Call STT when the audio file is created
  transcript.on('end', function(){
    var stt_params = {
      audio: fs.createReadStream(audioFileName),
      content_type: 'audio/wav',
      model: 'en-US_BroadbandModel',
      continuous: true
    };

    speechToText.recognize(stt_params, function(err, entext){
      if(err)
        console.log('STT error: ', err);
      else{
        var jsonData = JSON.stringify(entext, null, 2);
        console.log(jsonData);
        res.send(jsonData);
      }
    });
  });
});

module.exports = router;

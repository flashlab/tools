importScripts("comlink.js");

// Create a TextToIPA object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (typeof TextToIPA !== 'object') {
  TextToIPA = {};
}

if (typeof ConverterForm !== 'object') {
  ConverterForm = {"mode": ""};
}

// function timeoutPromise(interval) {
//   return new Promise((resolve, reject) => {
//     setTimeout(function(){
//       resolve("done");
//     }, interval);
//   });
// };
function isJapan(str) {
  return /[\u3040-\u309F]|[\u30A0-\u30FF]/g.test(str)
}

function isEnglish(str) {
  return /^[\x20-\x7F]*$/.test(str)
}
(function() {
  'use strict';

  // Objects

  // Create a constructor for an IPAWord that makes displaying them and
  // associated errors much easier. 
  function IPAWord(error, text) {
    this.error = error;
    this.text = text;
  }

  // Functions

  // Parse the dictionary. Only used by `loadDict`.
  if (typeof TextToIPA._parseDict !== 'function') {
    TextToIPA._parseDict = function(lines) {
      console.log('TextToIPA: Beginning parsing to dict...');

      // Fill out the IPA dict by
      // 1) regexing the word and it's corresponding IPA translation into an array
      // 2) using the word as the key and the IPA result as the pair
      var num = lines.length;
      for (var i = 0; i < num; i++) {
        var arr = lines[i].split(/\s+/g);
        TextToIPA._IPADict[arr[0]] = arr[1];
      }
      console.log('TextToIPA: Done parsing.');
    };
  }

  // Load the dictionary. Can be on the local machine or from a GET request.
  if (typeof ConverterForm.loadDict !== 'function') {
    ConverterForm.loadDict = async function() {
      if (ConverterForm.mode === "jp") {
        if (typeof TextToIPA._IPADict2 === 'object' && TextToIPA._IPADict2['_analyzer'] !== null) return;
        importScripts('kuroshiro.min.js');
        importScripts('kuroshiro-analyzer-kuromoji.min.js');
        TextToIPA._IPADict2 = new Kuroshiro();
        //console.log(TextToIPA._IPADict2['_analyzer']);
        await TextToIPA._IPADict2.init(new KuromojiAnalyzer({ dictPath: "https://dict.zzbd.org/dict" }));
        //console.log(TextToIPA._IPADict2)
      } else if (ConverterForm.mode === "en") {
        if (typeof TextToIPA._IPADict === 'object' && Object.keys(TextToIPA._IPADict).length > 1) return;
        TextToIPA._IPADict = {'_code_': '1'};
        console.log('TextToIPA: Loading dict...');
        TextToIPA._IPADict['_code_'] = '2';
        var txtFile = new XMLHttpRequest();
        txtFile.open('GET', "https://dict.zzbd.org/dict/ipadict.txt", false);
        txtFile.send(null);
        // txtFile.onreadystatechange = function() {
          // If document is ready to parse...
          if (txtFile.readyState == 4 && ((txtFile.status == 200 || txtFile.status == 0))) {
            // And file is found...
            // Load up the ipa dict
            TextToIPA._parseDict(txtFile.responseText.split('\n'));
            if (Object.keys(TextToIPA._IPADict).length === 1) TextToIPA._IPADict['_code_'] = '1';
          } else {
            console.log('loading error: netState: ' + txtFile.readyState)
        }
        // };
      }
  }
}
    if (typeof TextToIPA.lookup !== 'function') {

    TextToIPA.lookup = function(word) {

      if (typeof TextToIPA._IPADict !== 'object' || Object.keys(TextToIPA._IPADict).length < 2) {
        console.log('TextToIPA Error: No data in TextToIPA._IPADict. Did "loadDict()" run?');
      } else {
        // It is possible to return undefined, so that case should not be ignored
        if (typeof TextToIPA._IPADict[word] != 'undefined') {

          // Some words in english have multiple pronunciations (maximum of 4 in this dictionary)
          // Therefore we use a trick to get all of them

          // Resulting error, null since we don't know if this word has multiple
          // pronunciations
          var error = null;
          // Text, defaults to the IPA word. We build on this if multiple
          // pronunciations exist
          var text = TextToIPA._IPADict[word];

          // Iterate from 1 - 3. There are no more than 3 extra pronunciations.
          for (var i = 1; i < 4; i++) {
            // See if pronunciation i exists...
            if (typeof TextToIPA._IPADict[word + '(' + i + ')'] != 'undefined') {
              // ...If it does we know that the error should be multi and the text
              // is always itself plus the new pronunciation
              error = 'multi';
              text += '|' + TextToIPA._IPADict[word + '(' + i + ')'];
              // ...Otherwise no need to keep iterating
            } else {
              break;
            }
          }

          // Return the new word
          return new IPAWord(error, text);

          // Otherwise the word isn't in the dictionary
        } else {

          return new IPAWord(undefined, null);

        }

      }

    };

  }

}());

(function() {

  'use strict';

  // Functions
  if (typeof ConverterForm.convert !== 'function') {
    ConverterForm.convert = async function(inText) {
      if (typeof inText !== 'string') {
        console.log('TextToIPA Error: "inText" called in "ConverterForm.convert()" is not a valid content"');
        return
      }

      // Reset the error messages
      var currentErrorMessage = '';
      var currentMultiMessage = '';

      // Resulting array of IPA text words
      var IPAText = [];
      var IPABlock = '';
      // Get the input from the inID as an array of strings that are each individual word
      var englishTextLine = inText.split(/\n+/g);
      ConverterForm.mode = "";
      if (isEnglish(englishTextLine[0])) ConverterForm.mode = "en";
      if (isJapan(englishTextLine[0])) ConverterForm.mode = "jp";

      if (ConverterForm.mode === "en") {
        if (typeof TextToIPA._IPADict !== 'object') await ConverterForm.loadDict()
        for (var j of englishTextLine) {
          if (!isEnglish(j)) {IPABlock += '<p>' + j + '</p>'; continue}
          var IPAText = [];
          for (var i of j.split(/\s+/g)) {
            // Lookup the word with TextToIPA. The first element will be the error
            // with the word, the second element will be the converted word itself.
            // We also strip punctuation and and case.
            var IPAWord = TextToIPA.lookup(i.toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));

            // Does the word exist?
            if (typeof IPAWord.error === 'undefined') {
              // Push plain text instead of IPA
              IPAText.push('<ruby>' + i + '<rp>(</rp><rt>/<input style="width:' + i.length * 6 + 'px">/</rt><rp>)</rp></ruby>');

              // If it does, see how many pronunciations there are (TextToIPA knows this, and sends all pronunciations regardless)
            } else if (IPAWord.error === 'multi') {
              IPAText.push('<ruby>' + i + '<rp>(</rp><rt><select><option>' + IPAWord.text.replace(/\|/g, '</option><option>') + '</option></select></rt><rp>)</rp></ruby>');

              // Otherwise just push the converted word
            } else {
              IPAText.push('<ruby>' + i + '<rp>(</rp><rt>/' + IPAWord.text + '/</rt><rp>)</rp></ruby>');

            }
          }
          IPABlock += '<p>' + IPAText.join(' ') + '</p>'
        }
      } else {
        if (typeof TextToIPA._IPADict2 !== 'object') await ConverterForm.loadDict()
        for (var j of englishTextLine) {
          IPAText = isJapan(j) ? await TextToIPA._IPADict2.convert(j, {
            mode: "furigana",
            to: "hiragana"
          }) : j;
          IPABlock += '<p>' + IPAText + '</p>'
        }
      }
      return IPABlock
    }

  }
} ());
Comlink.expose(ConverterForm);
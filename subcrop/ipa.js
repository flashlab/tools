//  text-to-ipa.js

//  This file creates a global TextToIPA object containing the public loadDict
//  and lookup methods as well as the associated private helper objects and methods.

//  The purpose of this program is to look up an english word in an english-to-ipa
//  dictionary via lookup() and return an IPAWord to tell if an english word
//  has multiple IPA pronunciations, as well as the IPA text itself (pronunciations
//  included).

//  This can be viewed as an API to loading the CMU IPA Dictionary, and looking up words in it.
//  This API is used by `converter-form.js` to give it functionality and a UI, though you can design
//  your own for any purpose you so desire.

// NOTE: This program implies that the CMU IPA dictionary (http://people.umass.edu/nconstan/CMU-IPA/)
// will be used to get IPA translations. This dictionary is by default included with this
// program under the name 'ipadict.txt' in the `lib` directory. 
// This _WILL NOT WORK_ with any other IPA dictionary.

//      TextToIPA.loadDict(location)
//          location    Location to load the dictionary from. Since it's gotten
//                      with an XMLHttpRequest, it can be on the local machine or
//                      remote
//          This method produces no output, but will take the location of the
//          dictionary and parse it into the _IPADict object for fast lookups
//          with the lookup method. This method _NEEDS_ to be ran before lookup(),
//          so ideally you would want to run this when the window loads.

//      TextToIPA.lookup(word)
//          word        English word that will be searched for in the IPA Dict
//          This method returns an IPAWord that has an error attribute, and
//          a text attribute. The error determines if the word exists in IPA,
//          if the word has multiple pronunciations. The text is the resulting
//          IPA text of the lookup. See converter-form.js for how to utilize this.
//          return      IPAWord Object with text under the `text` attribute
//          and and errors under the `error` attribute.

// ESLint settings. We want console logging and some problems may exist
// with undefined objects (TextToIPA) but we check for these
// beforehand
/* eslint-disable no-console, no-undef */

// Create a TextToIPA object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (typeof TextToIPA !== 'object') {
  TextToIPA = {};
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
  if (typeof TextToIPA.loadDict !== 'function') {
    TextToIPA.loadDict = function(location) {
      console.log('TextToIPA: Loading dict from ' + location + '...');
      // Create the ipadict if one does not currently exist. This is important,
      // as reloading the dict takes long, so if one already exists, let it be.
      if (typeof TextToIPA._IPADict !== 'object') {
        TextToIPA._IPADict = {};
      }
      if (typeof location !== 'string') {
        console.log('TextToIPA Error: Location is not valid!');
      } else {

        var txtFile = new XMLHttpRequest();

        txtFile.open('GET', location, true);

        txtFile.onreadystatechange = function() {
          // If document is ready to parse...
          if (txtFile.readyState == 4) {
            // And file is found...
            if (txtFile.status == 200 || txtFile.status == 0) {
              // Load up the ipa dict
              TextToIPA._parseDict(txtFile.responseText.split('\n'));
              if (window.lazyScript && Object.keys(TextToIPA._IPADict).length !== 0) parseIPA()
            }
          }
        };

        txtFile.send(null);

      }

    };

  }

  // Lookup function to find an english word's corresponding IPA text
  // NOTE: This method implies that the CMU IPA dictionary (http://people.umass.edu/nconstan/CMU-IPA/)
  // has been loaded with loadDict(). This dictionary is by default included with this
  // program under the name 'ipadict.txt'. This _WILL NOT WORK_ with any other IPA dictionary.
  if (typeof TextToIPA.lookup !== 'function') {

    TextToIPA.lookup = function(word) {

      if (typeof TextToIPA._IPADict !== 'object' || Object.keys(TextToIPA._IPADict).length === 0) {
        console.log('TextToIPA Error: No data in TextToIPA._IPADict. Did "TextToIPA.loadDict()" run?');
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

          return new IPAWord('undefined', null);

        }

      }

    };

  }

}());

// Load dict
// Could be intensive, might only want to load when necessary. Therefore it is commented out.
// Feel free to re-enable if you want to just load the dictionary here, instead of somewhere else
// window.onload = TextToIPA.loadDict('./path/to/dict.txt');

//  converter-form.js

//  This file creates a global ConverterForm object containing the public convert
//  and all additional helper methods.

//  The purpose of this program is to act as a tool to help interface with the text-to-ipa.js program
//  by providing a method to take text input from a text field, output the translated
//  IPA text, and output any error messages if need be.

//      ConverterForm.convert(inID, outID, errID)
//          inID        This is the name of the unique ID (string) of a text area
//                      that input should be read from. The program will find
//                      the first instance of this ID and assume it contains
//                      the english text to convert.
//          outID       This is the name of the unique ID (string) of a text area
//                      that out should be sent to. The program will find
//                      the first instance of this ID and assume it is a text
//                      field, and output the translated IPA there.
//          errID       This is the name of the unique ID (string) of a div that errors
//                      will be output to. The div will automatically be filled
//                      with a paragraph <p> element, and existing data in it
//                      will be overwritten
//          This method produces no output, but will take the value of the inID
//          text area and convert that text with TextToIPA. If the inID, or
//          TextToIPA object do not exist or are not objects, the method will
//          not do anything

// ESLint settings. We want console logging and some problems may exist
// with undefined objects (ConverterForm, TextToIPA) but we check for these
// beforehand
/* eslint-disable no-console, no-undef */

// Create a ConverterForm object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (typeof ConverterForm !== 'object') {
  ConverterForm = {};
}
(function() {

  'use strict';

  // Functions

  if (typeof ConverterForm.convert !== 'function') {
    ConverterForm.convert = function(inText) {

      // inID must point to a possibly valid ID
      if (typeof inText !== 'string') {
        console.log('TextToIPA Error: "inText" called in "ConverterForm.convert()" is not a valid content"');
        // We want TextToIPA to exist, or we can't lookup words
      } else if (typeof TextToIPA._IPADict !== 'object') {
        console.log('TextToIPA Error: "TextToIPA" object not found. Is "text-to-ipa.js" included before ConverterForm.convert() is ran?');
      } else {

        // Reset the error messages
        var currentErrorMessage = '';
        var currentMultiMessage = '';

        // Resulting array of IPA text words
        var IPAText = [];
        var IPABlock = '';
        // Get the input from the inID as an array of strings that are each individual word
        var englishTextLine = inText.split(/\n+/g);

        // Begin converting
        for (var j of englishTextLine) {
          IPAText = [];
          for (var i of j.split(/\s+/g)) {

            // Lookup the word with TextToIPA. The first element will be the error
            // with the word, the second element will be the converted word itself.
            // We also strip punctuation and and case.
            var IPAWord = TextToIPA.lookup(i.toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));

            // Does the word exist?
            if (typeof IPAWord.error === 'undefined') {
              // Push plain text instead of IPA
              IPAText.push(i);

              // If it does, see how many pronunciations there are (TextToIPA knows this, and sends all pronunciations regardless)
            } else if (IPAWord.error === 'multi') {
              IPAText.push('<ruby>' + i + '<rp>(</rp><rt><select><option>' + IPAWord.text.replace('|', '</option><option>') + '</option></select></rt><rp>)</rp></ruby>');

              // Otherwise just push the converted word
            } else {
              IPAText.push('<ruby>' + i + '<rp>(</rp><rt>/' + IPAWord.text + '/</rt><rp>)</rp></ruby>');

            }

          }
          IPABlock += '<p>' + IPAText.join(' ') + '</p>'
        }
        console.log('TextToIPA message: processing IPA...');
        return IPABlock
      }
    }
  }
}());

// vi: set sw=2 et :

(function () {

  var shuffle = function(array) {
    var i = 0
      , j = 0
      , temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  var filteredWordList;

  const SHUFFLE_EVERY = 5;
  const SHUFFLE_EXCEPT_LAST_N = 5;
  var iterations = 0;
  var nextWordPair = function() {
    var p = filteredWordList.pop();
    filteredWordList.unshift(p);

    if (++iterations >= SHUFFLE_EVERY) {
      var p1 = filteredWordList.splice(0, filteredWordList.length - SHUFFLE_EXCEPT_LAST_N);
      shuffle(p1);
      filteredWordList = p1.concat(filteredWordList);
      iterations = 0;
    }

    return(p);
  };

  var tidyText = function(t) {
    return t.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  var matchingText = function(textA, textB) {
    return(tidyText(textA) === tidyText(textB));
  };

  var doSimpleTextToText = function(promptText, challengeWord, possibleAnswers, challengeLanguage, responseLanguage) {
    $('.heading').text(promptText);
    $('.challenge').text(challengeWord);
    $('.challenge').attr('lang', challengeLanguage);
    $('.response').val('');
    $('.response').focus();
    $('.response').attr('lang', responseLanguage);

    $('.message-correct').hide();
    $('.message-incorrect').hide();
    $('.message-give-up').hide();

    $('#game-form').off('submit');
    $('#game-form').off('reset');
    $('#change-wordlists').off('click');

    $('#game-form').on('submit', function (event) {

      var givenAnswer = $('.response').val();

      if (possibleAnswers.filter(function (e) {
        return matchingText(e, givenAnswer);
      }).length > 0) {
        $('.message-correct').show().delay(500).fadeOut(250, function () {
          nextQuestion();
        });
      } else {
        $('.message-incorrect').show().delay(750).fadeOut(250);
      }

      return false;
    });

    $('#game-form').on('reset', function (event) {
      $('.message-give-up .correct-answer').text(possibleAnswers.join(", "));
      $('.message-give-up').show().delay(2000).fadeOut(250 * possibleAnswers.length, function () {
        nextQuestion();
      });

      return false;
    });

    $('#change-wordlists').on('click', newGame);
  };

  var doSimpleDkToEn = function() {
    var pair = nextWordPair();
    // console.log("gender", pair.da_dk_gender);

    var possibleAnswers = filteredWordList.filter(function (e) {
      return e.da_dk == pair.da_dk;
    }).map(function (e) {
      return e.en_gb;
    });
    // TODO uniqify

    doSimpleTextToText('Hvad er den engelsk ord for:', pair.da_dk, possibleAnswers, "da-dk", "en-gb");
  };

  var doSimpleEnToDk = function() {
    var pair = nextWordPair();
    // console.log("gender", pair.da_dk_gender);

    var possibleAnswers = filteredWordList.filter(function (e) {
      return e.en_gb == pair.en_gb;
    }).map(function (e) {
      return e.da_dk; // discards gender
    });
    // TODO uniqify

    doSimpleTextToText('Hvad er den dansk ord for:', pair.en_gb, possibleAnswers, "en-gb", "da-dk");
  };

  var nextQuestion = function() {
    if (Math.random() > 0.5) {
      doSimpleDkToEn();
    } else {
      doSimpleEnToDk();
    }
  };

  var newGame = function () {
    $('#game').hide();

    $('#wordlists').empty();
    wordListNames.forEach(function (listName) {
      var opt = $("<option selected></option>");
      opt.text(listName);
      $('#wordlists').append(opt);
    });
    $('#wordlists').attr('size', wordListNames.length);

    $('#wordlists-form').off('submit');
    $('#wordlists-form').on('submit', function (event) {
      var chosenWordLists = {};
      $('#wordlists option[selected]').each(function (i, opt) {
        if (opt.selected) {
          chosenWordLists[opt.innerText] = true;
        }
      });

      filteredWordList = completeWordList.filter(function (e) {
        return chosenWordLists[e.listName];
      });

      if (filteredWordList.length <= SHUFFLE_EXCEPT_LAST_N) {
        alert('Ikke nok ord for at øve med');
      } else {
        $('#select-wordlists').hide();
        $('#game').show();

        $('#word-count').text(filteredWordList.length);
        shuffle(filteredWordList);
        nextQuestion();
      }

      return false;
    });

    $('#select-wordlists').show();
  };

  $(document).ready(newGame);

})();

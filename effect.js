/* ═══════════════════════════════════════════════════════════════
   effect.js — Birthday Interactive Controller
   ═══════════════════════════════════════════════════════════════ */

$(window).load(function () {
  $('.loading').fadeOut('fast', function () {
    $('#passcode-page').css('display', 'flex').hide().fadeIn('slow');
  });

  /* ── PASSCODE GATE ── */
  var CORRECT_PASSCODE = '88888888'; // ← change this to your 8-digit code
  var enteredCode = '';

  $(document).on('click', '.np-btn[data-n]', function () {
    if (enteredCode.length >= 8) return;
    enteredCode += $(this).data('n').toString();
    updateDots();
    if (enteredCode.length === 8) checkPasscode();
  });

  /* ⌫ delete last digit */
  $(document).on('click', '#np-del', function () {
    enteredCode = enteredCode.slice(0, -1);
    updateDots();
    $('#passcode-hint').text('\u00a0');
    $('#lock-icon').text('🔒');
  });

  /* C — clear all digits */
  $(document).on('click', '#np-clear', function () {
    enteredCode = '';
    updateDots();
    $('#passcode-hint').text('\u00a0');
    $('#lock-icon').text('🔒');
  });

  function updateDots() {
    $('#passcode-dots .dot').each(function (i) {
      $(this).toggleClass('filled', i < enteredCode.length);
    });
  }

  function checkPasscode() {
    if (enteredCode === CORRECT_PASSCODE) {
      $('#lock-icon').text('🔓');
      $('#passcode-hint').css('color', '#6bff9e').text('✓ Welcome!');
      setTimeout(function () {
        $('#passcode-page').fadeOut('slow', function () {
          $('#intro-screen').fadeIn('slow');
        });
      }, 700);
    } else {
      $('#passcode-hint').css('color', '#ff6b6b').text('Wrong passcode. Try again.');
      $('#passcode-dots').addClass('shake');
      setTimeout(function () {
        $('#passcode-dots').removeClass('shake');
        enteredCode = '';
        updateDots();
      }, 500);
    }
  }
});

$('document').ready(function () {

  /* ─────────────────────────────────────────────────────
     BALLOON RESIZE  (8 balloons: HBDADITH)
  ───────────────────────────────────────────────────── */
  var vw;
  $(window).resize(function () {
    vw = $(window).width() / 2;
    relineBalloons(vw);
  });

  function relineBalloons(center) {
    var offsets = [-350,-250,-150,-50,50,150,250,350];
    ['b11','b22','b33','b44','b55','b66','b77','b88'].forEach(function(id, i){
      $('#'+id).animate({ top: bannerLineY(), left: center + offsets[i] }, 500);
    });
  }

  function bannerLineY() {
    var $b = $('.bannar');
    if ($b.length && $b.offset()) {
      return $b.offset().top - $(window).scrollTop() + $b.outerHeight() + 20;
    }
    return 280;
  }

  /* ─────────────────────────────────────────────────────
     STEP 1 — Turn On Lights
     Hides black intro, reveals main page, starts hearts,
     turns on fairy lights, then shows Play Music button.
  ───────────────────────────────────────────────────── */
  $('#turn_on').click(function () {
    $(this).fadeOut('slow');
    $('body').addClass('show-bg');

    /* Start floating hearts */
    startHearts();

    /* Swap black screen for main container */
    $('#intro-screen').fadeOut('slow', function () {
      $('.container').fadeIn('fast');
    });

    /* Turn on fairy lights */
    var $fl = $('#fairy-lights');
    $fl.css('display', 'block');
    setTimeout(function () {
      $fl.css('opacity', '1');
      $fl.addClass('bright');
    }, 50);

    /* Show next button after lights settle */
    setTimeout(function () {
      $('#play').fadeIn('slow');
    }, 2500);
  });

  /* ─────────────────────────────────────────────────────
     STEP 2 — Play Music
  ───────────────────────────────────────────────────── */
  $('#play').click(function () {
    $('.song')[0].play();
    $(this).fadeOut('slow').delay(3000).promise().done(function () {
      $('#bannar_coming').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 3 — Decorate (Banner)
  ───────────────────────────────────────────────────── */
  $('#bannar_coming').click(function () {
    $('.bannar').addClass('bannar-come');
    $(this).fadeOut('slow').delay(3000).promise().done(function () {
      $('#balloons_flying').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 4 — Fly Balloons: rise from bottom, then roam
  ───────────────────────────────────────────────────── */
  var balloonIds = ['b1','b2','b3','b4','b5','b6','b7','b8'];
  var balloonRoaming = {};

  function randomRoamPos() {
    return {
      l: 40 + Math.random() * ($(window).width() - 160),
      b: 80 + Math.random() * ($(window).height() - 300)
    };
  }

  function roamBalloon(id) {
    if (!balloonRoaming[id]) return;
    var r = randomRoamPos();
    var dur = 5000 + Math.random() * 5000;
    $('#'+id).animate({ left: r.l, bottom: r.b }, dur, 'swing', function() {
      roamBalloon(id);
    });
  }

  function raiseBalloon(id, startLeft, delay) {
    var $b = $('#'+id);
    /* Position below screen, set visible */
    $b.css({ left: startLeft, bottom: -220, opacity: 0 });
    setTimeout(function() {
      /* Fade + rise to mid screen */
      $b.animate({ opacity: 0.9, bottom: 200 + Math.random() * 200 }, 1800, 'swing', function() {
        /* Start roaming */
        balloonRoaming[id] = true;
        roamBalloon(id);
      });
    }, delay);
  }

  $('#balloons_flying').click(function () {
    $('.balloon-border').animate({ top: -500 }, 8000);

    /* Add sway animation */
    $('#b1,#b3,#b5,#b7').addClass('balloon-sway-one');
    $('#b2,#b4,#b6,#b8').addClass('balloon-sway-two');

    var ww = $(window).width();
    /* Spread start positions across bottom of screen */
    balloonIds.forEach(function(id, i) {
      var startLeft = 30 + (i / 7) * (ww - 160);
      raiseBalloon(id, startLeft, i * 220);
    });

    $(this).fadeOut('slow').delay(3000).promise().done(function () {
      $('#cake_fadein').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 5 — Cake falls from top of screen
  ───────────────────────────────────────────────────── */
  $('#cake_fadein').click(function () {
    var svg = document.getElementById('cake-svg');
    if (svg) {
      var clone = svg.cloneNode(true);
      svg.parentNode.replaceChild(clone, svg);
    }

    $('.velas').removeClass('dropping lit').css({ top: '-120px', opacity: 0 });
    $('.cake-wrapper').removeClass('cake-fall').css('transform', 'translateY(-150vh)');
    $('.cake').show();
    $('html').css('overflow', 'hidden');

    setTimeout(function () {
      $('.cake-wrapper').addClass('cake-fall');
    }, 50);

    setTimeout(function () {
      $('html').css('overflow', '');
    }, 1600);

    setTimeout(function () {
      $('.velas').css('opacity', 1).addClass('dropping');
    }, 7200);

    $(this).fadeOut('slow').delay(8000).promise().done(function () {
      $('#light_candle').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 6 — Light Candle
  ───────────────────────────────────────────────────── */
  $('#light_candle').click(function () {
    $('.velas').css('opacity', 1).addClass('lit');
    $(this).fadeOut('slow').promise().done(function () {
      $('#wish_message').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 7 — Happy Birthday
  ───────────────────────────────────────────────────── */
  $('#wish_message').click(function () {
    vw = $(window).width() / 2;

    /* Stop roaming */
    balloonIds.forEach(function(id) { balloonRoaming[id] = false; });
    $('#b1,#b2,#b3,#b4,#b5,#b6,#b7,#b8').stop();

    ['b1','b2','b3','b4','b5','b6','b7','b8'].forEach(function(id, i){
      $('#'+id).attr('id', ['b11','b22','b33','b44','b55','b66','b77','b88'][i]);
    });

    var offsets  = [-390,-290,-190,-90,10,110,210,310];
    /* Use bottom so all balloons sit on the same baseline — straight line */
    var targetBottom = 385;
    ['b11','b22','b33','b44','b55','b66','b77','b88'].forEach(function(id, i){
      $('#'+id).css('position', 'fixed').animate({ bottom: targetBottom, top: 'auto', left: vw + offsets[i] }, 600);
    });

    $('.balloons').css('opacity', '0.9');
    $('.balloons h2').fadeIn(3000);

    $(this).fadeOut('slow').delay(3000).promise().done(function () {
      $('#story').fadeIn('slow');
    });
  });

  /* ─────────────────────────────────────────────────────
     STEP 8 — Final message with TYPEWRITER
  ───────────────────────────────────────────────────── */
  var TYPING_SPEED = 22;
  var PAUSE_AFTER  = 140;

  function startMessageTypewriter() {
    var $elements = $('.message-box-full').children();

    function typeEl(idx) {
      if (idx >= $elements.length) return;

      var $el      = $($elements[idx]);
      var fullHtml = $el.html();
      var plain    = $('<div>').html(fullHtml).text();
      var i        = 0;

      var lockedH = $el.outerHeight(true);
      $el.css({ 'min-height': lockedH + 'px', visibility: 'visible' }).html('');

      var tick = setInterval(function () {
        i++;
        $el.text(plain.substring(0, i));
        if (i >= plain.length) {
          clearInterval(tick);
          $el.html(fullHtml).css('min-height', '');
          setTimeout(function () { typeEl(idx + 1); }, PAUSE_AFTER);
        }
      }, TYPING_SPEED);
    }

    typeEl(0);
  }

  $('#story').click(function () {
    $(this).fadeOut('slow');
    $('.cake, .balloons, .balloon-border, .bulb-holder, .bannar, .navbar').fadeOut('fast');

    $('#message-page').fadeIn('slow', function () {
      startMessageTypewriter();
    });
  });

});

/* ── FLOATING HEARTS — only start after Turn On is clicked ── */
var heartsInterval = null;

function createHeart() {
  var container = document.querySelector('.hearts-container');
  if (!container) return;
  var heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerHTML = '❤️';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (4 + Math.random() * 4) + 's';
  container.appendChild(heart);
  setTimeout(function () { heart.remove(); }, 8000);
}

function startHearts() {
  if (heartsInterval) return;
  heartsInterval = setInterval(createHeart, 300);
}

/* ── FAIRY LIGHTS ── */
function initFairyLights() {
  var container = document.getElementById('fairy-lights');
  var path      = document.getElementById('wire-path');
  if (!container || !path) return;
  var pathLength = path.getTotalLength();
  var bulbCount  = 25;
  for (var i = 0; i <= bulbCount; i++) {
    var distance = (i / bulbCount) * pathLength;
    var point    = path.getPointAtLength(distance);
    var bulb     = document.createElement('div');
    bulb.classList.add('bulb-teardrop');
    bulb.style.left = ((point.x / 1000) * 100) + '%';
    bulb.style.top  = point.y + 'px';
    bulb.style.setProperty('--d', (0.5 + Math.random() * 2) + 's');
    container.appendChild(bulb);
  }
}

window.addEventListener('load', initFairyLights);

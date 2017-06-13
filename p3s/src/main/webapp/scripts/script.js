$(function() {
	$('.side-nav-drop-down').hover(function() {
		var $this = $(this);
		$this.find('.side-nav-item').addClass('active');
		$this.find('.drop-down-container').fadeIn(200);

	},
	function() {
		var $this = $(this);
		$this.find('.side-nav-item').removeClass('active');
		$this.find('.drop-down-container').fadeOut(0);
	}
	)	
	
})

$(function() {
 
  $('#respNavSlider-button').click(function() {
    if(!$(this).hasClass('open') && !$(this).is(':animated')) {
      $(this).addClass('open')
    } else {
      $(this).removeClass('open');
    }


  });
});

$(function() {
    var slider_width = $('.navSlider').width();//get width automaticly
 
	$('#navSlider-button').click(function() {

		$('.side-nav-item, .side-nav-social').toggle('slow');
		
	    if($(this).css("margin-left") == (0)+"px" && !$(this).is(':animated'))
	    {	
	    	$(this).removeClass('open');
	        $('.navSlider, #navSlider-button, main').animate({"margin-left": '-='+(slider_width - 70)});
	    }
	    else
	    {
	        if(!$(this).is(':animated'))//perevent double click to double margin
	        {
	        	$(this).addClass('open');
	            $('.navSlider,#navSlider-button, main').animate({"margin-left": '+='+(slider_width - 70)});
	        }
	    }
  	});
 });

 $(document).on('click', '.advice-box', function(){

    var $this = $(this).find('.advice-box-body');

    console.log('hello1');



$(function() {
  $('.accordion-control').click(function() {
    if ($(this).next('.accordion-panel').hasClass('active')) {
      $('.accordion-panel.active').removeClass('active').slideUp(); //if current accord-control is clicked twice
    } else {
      $('.accordion-panel.active').removeClass('active').slideUp();
      $(this).next('.accordion-panel').addClass('active').slideDown();
    }
  });
})
    
    
    if(!$this.is(':visible')) {
      console.log('hello2');
      if ($(this).next('.advice-box-body').hasClass('active')) {
        console.log('hello3');
        $('.advice-box-body').addClass('active').show();
      }
    } else {
      console.log('hello4');
      $('.advice-box-body.active').removeClass('active').hide();
      $(this).next('.advice-box-body').addClass('active').show();
    } 
  })


$(function() {
  var help_slider_width;
  var guideSprite = $('#guideSprite');
  var faqSprite = $('#faqSprite');

  $('#helpSlider-close').click(function() {
    if ($(this).css("margin-right") == (help_slider_width) + "px" && !$(this).is(':animated')) {
        var $caret = $(this).find('i.fa-caret-right');
        $(this).css('color', '#007979');
        $caret.removeClass('fa-caret-right').addClass('fa-caret-left');
        help_slider_width = $('#helpSlider').outerWidth(); //get width automaticly
        $('#helpSlider, #helpSlider-close').animate({
          "margin-right": '-=' + (help_slider_width)
        }, 700);
    } else {
      if (!$(this).is(':animated')) { //perevent double click to double margin
        var $caret =  $(this).find('i.fa-caret-left');
        $(this).css('color', '#000');
        $caret.removeClass('fa-caret-left').addClass('fa-caret-right');

        help_slider_width = $('#helpSlider').outerWidth(); //get width automaticly
          $('#helpSlider, #helpSlider-close').animate({
          "margin-right": '+=' + (help_slider_width)
        }, 800);
      }
    }
  });

  $('#faqButton').click(function() {
    guideSprite.css('background', 'url(../imgs/guide-sprite.png) 0 0')
    faqSprite.css('background', 'url(../imgs/faq-sprite.png) 30px 0')
    $('#guideButton.active').removeClass('active');
    $(this).addClass('active');
    $('#helpIntro, #guideContent').hide(0, function(){
      $('#faqContent').show();
    });
  })
   $('#guideButton').click(function() {
    guideSprite.css('background', 'url(../imgs/guide-sprite.png) 30px 0')
    faqSprite.css('background', 'url(../imgs/faq-sprite.png) 0 0')
    $('#faqButton.active').removeClass('active');
    $(this).addClass('active');
    $('#helpIntro, #faqContent').hide(0, function(){
      $('#guideContent').show();
    });
  })

});

// $(function() {
//   var slider_width = $('#guideSlider').outerWidth(); //get width automaticly
//   var faq_slider_width = $('#faqSlider').outerWidth();

//   $('#guideSlider-button').click(function() {

//     if ($(this).css("margin-right") == (slider_width) + "px" && !$(this).is(':animated')) {
//       $('#guideSlider .accordion-panel').hide(300);
//       $(this).removeClass('open');
//       $('#guideSlider, #guideSlider-button').animate({
//         "margin-right": '-=' + (slider_width)
//       }, 800);
//     } else {
//       if (!$(this).is(':animated')) //perevent double click to double margin
//       {
//         $(this).addClass('open');
//         $('#guideSlider, #guideSlider-button').animate({
//           "margin-right": '+=' + (slider_width)
//         }, 800);
//       }
//     }
//   });
// });

$(function() {
  $('.accordion-control').click(function() {
    if ($(this).next('.accordion-panel').hasClass('active')) {
      $('.accordion-panel.active').removeClass('active').slideUp(); //if current accord-control is clicked twice
    } else {
      $('.accordion-panel.active').removeClass('active').slideUp();
      $(this).next('.accordion-panel').addClass('active').slideDown();
    }
  });
})

$(function() {
	$('button[name="coupon_submit"]').click(function(e){
		var coupon_val = $('input[name="apply_coupon"]').val();		e.preventDefault();
		if(coupon_val == 'DISCOUNT1') {
			$('#coupon_alert').hide();
			$('#coupon_success').fadeIn(300);
			if(!($('#subscript-cost').text() == '£15') && (!($('#annual-cost').text() == '£150'))) {
					setTimeout(function() {
						$('#subscript-cost').fadeOut(300, function(){
							$('#subscript-cost').fadeIn(500).text('£15').prepend('<p class="no-margin-bottom font-weight-bold text-capitalize">Now only</p>');
						})
						$('#annual-cost').fadeOut(300, function(){
							$('#annual-cost').fadeIn(500).text('£150').prepend('<p class="no-margin-bottom font-weight-bold text-capitalize">Now only</p>');
						})
					}, 300)
				}
		} else {
			$('#coupon_alert').fadeIn(300);
			$('#coupon_success').hide();
			if(!($('#subscript-cost').text() == '£20') && (!($('#annual-cost').text() == '£185'))) {
				setTimeout(function() {
				$('#subscript-cost').fadeOut(300, function(){
					$('#subscript-cost').fadeIn(500).text('£20');
				})
				$('#annual-cost').fadeOut(300, function(){
					$('#annual-cost').fadeIn(500).text('£185')
				})
			}, 300)			
			}			
		}
	})	
})

$(function() {

    function passwordStrength(password) {

      var desc = [{'width': '0px'}, {'width': '25%', 'background': '#c54242'}, {'width': '50%', 'background': '#c59e42'}, {'width': '75%', 'background': '#a8c542'}, {'width': '100%', 'background': '#42c586'}];

      var descClass = ['none', 'poor', 'avg', 'good', 'excel'];

      var descText = ['', 'Poor', 'Average', 'Good', 'Excellent'];

      var score = 0;

      if(password.length > 6) { score++; };
      if((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) { score++ };
      if(password.match(/d+/)) { score++ };
      if(password.match(/^.[!"£$%^&*() [{}@#~:?/><|,\ ]/)) { score++ };
      if(password.length > 10) { score++ };

      $('#strength-bar').removeClass(descClass[score]).addClass(descClass[score]).css(desc[score]);
      $('#strength-text p').text(descText[score]);

    }

  $('#newPwd').keyup(function() {
    passwordStrength($(this).val());
  })
})



(function($, window, document, undefined) {

  'use strict';

  // FUNCTIONS
  function topLevelMenu() {
    // Position
    $(window).resize(function(event) {
      var headerHeight = $('#header').outerHeight();
      var navHeight = $('#site-navigation').outerHeight();
      var pushHeight = navHeight - headerHeight;
      $('#site-navigation').addClass('notransition'); // Disable transitions
      $('#site-navigation').css('transform', 'translateY(-' + pushHeight + 'px)');
      $('#site-navigation')[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
      $('#site-navigation').removeClass('notransition'); // Re-enable transitions
      $('#content').css('padding-top', headerHeight + 'px');
    }).trigger('resize');

    // Menu Toggle System.
    $('#menuBtn').on('click', function(event) {
      event.stopPropagation();
      event.preventDefault();

      $('#site-navigation, #header').toggleClass('active');

      $('.header-nav').find('.btn-primary').each(function(index, el) {
        $(el).toggleClass('invert');
      });

    });

    $('body').click(function() {
            $('#site-navigation, #header').removeClass('active');

            $('.header-nav').find('.btn-primary').each(function(index, el) {
              $(el).removeClass('invert');
            });

        });

}


  function navCompactTransition() {
    $('.mag-link').on('click', function(event) {
      $('#navCompact').addClass('slide-up');
    });
  }

  function paginationArrows(){
    $(window).resize(function(event) {
      if ($(window).width() < 480) {
      $('.arrow_container').each(function(index, el) {
        var $paginationText = $(this).parent().parent().find('.pagination-text');
        if ($(this).height() < $paginationText.height()) {
          $(this).height($paginationText.height());
        } else {
          $paginationText.height($(this).height());
        }
      });
     };
    }).trigger('resize');
  }

  function magazineLoadMoreArticles() {
    $('#pagination').on('click', '.next-post a', function(event) {
      event.preventDefault();
      var width = $(this).width();
      $(this).html('<i class="fa fa-spinner fa-pulse fa-fw"></i>');
      $.get($(this).attr('href'), function(data) {
        $(data).find('#main > *').appendTo('#main');
        if ($(data).find('#pagination .next-post a').length) {
          var href = $(data).find('#pagination .next-post a').attr('href');
          $('#pagination .next-post a').html('more');
          $('#pagination .next-post a').attr('href', href);
        } else {
          $('#pagination').hide(0);
        }
      });
    });
    // Update Pagination on Magaizines Arrows
    $('.arrow_left, .arrow_right').find('a').addClass('ajax-link');
  }

  function navCompactWidthCheck() {
    var $elem = $('.nav-compact').find('ul');
    $elem.scroll(function(event) {
      var newScrollLeft = $elem.scrollLeft(),
        width = $elem.outerWidth(),
        scrollWidth = $elem.get(0).scrollWidth;
      if (scrollWidth - newScrollLeft < width + 20) {
        $('#mobileNavPagination').fadeOut(200);
      } else {
        $('#mobileNavPagination').fadeIn(200);
      }
    }).trigger('scroll');

    // Find Active
    var $activeLink = $elem.find('.active');
    var scrollWidthOffset = ($(window).width() / 2) - ($activeLink.width() / 2);
    $elem.scrollTo($activeLink, {
      offset: -scrollWidthOffset
    });
  }

  var $content = $("#content");
  function init() {
    // Seems to fix problem of snap transition.
    setTimeout(function() {
      $content.removeClass('ajax-in-progress');
      $('#navCompact').removeClass('slide-up');
      $('#ajaxSpinner').fadeOut(200);
      $('#site-navigation, #header').removeClass('active');
    }, 400);

    magazineLoadMoreArticles();
    navCompactWidthCheck();

    paginationArrows();
    ajaxifyLinks();
    navCompactTransition();
    contactForms();

    // Request Annual Piracy Reports 2017 page
    initSemanticUI();
  }

  function loadClasses(html) {
    function breadcrumbLogic() {
      var $breadcrumb = $(fullContent).find('#breadcrumbNav');
      var breadcrumbLength = $breadcrumb.find('span[property=itemListElement]').length;
      var $currentBreadCrumb = $('#breadcrumbNav');
      var currentBreadCrumbLength = $currentBreadCrumb.find('span[property=itemListElement]').length;
      if (breadcrumbLength != currentBreadCrumbLength) {
        $currentBreadCrumb.fadeOut(400, function() {
          $currentBreadCrumb.html($breadcrumb.html()).fadeIn(400);
        });
      } else {
        $currentBreadCrumb.find('span[property=itemListElement]').each(function(index, el) {
          var currentBreadCrumbValue = $(el).text();
          var newBreadCrumbValue = $breadcrumb.find('span[property=itemListElement]').eq(index).text();
          if (currentBreadCrumbValue != newBreadCrumbValue) {
            $(el).prev('.breadcrumb-arrow').fadeOut();
            $(el).fadeOut('400', function() {
              $(el).text(newBreadCrumbValue).fadeIn(400);
               $(el).prev('.breadcrumb-arrow').fadeIn(400);
            });
          };
        });
      }
    }

    var fullContent = '<div>' + html + '</div>';
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    var bodyClass = doc.body.getAttribute('class');
        parser = doc = null;

    $('body').removeClass().addClass(bodyClass);

    breadcrumbLogic();

    if ($('#site-navigation').hasClass('active')) {
      $('#navCompact').addClass('slide-up');
    };

    $('.header-nav').find('.btn-primary').each(function(index, el) {
      $(el).removeClass('invert');
    });

    init();
  }

  function ajaxLoad(html) {
    // parseHTML to show '&' instead of '&amp;' in title
    document.title = $.parseHTML(html.match(/<title>(.*?)<\/title>/)[1].trim())[0].textContent
    loadClasses(html);

    // Scroll to top on AJAX load.
    $('html, body').animate({
      scrollTop: 0
    }, 0);
  }

  function loadPage(href) {
    var State = History.getState();
    var data = State.data;

    $('#ajaxSpinner').fadeIn(200);
    $content.addClass('ajax-in-progress');
    $content.load(href + " #content>*", ajaxLoad);
  }


  function ajaxifyLinks() {
    $('.ajax-link').off('click');
    $('.ajax-link').on('click', function(event) {
      $(this).parent().siblings('li').children('a').removeClass('active');
      $(this).addClass('active');
      event.preventDefault();
      var href = $(this).attr("href");
      if (href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) {
        History.pushState({randomData: window.Math.random()}, document.title, href);
        return false;
      }
    });
  }


  History.Adapter.bind(window, 'statechange', function(event) {
    loadPage(location.href);
  });

  // custom logic for Contact Form 7 forms
  function contactForms() {
	  // disable CF7 submit button on click
	  $('.wpcf7-form input[type="submit"]').on('click', function( event ) {
		  $(this).addClass("disabled");
	  });

	  // enable CF7 submit button after request processing is complete
	  document.addEventListener( 'wpcf7submit', function( event ) {
		  $(event.target).find('input[type="submit"]').removeClass("disabled");
	  }, false );

    // fix CF7 not properly initialized and reCaptcha not loading
    // when navigating from ajax-link (i.e. offices to enquiries)
	  if ($( 'div.wpcf7 > form' ).length) {
      var initRecaptcha = false;
      $( 'div.wpcf7 > form' ).each( function() {
        var $form = $( this );
        // if .ajax-loader was not attached, it means that
        // the wpcf7 was not initialized after ajax navigation
        if ($( '.ajax-loader', $form ).length == 0) {
          wpcf7.initForm( $form );
          if ( wpcf7.cached ) {
            wpcf7.refill( $form );
          }
          initRecaptcha = true;
        }
      })

      if (initRecaptcha) {
        $.getScript('https://www.google.com/recaptcha/api.js');
      }
    }
  }

  function initSemanticUI() {
    if ($('.semantic-ui-dropdown').length) {
      $('.semantic-ui-dropdown').dropdown();
    }
  }

  $(function() {
	  init();
	  topLevelMenu();
  });

})(jQuery, window, document);

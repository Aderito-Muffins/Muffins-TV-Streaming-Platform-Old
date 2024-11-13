/*
Template: streamlab - Video Streaming WordPress Theme
Author: Gentechtree
Version: 1.0
Design and Developed by: Gentechtree.com
*/

/*====================================
[  Table of contents  ]
======================================
==> Page Loader
==> Search Button
==> Sticky Header
==> Back To Top
======================================
[ End table content ]
======================================
*/
(function(jQuery) {
    "use strict";
    jQuery(window).on('load', function(e) {

        jQuery('p:empty').remove();

        /*------------------------
                Page Loader
        --------------------------*/
        jQuery("#gen-loading").fadeOut();
        jQuery("#gen-loading").delay(0).fadeOut("slow");

        /*------------------------
                Search Button
        --------------------------*/
        jQuery('#gen-seacrh-btn').on('click', function() {
            jQuery('.gen-search-form').slideToggle();
            jQuery('.gen-search-form').toggleClass('gen-form-show');
            if (jQuery('.gen-search-form').hasClass("gen-form-show")) {
                jQuery(this).html('<i class="fa fa-times"></i>');
            } else {
                jQuery(this).html('<i class="fa fa-search"></i>');
            }
        });


        jQuery('.gen-account-menu').hide();
         jQuery('#gen-user-btn').on('click', function(e) {
            
            jQuery('.gen-account-menu').slideToggle();

             e.stopPropagation();
        });

        jQuery('body').on('click' , function(){
            if(jQuery('.gen-account-menu').is(":visible"))
            {
                jQuery('.gen-account-menu').slideUp();
            }
        });
       
        /*------------------------
                Sticky Header
        --------------------------*/
        var view_width = jQuery(window).width();
        if (!jQuery('header').hasClass('gen-header-default') && view_width >= 1023)
        {
            var height = jQuery('header').height();
            jQuery('.gen-breadcrumb').css('padding-top', height * 1.3);
        }
        if (jQuery('header').hasClass('gen-header-default'))
        {
            jQuery(window).scroll(function() {
                var scrollTop = jQuery(window).scrollTop();
                if (scrollTop > 300) {
                    jQuery('.gen-bottom-header').addClass('gen-header-sticky animated fadeInDown animate__faster');
                } else {
                    jQuery('.gen-bottom-header').removeClass('gen-header-sticky animated fadeInDown animate__faster');
                }
            });
        }
        if (jQuery('header').hasClass('gen-has-sticky')) {
            jQuery(window).scroll(function() {
                var scrollTop = jQuery(window).scrollTop();
                if (scrollTop > 300) {
                    jQuery('header').addClass('gen-header-sticky animated fadeInDown animate__faster');
                } else {
                    jQuery('header').removeClass('gen-header-sticky animated fadeInDown animate__faster');
                }
            });
        }

        jQuery('#gen-seacrh-btn').on('click', function() {
            jQuery('.gen-search-form').slideToggle();
            jQuery('.gen-search-form').toggleClass('gen-form-show');
            if (jQuery('.gen-search-form').hasClass("gen-form-show")) {
                jQuery(this).html('<i class="fa fa-times"></i>');
            } else {
                jQuery(this).html('<i class="fa fa-search"></i>');
            }
        });

        /*------------------------
                Back To Top
        --------------------------*/
  /*------------------------
    Back To Top e Go To Bottom
--------------------------*/

// Ocultar ambos os botões inicialmente
jQuery('#back-to-top, #go-to-bottom').fadeOut();

// Controle de visibilidade para os botões ao rolar a página
jQuery(window).on("scroll", function() {
    // Mostra o botão 'back-to-top' se o usuário rolar mais de 250px
    if (jQuery(this).scrollTop() > 250) {
        jQuery('#back-to-top').fadeIn(1400);
    } else {
        jQuery('#back-to-top').fadeOut(400);
    }

    // Mostra o botão 'go-to-bottom' se o usuário ainda não está no fim da página
    if (jQuery(this).scrollTop() + jQuery(window).height() < jQuery(document).height() - 250) {
        jQuery('#go-to-bottom').fadeIn(1400);
    } else {
        jQuery('#go-to-bottom').fadeOut(400);
    }
});

// Animação para 'scroll' até o topo ao clicar no 'back-to-top'
jQuery('#top').on('click', function() {
    jQuery('body,html').animate({
        scrollTop: 0
    }, 800);
    return false;
});

// Animação para 'scroll' até o fundo ao clicar no 'go-to-bottom'
jQuery('#bottom').on('click', function() {
    jQuery('body,html').animate({
        scrollTop: jQuery(document).height()
    }, 800);
    return false;
});





        if(jQuery('.tv-show-back-data').length)
        {
            var url = jQuery('.tv-show-back-data').data('url');
            console.log(url);
            var html = '';
            html += `<div class="tv-single-background">
                <img src="`+url+`">
            </div>`;
            jQuery('#main').prepend(html);
           
        }
    });
})(jQuery);
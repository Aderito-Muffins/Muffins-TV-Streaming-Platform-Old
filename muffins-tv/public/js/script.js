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

(function (jQuery) {
  "use strict";
  jQuery(window).on("load", function (e) {
    jQuery("p:empty").remove();

    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker
    //     .register("/service-worker.js")
    //     .then(() => console.log("Service Worker registrado com sucesso!"))
    //     .catch((error) =>
    //       console.error("Erro ao registrar o Service Worker:", error)
    //     );
    // }

    /*------------------------
                Page Loader
        --------------------------*/
    jQuery("#gen-loading").fadeOut();
    jQuery("#gen-loading").delay(0).fadeOut("slow");

    /*------------------------
                Search Button
        --------------------------*/
    jQuery("#gen-seacrh-btn").on("click", function () {
      jQuery(".gen-search-form").slideToggle();
      jQuery(".gen-search-form").toggleClass("gen-form-show");
      if (jQuery(".gen-search-form").hasClass("gen-form-show")) {
        jQuery(this).html('<i class="fa fa-times"></i>');
      } else {
        jQuery(this).html('<i class="fa fa-search"></i>');
      }
    });

    jQuery(".gen-account-menu").hide();
    jQuery("#gen-user-btn").on("click", function (e) {
      jQuery(".gen-account-menu").slideToggle();

      e.stopPropagation();
    });

    jQuery("body").on("click", function () {
      if (jQuery(".gen-account-menu").is(":visible")) {
        jQuery(".gen-account-menu").slideUp();
      }
    });

    /*------------------------
                Sticky Header
        --------------------------*/
    var view_width = jQuery(window).width();
    if (
      !jQuery("header").hasClass("gen-header-default") &&
      view_width >= 1023
    ) {
      var height = jQuery("header").height();
      jQuery(".gen-breadcrumb").css("padding-top", height * 1.3);
    }
    if (jQuery("header").hasClass("gen-header-default")) {
      jQuery(window).scroll(function () {
        var scrollTop = jQuery(window).scrollTop();
        if (scrollTop > 300) {
          jQuery(".gen-bottom-header").addClass(
            "gen-header-sticky animated fadeInDown animate__faster"
          );
        } else {
          jQuery(".gen-bottom-header").removeClass(
            "gen-header-sticky animated fadeInDown animate__faster"
          );
        }
      });
    }
    if (jQuery("header").hasClass("gen-has-sticky")) {
      jQuery(window).scroll(function () {
        var scrollTop = jQuery(window).scrollTop();
        if (scrollTop > 300) {
          jQuery("header").addClass(
            "gen-header-sticky animated fadeInDown animate__faster"
          );
        } else {
          jQuery("header").removeClass(
            "gen-header-sticky animated fadeInDown animate__faster"
          );
        }
      });
    }

    jQuery("#gen-seacrh-btn").on("click", function () {
      jQuery(".gen-search-form").slideToggle();
      jQuery(".gen-search-form").toggleClass("gen-form-show");
      if (jQuery(".gen-search-form").hasClass("gen-form-show")) {
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
    // Inicialize o player Video.js
    var player = videojs("movie-player"); // Substitua 'your-video-element-id' pelo id do seu elemento de vídeo

    // Ouvinte de evento para detectar pressionamento de tecla
    document.addEventListener("keydown", function (event) {
      // Impede que outros elementos capturem o evento
      event.stopImmediatePropagation();

      // Pausar com a tecla Espaço
      if (event.code === "Space") {
        event.preventDefault(); // Previne rolagem da página
        if (player.paused()) {
          player.play();
        } else {
          player.pause();
        }
      }

      // Avançar 10 segundos com a seta direita
      if (event.key === "ArrowRight") {
        event.preventDefault();
        var currentTime = player.currentTime();
        player.currentTime(currentTime + 10); // Avança 10 segundos
      }

      // Retroceder 10 segundos com a seta esquerda
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        var currentTime = player.currentTime();
        player.currentTime(currentTime - 10); // Retrocede 10 segundos
      }

      // Aumentar volume com a seta para cima
      if (event.key === "ArrowUp") {
        event.preventDefault();
        let currentVolume = player.volume();
        player.volume(Math.min(currentVolume + 0.1, 1)); // Máximo de 1 (100%)
      }

      // Diminuir volume com a seta para baixo
      if (event.key === "ArrowDown") {
        event.preventDefault();
        let currentVolume = player.volume();
        player.volume(Math.max(currentVolume - 0.1, 0)); // Mínimo de 0 (mudo)
      }

      // Entrar ou sair da tela cheia com a tecla F
      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        const videoElement = player.el(); // Obtém o elemento do player
        if (document.fullscreenElement) {
          document.exitFullscreen(); // Sai da tela cheia
        } else if (videoElement) {
          videoElement.requestFullscreen(); // Entra em tela cheia
        }
      }
    });

    // Controle absoluto com o scroll (apenas em tela cheia)
    document.addEventListener("wheel", function (event) {
      event.stopImmediatePropagation(); // Garante que o evento seja tratado aqui primeiro

      // Verifica se o player está em tela cheia
      if (
        document.fullscreenElement &&
        document.fullscreenElement === player.el()
      ) {
        event.preventDefault(); // Previne outros comportamentos padrão do scroll

        // Pega o volume atual
        let currentVolume = player.volume();

        // Ajuste do volume: para cima aumenta, para baixo diminui
        if (event.deltaY < 0) {
          // Rolagem para cima aumenta o volume
          player.volume(Math.min(currentVolume + 0.1, 1)); // Máximo de 1 (100%)
        } else if (event.deltaY > 0) {
          // Rolagem para baixo diminui o volume
          player.volume(Math.max(currentVolume - 0.1, 0)); // Mínimo de 0 (mudo)
        }
      }
    });

    // Ocultar ambos os botões inicialmente
    jQuery("#back-to-top, #go-to-bottom").fadeOut();

    // Controle de visibilidade para os botões ao rolar a página
    jQuery(window).on("scroll", function () {
      // Mostra o botão 'back-to-top' se o usuário rolar mais de 250px
      if (jQuery(this).scrollTop() > 250) {
        jQuery("#back-to-top").fadeIn(1400);
      } else {
        jQuery("#back-to-top").fadeOut(400);
      }

      // Mostra o botão 'go-to-bottom' se o usuário ainda não está no fim da página
      if (
        jQuery(this).scrollTop() + jQuery(window).height() <
        jQuery(document).height() - 250
      ) {
        jQuery("#go-to-bottom").fadeIn(1400);
      } else {
        jQuery("#go-to-bottom").fadeOut(400);
      }
    });

    // Animação para 'scroll' até o topo ao clicar no 'back-to-top'
    jQuery("#top").on("click", function () {
      jQuery("body,html").animate(
        {
          scrollTop: 0,
        },
        800
      );
      return false;
    });

    // Animação para 'scroll' até o fundo ao clicar no 'go-to-bottom'
    jQuery("#bottom").on("click", function () {
      jQuery("body,html").animate(
        {
          scrollTop: jQuery(document).height(),
        },
        800
      );
      return false;
    });

    if (jQuery(".tv-show-back-data").length) {
      var url = jQuery(".tv-show-back-data").data("url");
      console.log(url);
      var html = "";
      html +=
        `<div class="tv-single-background">
                <img src="` +
        url +
        `">
            </div>`;
      jQuery("#main").prepend(html);
    }
  });
})(jQuery);

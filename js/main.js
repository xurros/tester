;
(function($) {

    "use strict";

    var isMobile;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    //Global varibles
    var _scrollTop = 0,
        _iso = false;


    $(window).load(function() {
        $('[class*="transition-"]').addClass('transition-active');
        $('.loader').addClass('loader-fade');

        $('.masonry').each(function() {
            var masonry = $(this).find('.masonry-container');

            _iso = masonry;
            masonry.on('layoutComplete', function() {
                masonry.addClass('masonry-active');
            });

            masonry.isotope({
                itemSelector: '.masonry-item',
                masonry: {
                    columnWidth: '.masonry-item'
                }
            });
        });

        $('.masonry-filters li').on('click', function() {
            var masonryFilter = $(this);
            var masonryContainer = masonryFilter.closest('.masonry').find('.masonry-container');
            var filterValue = '*';
            if (masonryFilter.attr('data-masonry-filter') !== '*') {
                filterValue = '.filter-' + masonryFilter.attr('data-masonry-filter');
            }
            $('.masonry-filters li').removeClass('active');
            masonryFilter.addClass('active');
            masonryContainer.removeClass('masonry-animate');
            masonryContainer.isotope({ filter: filterValue });
        });

    });

    $(document).ready(function() {
        // var scrollRevealOn = $('body').hasClass('scroll-reveal'),
        //     parallaxOn = $('body').hasClass('parallax-on');

        var parallaxOn = true;
        var scrollRevealOn = true;

        addEventListener('scroll', function() {
            _scrollTop = window.pageYOffset;
        }, false);

        initBackgroundImages();

        if (parallaxOn) {
            if ($('ul.slides li').hasClass('parallax')) {
                //init parallax when slider is ready
                $('ul.slides').on('initialized.owl.carousel', function() {
                    initParallax();
                })
            } else {
                initParallax();
            }

        }

        if (scrollRevealOn) { initScrollReveal(); }
        initOwlSliders();
        initInPageScroll();
        initVideos();
        initNavigation();
        initMagnific();
        initTabs();
        initSkillBars();
        // initGoogleMaps();
        initTwitterFeed();
        initNumberCounter();
        
        // Masonry
        $('.masonry').each(function() {
            var masonry = $(this);
            var masonryContainer = masonry.find('.masonry-container'),
                filters = masonry.find('.masonry-filters'),
                // data-filter-all-text can be used to set the word for "all"
                filterAllText = typeof filters.attr('data-filter-all-text') !== typeof undefined ? filters.attr('data-filter-all-text') : "All",
                filtersList;

            // If a filterable masonry item exists
            if (masonryContainer.find('.masonry-item[data-masonry-filter]').length) {

                // Create empty ul for filters
                filters.append('<ul></ul>');
                filtersList = filters.find('> ul');

                // Add a filter "all" option
                filtersList.append('<li class="active" data-masonry-filter="*">' + filterAllText + '</li>');

                // To avoid cases where user leave filter attribute blank
                // only take items that have filter attribute
                masonryContainer.find('.masonry-item[data-masonry-filter]').each(function() {
                    var masonryItem = $(this),
                        filterString = masonryItem.attr('data-masonry-filter'),
                        filtersArray = [];

                    // If not undefined or empty
                    if (typeof filterString !== typeof undefined && filterString !== "") {
                        // Split tags from string into array 
                        filtersArray = filterString.split(',');
                    }
                    jQuery(filtersArray).each(function(index, tag) {
                        // Add the filter class to the masonry item
                        masonryItem.addClass('filter-' + tag);

                        // If this tag does not appear in the list already, add it
                        if (!filtersList.find('[data-masonry-filter="' + tag + '"]').length) {
                            filtersList.append('<li data-masonry-filter="' + tag + '">' + tag + '</li>');

                        }
                    });
                });
            }
            //End of "if filterable masonry item exists"
        });

        //// transition
        $('a:not(.lightbox):not(.gallery):not([href^="#"]):not([href^="tel"]):not([href^="mailto"]):not([href=""]):not([target="_blank"])').on('click', function() {
            $('[class*="transition-"]').removeClass('transition-active');
        });

        ////load gmaps api 
        // Load Google MAP API JS with callback to initialise when fully loaded
        if (document.querySelector('[data-maps-api-key]') && !document.querySelector('.gMapsAPI')) {
            if ($('[data-maps-api-key]').length) {
                var script = document.createElement('script');
                var apiKey = $('[data-maps-api-key]:first').attr('data-maps-api-key');
                script.type = 'text/javascript';
                script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=initGoogleMaps';
                script.className = 'gMapsAPI';
                document.body.appendChild(script);
            }
        }
    });

    ////// init videos
    function initVideos() {
        $('.local-video-container').find('.btn-play').on('click', function() {
            $(this).siblings('.image-holder').css('z-index', -1);
            $(this).css('opacity', 0);
            $(this).siblings('video').get(0).play();
        })

    }


    function initScrollReveal() {
        window.sr = ScrollReveal();
        var selectors = 'section:not(.masonry):not(:first-of-type):not(.parallax):not(.bg-dark):not(.image-square)';
        var revealTiming = 1000;
        window.sr.reveal('' + selectors + '', { viewFactor: 0.1, duration: '' + revealTiming + '', scale: 1, mobile: false });
    }

    ////// init background images
    function initBackgroundImages() {
        var bgSection = $(".image-holder, .parallax");
        bgSection.each(function() {
            if ($(this).attr("data-background")) {
                $(this).css("background-image", "url(" + $(this).data("background") + ")");
            }
        });
    }


    //////  init navigation
    function initNavigation() {

        var nav = $('body .nav-container nav:first'),
            navOuterHeight = $('body .nav-container nav:first').outerHeight(),
            firstSectionHeight = $('body section:nth-of-type(1)').first().outerHeight(true),
            navScrolled = false,
            navFixed = false,
            navHidden = false;

        if (!$('nav').hasClass('fixed') && !$('nav').hasClass('absolute')) {

            // Make nav container height of nav
            $('.nav-container').css('min-height', $('nav').outerHeight(true));

            $(window).resize(function() {
                $('.nav-container').css('min-height', $('nav').outerHeight(true));
            });

        }

        if ($('nav').hasClass('bg-dark')) {
            $('.nav-container').addClass('bg-dark');
        }

        if (window.pageYOffset > firstSectionHeight)
            $('nav').addClass('fixed').addClass('nav-hidden');

        // Fix nav to top while scrolling
        window.addEventListener("scroll", updateNav, false);

        // Menu dropdown positioning
        $('.menu > li > ul').each(function() {
            var menu = $(this).offset();
            var farRight = menu.left + $(this).outerWidth(true);
            if (farRight > $(window).width() && !$(this).hasClass('mega-menu')) {
                $(this).addClass('make-right');
            } else if (farRight > $(window).width() && $(this).hasClass('mega-menu')) {
                var isOnScreen = $(window).width() - menu.left;
                var difference = $(this).outerWidth(true) - isOnScreen;
                $(this).css('margin-left', -(difference));
            }
        });

        // Mobile Menu
        $('.mobile-toggle').on('click', function() {
            $('.nav-bar').toggleClass('nav-open');
            $(this).toggleClass('active');
        });

        $('.menu li').on('click', function(e) {
            if (!e) e = window.event;
            e.stopPropagation();
            if ($(this).find('ul').length) {
                $(this).toggleClass('toggle-sub');
            } else {
                $(this).parents('.toggle-sub').removeClass('toggle-sub');
            }
        });

        $('.nav-block.nav-widget').on('click', function() {
            $(this).toggleClass('toggle-widget');
        });

        $('.search-form input, .search-form button').on('click', function(e) {
            if (!e) e = window.event;
            e.stopPropagation();
        });

        /*Search popup*/
        $('.search-widget').on('click', function(e) {
            $('.search-popup').fadeIn();
            $('.search-popup input').focus();

            $('.search-popup').on('click', function(event) {
                $('.search-popup').fadeOut();
            });
            e.preventDefault();
        });

        /*offsecrren menu*/
        $('.offscreen-toggle').on('click', function() {
            $('.nav-bar').toggleClass('exit');
            $('.offscreen-cont').fadeToggle();
            $('.offscreen-cont').toggleClass('nav-is-open');
        });

        if ($('.offscreen-toggle').length) {
            addEventListener('scroll', function() {

                if ($('.offscreen-cont').hasClass('nav-is-open')) {
                    $('.nav-bar').toggleClass('exit');
                    $('.offscreen-cont').fadeToggle();
                    $('.offscreen-cont').toggleClass('nav-is-open');
                }
            }, false);
        }

        function updateNav() {

            var scrollY = _scrollTop;

            if (scrollY <= 0) {
                if (navFixed) {
                    navFixed = false;
                    nav.removeClass('fixed');
                }
                if (navHidden) {
                    navHidden = false;
                    nav.removeClass('nav-hidden');
                }
                if (navScrolled) {
                    navScrolled = false;
                    nav.removeClass('scrolled');
                }
                return;
            }

            if (scrollY > firstSectionHeight) {
                if (!navScrolled) {
                    nav.addClass('scrolled');
                    navScrolled = true;
                    return;
                }
            } else {
                if (scrollY > firstSectionHeight - 200) {
                    if (!navFixed) {
                        nav.addClass('fixed');
                        navFixed = true;
                    }

                    if (scrollY > firstSectionHeight - 100) {
                        if (!navHidden) {
                            nav.addClass('nav-hidden');
                            navHidden = true;
                        }
                    } else {
                        if (navHidden) {
                            navHidden = false;
                            nav.removeClass('nav-hidden');
                        }
                    }
                } else {
                    if (navFixed) {
                        navFixed = false;
                        nav.removeClass('fixed');
                    }
                    if (navHidden) {
                        navHidden = false;
                        nav.removeClass('nav-hidden');
                    }
                }

                if (navScrolled) {
                    navScrolled = false;
                    nav.removeClass('scrolled');
                }

            }
        }
    }

    //////  init Magnific Popup plagin
    function initMagnific() {
        $('.gallery').magnificPopup({
            tLoading: '',
            gallery: {
                enabled: true
            },
            mainClass: "mfp-fade"
        });

        $('.magnific, .lightbox').magnificPopup({
            tLoading: ''
        });
    }

    ////// init tabs
    function initTabs() {
        $('.tabbed-content').each(function() {
            if (!$('li', this).eq(0).hasClass('active') || !$('li', this).eq(2).hasClass('active') || !$('li', this).eq(3).hasClass('active') || !$('li', this).eq(4).hasClass('active')) {
                $('li', this).eq(0).addClass('active');
            }

            $(this).append('<ul class="content"></ul>');
        });

        $('.tabs li').each(function() {
            var originalTab = $(this),
                activeClass = "";
            if (originalTab.is('.tabs>li:first-child')) {
                activeClass = ' class="active"';
            }
            var tabContent = originalTab.find('.tab-content').detach().wrap('<li' + activeClass + '></li>').parent();
            originalTab.closest('.tabbed-content').find('.content').append(tabContent);
        });

        $('.tabs li').on('click', function() {
            $(this).closest('.tabs').find('li').removeClass('active');
            $(this).addClass('active');
            var liIndex = $(this).index() + 1;
            $(this).closest('.tabbed-content').find('.content>li').removeClass('active');
            $(this).closest('.tabbed-content').find('.content>li:nth-of-type(' + liIndex + ')').addClass('active');
        });

    }

    ////// init owl sliders
    function initOwlSliders() {

        var sliders = [];

        $('.slider').each(function() {
            var candidate = $(this);

            if (candidate.find('.slides').length) {
                return true;
            } else {
                var children = [];
                var childCount = candidate.find('>*').length;
                candidate.children().each(function(index) {
                    children.push($(this).wrap('li').parent());
                });
                $('<ul class="slides"></ul>').append(children).appendTo(candidate);
            }
        });

        $('.slider').each(function(index) {

            var slider = $(this);

            var sliderInitializer = $(this).find('ul.slides'),
                items = 1,
                arrows = false,
                paging = false,
                timing = 7000,
                loop = false,
                animation = 'fade',
                autoplay = true;
            if (slider.attr('data-arrows') == 'true') {
                arrows = true;
            } else {
                arrows = false;
            }
            if (slider.attr('data-autoplay') == 'false') {
                autoplay = false;
            } else {
                autoplay = true;
            }
            if (slider.attr('data-pagination') == 'true' && sliderInitializer.find('li').length > 1) {
                paging = true;
            } else {
                paging = false;
            }

            if (slider.attr('data-timing')) {
                timing = slider.attr('data-timing');
            }
            if (slider.attr('data-items')) {
                items = slider.attr('data-items');
            }
            if (slider.attr('data-animation')) {
                animation = slider.attr('data-animation');
            }
            if (sliderInitializer.find('li').length > 1) {
                loop = true;
            }

            sliderInitializer.addClass('owl-carousel');
            sliders.push(sliderInitializer);
            sliders[index].owlCarousel({
                animateIn: false,
                animateOut: false,
                nav: arrows,
                dots: paging,
                dotsSpeed: 500,
                navSpeed: 500,
                items: items,
                autoplay: autoplay,
                autoplayTimeout: timing,
                navText: false,
                loop: loop,
                mouseDrag: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: false
                    },
                    768: {
                        items: items
                    }
                }
            });
        });

    }

    ////// init skill bars
    function initSkillBars() {
        var progressBar = $(".chartbox-bar-progress");

        if (progressBar.length) {
            if ($(window).width() >= 768) {
                progressBar.eq(0).waypoint(function() {
                    progressBar.each(function() {
                        var el = $(this);
                        el.width(el.data("progress"));
                    });

                }, {
                    offset: "95%"
                });
            } else {
                progressBar.each(function() {
                    var el = $(this);
                    el.width(el.data("progress"));
                });
            }
        }
    }

    ////// init google maps
    window.initGoogleMaps = function() {
        if (typeof google !== "undefined") {
            if (typeof google.maps !== "undefined") {
                $('.map-canvas[data-maps-api-key]').each(function() {
                    var mapInstance = this,
                        mapJSON = typeof $(this).attr('data-map-style') !== "undefined" ? $(this).attr('data-map-style') : false,
                        mapStyle = JSON.parse(mapJSON) || [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }],
                        zoomLevel = (typeof $(this).attr('data-map-zoom') !== "undefined" && $(this).attr('data-map-zoom') !== "") ? $(this).attr('data-map-zoom') * 1 : 17,
                        latlong = typeof $(this).attr('data-latlong') != "undefined" ? $(this).attr('data-latlong') : false,
                        latitude = latlong ? 1 * latlong.substr(0, latlong.indexOf(',')) : false,
                        longitude = latlong ? 1 * latlong.substr(latlong.indexOf(",") + 1) : false,
                        geocoder = new google.maps.Geocoder(),
                        address = typeof $(this).attr('data-address') !== "undefined" ? $(this).attr('data-address').split(';') : false,
                        markerTitle = "We Are Here",
                        isDraggable = $(document).width() > 766 ? true : false,
                        map, marker, markerImage,
                        mapOptions = {
                            draggable: isDraggable,
                            scrollwheel: true,
                            zoom: zoomLevel,
                            disableDefaultUI: true,
                            styles: mapStyle
                        };

                    if ($(this).attr('data-marker-title') != undefined && $(this).attr('data-marker-title') != "") {
                        markerTitle = $(this).attr('data-marker-title');
                    }

                    if (address != undefined && address[0] != "") {
                        geocoder.geocode({ 'address': address[0].replace('[nomarker]', '') }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                var map = new google.maps.Map(mapInstance, mapOptions);
                                map.setCenter(results[0].geometry.location);

                                address.forEach(function(address) {
                                    var markerGeoCoder;

                                    markerImage = { url: window.mr_variant == undefined ? 'images/logotype/location.png' : '../images/location.png', size: new google.maps.Size(30, 48), scaledSize: new google.maps.Size(30, 48) };
                                    if (/(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/.test(address)) {
                                        var latlong = address.split(','),
                                            marker = new google.maps.Marker({
                                                position: { lat: 1 * latlong[0], lng: 1 * latlong[1] },
                                                map: map,
                                                icon: markerImage,
                                                title: markerTitle,
                                                optimised: false
                                            });
                                    } else if (address.indexOf('[nomarker]') < 0) {
                                        markerGeoCoder = new google.maps.Geocoder();
                                        markerGeoCoder.geocode({ 'address': address.replace('[nomarker]', '') }, function(results, status) {
                                            if (status == google.maps.GeocoderStatus.OK) {
                                                marker = new google.maps.Marker({
                                                    map: map,
                                                    icon: markerImage,
                                                    title: markerTitle,
                                                    position: results[0].geometry.location,
                                                    optimised: false
                                                });
                                            }
                                        });
                                    }

                                });
                            } else {
                                console.log('There was a problem geocoding the address.');
                            }
                        });
                    } else if (latitude != undefined && latitude != "" && latitude != false && longitude != undefined && longitude != "" && longitude != false) {
                        mapOptions.center = { lat: latitude, lng: longitude };
                        map = new google.maps.Map(mapInstance, mapOptions);
                        marker = new google.maps.Marker({
                            position: { lat: latitude, lng: longitude },
                            map: map,
                            icon: markerImage,
                            title: markerTitle
                        });

                    }

                });
            }
        }
    }

    initGoogleMaps();

    ////// init jarallax plugin | parallax
    function initParallax() {
        if (!isMobile) {
            $('.parallax').jarallax({
                speed: 0.2
            });
        }
    }

    ////// init tweeter fetcher
    function initTwitterFeed() {
        // Twitter Feed
        $('.tweets-feed').each(function(index) {
            $(this).attr('id', 'tweets-' + index);
        }).each(function(index) {

            function handleTweets(tweets) {
                var x = tweets.length;
                var n = 0;
                var element = document.getElementById('tweets-' + index);
                var html = '<ul class="slides">';
                while (n < x) {
                    html += '<li>' + tweets[n] + '</li>';
                    n++;
                }
                html += '</ul>';
                element.innerHTML = html;
                return html;
            }

            var configFetch = {
                id: $('#tweets-' + index).attr('data-widget-id'),
                dotId: "",
                maxTweets: $("#tweets-" + index).attr("data-amount"),
                enableLinks: true,
                showUser: true,
                showTime: true,
                dateFunction: "",
                showRetweet: false,
                customCallback: handleTweets
            }

            twitterFetcher.fetch(configFetch);

        });

    }

    ////// init Smooth scrolling for in page links
    function initInPageScroll() {

        var $root = $("html, body"),
            $smoothScrollAnchor = $(".local-scroll, .scroll-nav > li > a");

        $smoothScrollAnchor.on("click", function(event) {
            var href = $.attr(this, "href"),
                anchorPosition = 0;

            anchorPosition = (href === '#go') ? $('section:nth-of-type(2)').offset().top : anchorPosition = $(href).offset().top;

            $root.animate({
                scrollTop: anchorPosition
            }, 1000, "easeInCubic");
            // event.preventDefault();
            return false;
        });
    }

    ////// init number counter 
    function initNumberCounter() {
        if (!isMobile) {
            var counterSelector = $('.counter');
            if (counterSelector.length) {
                counterSelector.counterUp({
                    delay: 10,
                    time: 800
                });
            }
        }
    };


    /*
     * Helper function
     */

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    // Ease In Cubic animate for scrooll
    $.extend($.easing, {
        easeInCubic: function(x) {
            return x * x * x;
        }
    });

})(jQuery);

// Style changer
$(document).ready(function(){
    if (!($("html").hasClass("mobile"))){

        $('.btn-changer').on('click', function(){
            $(this).parent().toggleClass('open');
        })

        $('.color-changer a').on('click', function(){
            var style = $(this).attr('data-style');
            $('#theme').attr('href', 'css/theme/' + style + '.css');
            return false;
        })

        $('a.btn-ch-navbar').on('click', function(){
            var newNav = $(this).attr('data-navbar');
            var nav = $('nav');
            if($(this).hasClass('disabled') || nav.hasClass(newNav))
                return false

            $('a.btn-ch-navbar').removeClass('disabled')
            
            $(this).addClass('disabled')

            if(!nav.hasClass('bg-dark')) {
                nav.removeClass('bg-white')
                nav.addClass('bg-dark')
                nav.parent().addClass('bg-dark');
            }
            else {
                nav.removeClass('bg-dark')
                nav.parent().removeClass('bg-dark')
                nav.addClass('bg-white')
            }

            return false;
        })


    }
});


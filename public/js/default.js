$('.navbar-toggler').on('click',()=>{
    $('#navbarSupportedContent').slideToggle('300')
})

$('.dropdown-toggle').on('click',()=>{
    $('.dropdown-menu').slideToggle()
})

$(document).ready(function() {
    if(window.innerWidth<768){
        $('.home-img').addClass('img-fluid');

       $('#home-card a .card .card-body').removeClass('card-body').addClass('card-img-overlay');

       $('#home-card a .card, #home-card a .card img').addClass('rounded-0');
    }

    $(document).on('click', function(e){
        if(!$('.dropdown').is(e.target)&& $('.dropdown').has(e.target).length === 0){
            $('.dropdown-menu').slideUp()
        }

        if(!$('header').is(e.target)&& $('header').has(e.target).length === 0 && window.innerWidth<768){
            $('#navbarSupportedContent').slideUp('300')
        }
    })

    let currentPath = window.location.pathname.replace(/\/$/, ''); 
    $('.nav-link').each(function() {
        let href = $(this).attr('href');
        if (!href) return;

        let linkPath = $(this).attr('href').replace(/\/$/, '');

        if(href ==='#contact' && window.innerWidth<768){
            $(this).click(()=>{
                $('#navbarSupportedContent').slideUp()
            })
        }
        else if (href === '#blog') {
            if (currentPath === '/blog' || currentPath === '/create-blog') {
                $(this).addClass('active');
            }
        } 
        else if (currentPath === linkPath) {
            $(this).addClass('active');
        }
    });
});


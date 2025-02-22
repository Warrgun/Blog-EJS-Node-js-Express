$('.navbar-toggler').on('click',()=>{
    $('#navbarSupportedContent').slideToggle('300')
})

$('.dropdown-toggle').on('click',()=>{
    $('.dropdown-menu').slideToggle()
})

$(document).ready(function() {
    let currentPath = window.location.pathname.replace(/\/$/, ''); 
    $('.nav-link').each(function() {
        let href = $(this).attr('href');
        if (!href) return;

        let linkPath = $(this).attr('href').replace(/\/$/, '');

        if(href ==='#contact'){
            $('.dropdown-menu').slideUp()
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

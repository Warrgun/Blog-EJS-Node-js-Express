$('.navbar-toggler').on('click',()=>{
    $('#navbarSupportedContent').slideToggle('300')
})

$('.dropdown-toggle').on('click',()=>{
    $('.dropdown-menu').slideToggle()
})

$(document).ready(function() {
    let inputFile = $('input[type="file"]')
    let label = $('#file-content')
    let prevLabel = label.html();

    inputFile.on('change', function(e){
        let fileName = '';
        if(e.target.value){
            fileName=e.target.value.split('\\').pop();

            label.addClass('ms-4');
            $('.file-name-wrap .bi-check').removeClass('d-none').addClass('d-inline');
        }
        else{
            label.removeClass('ms-4');
            $('.file-name-wrap .bi-check').removeClass('d-inline').addClass('d-none');
        }
        !fileName? label.html(prevLabel): fileName.length >45?label.html(fileName.slice(0,45)+"..."): label.html(fileName);
    })

    $('.list-group-item').each(function(){
        let item = $(this);
        let checkLast = item.children("span").text().trim() === "Design";
        let designText = 'modern'

        if(!checkLast){
            item.on('click',function(){
                let prev = $('.list-group-item').filter('.bg-light');

                if($(this).attr('class') !== prev.attr('class')){
                    prev.removeClass("bg-light").addClass('lh-condensed hover-effect')
                    prev.find('.text-success').removeClass('text-success').children('small').addClass('text-muted')

                    $(this).addClass("bg-light").removeClass('lh-condensed hover-effect')
                    $(this).children('div').addClass('text-success').children('small').removeClass('text-muted')
                    
                    designText = prev.children('div').find('h6').text();
                    item.children("strong").text(designText)
                }
            })
        }
        else{
            
        }
    })

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


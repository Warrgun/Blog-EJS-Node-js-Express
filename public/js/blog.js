

$('.delete-blog').on('click',function(){
    const blogId=$(this).data('id');
    if(confirm('Are you sure you want to delete this blog?')){
        axios.delete(`/blog/${blogId}`)
            .then(response => {
                console.log('🗑️ Blog deleted:', response.data);
                window.location.href='/';
            })
            .catch(error => {
                console.error('❌ Error deleting blog:', error)
                window.location.reload();
            });
    }
    
})

$(document).ready(function(){
    $('.navbar-toggler').on('click',()=>{
        $('#navbarSupportedContent').slideToggle('300')
    })

    $(document).on('click', function(e){
        if(!$('nav').is(e.target)&& $('nav').has(e.target).length === 0 && window.innerWidth<768){
            $('#navbarSupportedContent').slideUp('300')
        }
    })

    let content = $('#blogContent').html();
    content = content.replace(/&nbsp;/g, ' ');
    $('#blogContent').html(content);

    const style = $('body').data('style')

    if(style==='modern'){
        $('.background').css('background',`url(${$('.background').data('bg')})`)
    }
    else if(style ==='subtle'){
        let scrollTimeout

        $('.max-width').on('scroll', ()=>{
            $(':root').css('--background','rgba(0,0,0,0.2)')

            clearTimeout(scrollTimeout)

            scrollTimeout= setTimeout(()=>{
                $(':root').css('--background','rgba(0,0,0,0)')
            },300)
        })
    }
    else if(style === 'magazine'){
        $('.heading').parent().removeClass('d-flex flex-grow-1 justify-content-center align-items-center px-3 px-md-5').addClass('container px-0 px-2 px-md-0')
        $('#blogContent').removeClass('px-4').addClass('px-2')

        const imageSize = ['40%','50%','60%','100%'];
        const img=$('#blogContent img')
        img.each(function(){
            const random= Math.floor(Math.random()*100)%2;
            const randomSize =Math.floor(Math.random()*4);
            const currentImage = $(this);

            currentImage.addClass(`${random%2===0?'float-left':'float-right'}`)
            $(window).on('resize load',function(){
                if(window.innerWidth>420){
                    currentImage.css('max-width',`${imageSize[randomSize]}`)
                    currentImage.removeClass('w-100')
                }
                else{
                    currentImage.addClass('w-100')
                }
            })
        })
    }
    else if(style === 'retro'){
        $('.heading').parent().removeClass(' justify-content-center px-3 px-md-5').addClass('container px-0 px-2 px-md-0')
        $('.heading').removeClass('mx-auto text-center px-5')
    }
})




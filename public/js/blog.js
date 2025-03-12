

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

    let content = document.querySelector('#blogContent').innerHTML;
    content = content.replace(/&nbsp;/g, ' ');
    document.querySelector('#blogContent').innerHTML = content;

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
        const img=$('#blogContent img')
        img.each(function(){
            const random= Math.floor(Math.random()*100)%2;

            $(this).addClass(random%2===0?'float-left':'float-right')
        })
    }
})




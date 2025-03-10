

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

})




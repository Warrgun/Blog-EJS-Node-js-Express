
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




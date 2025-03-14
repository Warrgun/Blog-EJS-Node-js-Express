// const blogHTML = `<!DOCTYPE html>
// <html lang="en" class="h-100">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
//     <link rel="stylesheet" href="/styles/${newDesignText}.css">
//     <title><%=blog.title %></title>
// </head>
// <body class="bg-body-tertiary d-flex flex-column h-100" data-style="${newDesignText}">
//     <div class="background text-bg-dark mb-5 flex-shrink-0" data-bg="${thumbNail}">
//       <div class="filter h-100 d-flex flex-column">
//         <nav class="navbar navbar-expand-md navbar-dark">
//           <div class="container">
//             <a class="navbar-brand fancy-font" href="#">BLOG</a>
//             <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//               <span class="navbar-toggler-icon"></span>
//             </button>
//             <div class="collapse navbar-collapse" id="navbarSupportedContent">
//               <ul class="navbar-nav me-auto mb-2 mb-lg-0">
//                 <li class="nav-item">
//                   <a class="nav-link" href="/">Home</a>
//                 </li>
//                 <li class="nav-item">
//                   <a class="nav-link" href="/blog">Other Blogs</a>
//                 </li>
//                 <li class="nav-item">
//                   <a class="nav-link" href="/create-blog">Create</a>
//                 </li>
//               </ul>
//               <form class="d-flex" role="search">
//                 <button class="btn btn-outline-success me-2">Update</button>
//                 <button class="btn btn-outline-danger delete-blog" data-id="">Delete</button>
//               </form>
//             </div>
//           </div>
//         </nav>
//         <div class="d-flex flex-grow-1 justify-content-center align-items-center pt-3 px-3 pt-md-5 px-md-5" >
//           <div class="my-3 py-3 px-5 text-center mx-auto heading">
//             <h2 class="display-5" >${title}</h2>
//             <p class="lead text-shadow">${description.length>200? description.slice(0,description.lastIndexOf(" ",200))+'...': description }</p>
//           </div>
//           <div class="thumbnail-container">
//               <img src="${thumbNail}" alt="thumbnail">
//           </div>
//         </div>
//       </div>
//     </div>
//     <div id="blogContent" class=" container max-width py-5 text-wrap default-font flex-shrink-0 px-4 px-md-0">
//       <small class="text-muted">${today.getDate()<10?new String(0)+today.getDate():today.getDate()}-${(today.getMonth()+1)<10?new String(0)+(today.getMonth()+1):today.getMonth()+1}-${today.getFullYear()}</small>
//       <div class="grid">${html}</div>
//     </div>
//     <footer class="footer mt-auto py-3">
//       <div class="container">
//         <span class="text-body-secondary">${today.getDate()<10?new String(0)+today.getDate():today.getDate()}-${(today.getMonth()+1)<10?new String(0)+(today.getMonth()+1):today.getMonth()+1}-${today.getFullYear()}: ${title}</span>
//       </div>
//     </footer>
//     <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
//     <script
//   src="https://code.jquery.com/jquery-3.7.1.js"
//   integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
//   crossorigin="anonymous"></script>
//   <script src="/js/blog.js"></script>
// </body>
// </html>
// `


$('.navbar-toggler').on('click',()=>{
    $('#navbarSupportedContent').slideToggle('300')
})

$('.dropdown-toggle').on('click',()=>{
    $('.dropdown-menu').slideToggle()
})


$(document).ready(function() {
    $(document).on('shown.bs.modal', '.modal', function () {
        $('#nightMode').addClass('d-none'); // Hide when modal is shown
    });

    $(document).on('shown.bs.modal', '.modal', function () {
        $('#nightMode').removeClass('d-none'); // Show when modal is hidden
    });

   $('#get-html-btn').on('click',function(){
        var iframe = document.getElementById('previewFrame');
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        iframeDoc.open();
        // iframeDoc.write(blogHTML);
        iframeDoc.close();

        $('#previewModal').modal('show')
   })
   

    if(Cookies.get('nightmode')==="true"){
        $('#darkSwitch').prop('checked', true);
        $(document.documentElement).attr('data-bs-theme','dark')
    }
    else{
        $('#darkSwitch').prop('checked', false);
        $(document.documentElement).attr('data-bs-theme','light')
    }

    $('#darkSwitch').on('change', function(){
        let isDark =$(this).prop('checked')
        Cookies.set('nightmode',isDark,{path:'/'})
        $(document.documentElement).attr('data-bs-theme', isDark ? 'dark' : 'light');
    })

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

    let newDesignText = ''

    $('.list-group-item').each(function(){
        let item = $(this);
        let checkLast = item.children("span").text().trim() === "Design";

        if(!checkLast){
            item.on('click',function(){
                let prev = $('.list-group-item.bg-light')

                if(!$(this).is(prev)){
                    prev.removeClass("bg-light").addClass('lh-condensed hover-effect')
                    prev.find('.text-primary').removeClass('text-primary').children('small').addClass('text-muted')

                    $(this).addClass("bg-light").removeClass('lh-condensed hover-effect')
                    $(this).children('div').addClass('text-primary').children('small').removeClass('text-muted')
                    
                    newDesignText = $(this).data('design');

                    $('.list-group-item').filter(function(){
                        return $(this).children('span').text().trim() === "Design";
                    }).children("strong").text(newDesignText);

                    if(newDesignText ==='magazine'){
                        $('.disclaimer').removeClass('d-none').addClass('d-block');
                    }else{
                        $('.disclaimer').addClass('d-none').removeClass('d-block');
                    }
                }
            })

        }
        else{
            let prev = $('.list-group-item.bg-light')
            newDesignText = prev.data('design');
            item.children("strong").text(newDesignText);

            if(newDesignText ==='magazine'){
                $('.disclaimer').removeClass('d-none').addClass('d-block');
            }else{
                $('.disclaimer').addClass('d-none').removeClass('d-block');
            }

        }
        
    })


    $('#new-blog').on('submit', e=>{
      e.preventDefault();
      const html = quill? quill.getSemanticHTML(): "";
      const text = quill? quill.getText(0,400): "";

      const formData = new FormData(e.target)
      formData.append('design', newDesignText);
      formData.append('content', html);
      formData.append('description', text)

      axios.post('/create-blog', formData,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
      })
      .then(function (response) {
        if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl; 
          }
      })
      .catch(function (error) {
        console.log(error);
        const errors = error.response?.data || {};
            $('small.text-danger').each(function() {
            const field = $(this).data('field'); 
            $(this).text(errors[`${field}Err`] || '');
         });
         const firstError = $('small.text-danger:visible').first();
            if (firstError.length) {
                firstError.get(0).scrollIntoView()
            }
      });
    } )

    const paginationElements=parseInt($('.pagination').data('pages'),10)

    const currentPage=parseInt($('.pagination').data('current'),10)

    $('.pagination .page-item').first().toggleClass('disabled', currentPage === 1);
    if($('.pagination .page-item').first().hasClass('disabled')) $('.pagination .page-item').first().removeClass('cursor')
    $('.pagination .page-item').last().toggleClass('disabled', currentPage === paginationElements);
    if($('.pagination .page-item').last().hasClass('disabled')) $('.pagination .page-item').last().removeClass('cursor')


    for(let i=1;i<=paginationElements;i++){
        let element=$('<li>',{class:`page-item ${i === currentPage?'active':'cursor'}`,'data-id':i,}).append($('<span>',{
            class:'page-link',
            text: i, 
            'aria-label': `Go to page ${i}`
        }));

        $('.pagination .page-item').last().before(element);
    }

    $(document).on('click', '.pagination .page-item', function () {
        if ($(this).hasClass('disabled') || $(this).hasClass('active')) return;
        getPageFunc(parseInt($(this).data('id')||$(this).data('page'), 10));
        if(window.innerWidth > 768){
            $(document).scrollTop( 250 );
        }
        else{
            $(document).scrollTop( 100 );
        }
    });

    

    const getPageFunc = e=>{
        axios.get("/blog",{
            params:{
                p:e
            }
        })
            .then(response=>{
                console.log(response)
                $('#blog-section').html($(response.data).find('#blog-section').html());
                updatePaginationUI(e);
                window.history.pushState({}, '', `/blog?p=${e}`);
            })
            .catch(error =>{
                console.error(error)
            })
    };

    function updatePaginationUI(newPage) {
        $('.pagination .page-item').removeClass('active').addClass('cursor');
        $(`.pagination .page-item[data-id=${newPage}]`).addClass('active').removeClass('cursor');
        $('.pagination .page-item').first().toggleClass('disabled', newPage === 1);
        if($('.pagination .page-item').first().hasClass('disabled')) $('.pagination .page-item').first().removeClass('cursor')

        $('.pagination .page-item').last().toggleClass('disabled', newPage === paginationElements);
        if($('.pagination .page-item').last().hasClass('disabled')) $('.pagination .page-item').last().removeClass('cursor')
    }

    window.addEventListener('popstate', function (event) {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('p') || 1; 
    
        getPageFunc(page); 
    });
    


    $(window).on('resize load', function() {
        if (window.innerWidth < 768) {
            $('#home-card a .card').removeClass('h-100')
            $('#home-card a .card .card-body')
                .removeClass('card-body')
                .addClass('card-img-overlay');
            
            $('#home-card a .card, #home-card a .card img')
                .addClass('rounded-0');
        } else {
            $('#home-card a .card').addClass('h-100')
            $('.home-img').removeClass('img-fluid');
            $('#home-card a .card .card-img-overlay')
                .removeClass('card-img-overlay')
                .addClass('card-body');
            
            $('#home-card a .card, #home-card a .card img')
                .removeClass('rounded-0');
        }
    });
    
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
        if ($(this).hasClass('dropdown-toggle')) {
            $(this).on('click', function(event) {
                event.preventDefault();
            });        
        }

        let href = $(this).attr('href');
        if (!href) return;

        let linkPath = $(this).attr('href').replace(/\/$/, '');

        if(href ==='#contact' && window.innerWidth<768){
            $(this).click(()=>{
                $('#navbarSupportedContent').slideUp()
            })
        }
        else if (href === '#bloger') {
            if (currentPath === '/blog' || currentPath === '/create-blog') {
                $(this).addClass('active');
            }
        } 
        else if (currentPath === linkPath) {
            $(this).addClass('active');
        }
    });
    
    const toolbar=$('.ql-toolbar')
    if(toolbar.length) toolbar.addClass('position-sticky top-0 z-1');
});

if($('#editor').length){
    var quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Start typing your blog here...',
        modules: {
          toolbar: [
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }],
            ['link', 'image', 'video'],
            ['clean'] 
          ] 
        }
    });
}



const getGeneratedPageURL = (data) => {
    const getBlobURL = (code, type) => {
      const blob = new Blob([code], { type })
      return URL.createObjectURL(blob)
    }
  
    const cssURL =`http://localhost:3000//styles/${data.design}.css`
    const title = DOMPurify.sanitize(data.title);
    const description = DOMPurify.sanitize(data.description)
    const content = DOMPurify.sanitize(data.content)
  
    const blogHTML = `<!DOCTYPE html>
    <html lang="en" class="h-100">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <link rel="stylesheet" href="${cssURL}">
        <title>${title}</title>
    </head>
    <body class="bg-body-tertiary d-flex flex-column h-100" data-style="${data.design}">
        <div class="background text-bg-dark mb-5 flex-shrink-0" data-bg="${data.thumbNail}">
        <div class="filter h-100 d-flex flex-column">
            <nav class="navbar navbar-expand-md navbar-dark invisible">
            <div class="container">
                <a class="navbar-brand fancy-font" href="#">BLOG</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/blog">Other Blogs</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/create-blog">Create</a>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <button class="btn btn-outline-success me-2">Update</button>
                    <button class="btn btn-outline-danger delete-blog" data-id="">Delete</button>
                </form>
                </div>
            </div>
            </nav>
            <div class="d-flex flex-grow-1 justify-content-center align-items-center pt-3 px-3 pt-md-5 px-md-5" >
            <div class="my-3 py-3 px-5 text-center mx-auto heading">
                <h2 class="display-5" >${title}</h2>
                <p class="lead text-shadow">${description.length>200? description.slice(0,description.lastIndexOf(" ",200))+'...': description }</p>
            </div>
            <div class="thumbnail-container">
                <img src="${data.thumbNail}" alt="thumbnail">
            </div>
            </div>
        </div>
        </div>
        <div id="blogContent" class=" container max-width py-5 text-wrap default-font flex-shrink-0 px-4 px-md-0">
        <small class="text-muted">${data.date}</small>
        <div class="grid">${content}</div>
        </div>
        <footer class="footer mt-auto py-3">
        <div class="container">
            <span class="text-body-secondary">${data.date}</span>
        </div>
        </footer>
        <script
    src="https://code.jquery.com/jquery-3.7.1.js"
    integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
    crossorigin="anonymous"></script>
    <script>
            $(document).ready(function () {
                // Replace &nbsp; with spaces
                let content = $('#blogContent').html();
                content = content.replace(/&nbsp;/g, ' ');
                $('#blogContent').html(content);

                const style = $('body').data('style');

                if (style === 'modern') {
                    $('.background').css('background', \`url(\${$('.background').data('bg')})\`);
                } else if (style === 'subtle') {
                    let scrollTimeout;

                    $('.max-width').on('scroll', () => {
                        $(':root').css('--background', 'rgba(0,0,0,0.2)');

                        clearTimeout(scrollTimeout);

                        scrollTimeout = setTimeout(() => {
                            $(':root').css('--background', 'rgba(0,0,0,0)');
                        }, 300);
                    });
                } else if (style === 'magazine') {
                    $('.heading').parent().removeClass('d-flex flex-grow-1 justify-content-center align-items-center px-3 px-md-5').addClass('container px-0 px-2 px-md-0');
                    $('#blogContent').removeClass('px-4').addClass('px-2');

                    const imageSize = ['40%', '50%', '60%', '100%'];
                    const img = $('#blogContent img');
                    img.each(function () {
                        const random = Math.floor(Math.random() * 100) % 2;
                        const randomSize = Math.floor(Math.random() * 4);
                        const currentImage = $(this);

                        currentImage.addClass(\`\${random % 2 === 0 ? 'float-left' : 'float-right'}\`);
                        $(window).on('resize load', function () {
                            if (window.innerWidth > 420) {
                                currentImage.css('max-width', \`\${imageSize[randomSize]}\`);
                                currentImage.removeClass('w-100');
                            } else {
                                currentImage.addClass('w-100');
                            }
                        });
                    });
                } else if (style === 'retro') {
                    $('.heading').parent().removeClass('justify-content-center px-3 px-md-5').addClass('container px-4 px-md-0 justify-content-between');
                    $('.heading').removeClass('mx-auto text-center px-5').addClass('mx-0 mx-md-2');
                    $('.heading p').removeClass('lead').addClass('fw-light');
                    $('#blogContent p').addClass('lead');
                    const retroImages = ['http://localhost:3000/images/retro1.jpg', 'http://localhost:3000/images/retro2.jpg', 'http://localhost:3000/images/retro3.jpg'];
                    const randomNum = Math.floor(Math.random() * 3);

                    $('.background').css('background', \`url(\${retroImages[randomNum]})\`).removeClass('mb-5');
                    $('body').removeClass('bg-body-tertiary').addClass('bg-dark-subtle');
                    $(document.documentElement).attr('data-bs-theme', 'dark');

                    const footer = $('footer').prop('outerHTML');
                    const blogContent = $('#blogContent').prop('outerHTML');
                    $('footer').replaceWith('');
                    $('#blogContent').replaceWith(\`<div class="w-100 filter pt-5 d-flex flex-column flex-grow-1">\${blogContent}\${footer}</div>\`);
                }
            });
        </script>
    </body>
    </html>
    `
  
    return getBlobURL(blogHTML, 'text/html')
  }



$(document).ready(function() {
    const checkColors = ()=>{
        if($('.modal-dialog').hasClass('modal-fullscreen')){
            $('.modal-header').css('transform','translateX(-1em)')
        }else{
            $('.modal-header').css('transform','translateX(0em)')

        }

        if((newDesignText ==='magazine'|| newDesignText==='subtle') && $('.modal-dialog').hasClass('modal-fullscreen')){
            $('.modal-header .btn-close').css('filter', 'none')
            $('.modal-header .fullscreen').removeClass('btn-close-white');
        }else{
            $('.modal-header .fullscreen').addClass('btn-close-white');
            $('.modal-header .btn-close').css('filter','invert(1) grayscale(100%) brightness(200%) drop-shadow(0 0 1px black)')
        }
    }

    $('.fullscreen').on('click', function(){
        $('.bi-fullscreen').toggleClass('d-none');
        $('.bi-fullscreen-exit').toggleClass('d-none')
        $('.modal-dialog').toggleClass('modal-fullscreen')
        $('#previewFrame').toggleClass('modal-height rounded modal-fullscreen')
        $('.modal-header').toggleClass('position-absolute z-1 w-100 top-0 left-0')
        checkColors()
    })

    $('#previewModal').on('show.bs.modal', function(e){
        $('main').attr('inert','');
        $(this).removeAttr('inert');

        $(this).find('[autofocus]').focus(); 
    });
    $('#previewModal').on('hide.bs.modal', function(e){
        $('main').removeAttr('inert');
        $(this).attr('inert','');

        $(e.relatedTarget).focus();
    });

    $('.dropdown').on('show.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
    });
    
    $('.dropdown').on('hide.bs.dropdown', function(e){
        e.preventDefault()
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300, function(){
            $('.dropdown').removeClass('show');
            $('.dropdown-menu').removeClass('show');
            $('.dropdown-toggle').removeClass('show');
            $('.dropdown').attr('aria-expanded','false');
        });
    });

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

    //Preview
    $('#get-html-btn').on('click',function(){
        checkColors();
        const html = quill? quill.getSemanticHTML(): "";
        const text = quill? quill.getText(0,400): "";
        const formData = new FormData(document.getElementById('new-blog'))
        const previewData = {}
        const today = new Date();
        const date = `${new String(today.getDate()).padStart(2,0)}-${new String(today.getMonth()+1).padStart(2,0)}-${today.getFullYear()}`;
        previewData['date']=date

        formData.append('design', newDesignText);
        formData.append('content', html);
        formData.append('description', text)


        for (const [key, value] of formData.entries()) {
            previewData[key]=value
          }

        var iframe = document.getElementById('previewFrame');

        var fileInput = $('#formFile')[0];
        var fileImage = fileInput.files[0]
        if(fileImage){
            var reader = new FileReader();
            reader.onload = function(e) {
                previewData['thumbNail']= e.target.result
                const testRunUrl = getGeneratedPageURL(previewData);

                iframe.src =  testRunUrl
            };
            reader.readAsDataURL(fileImage);
        }
        else{
            previewData['thumbNail']= 'https://placehold.co/600x400';
            const testRunUrl = getGeneratedPageURL(previewData);

            iframe.src =  testRunUrl
        }
   })

    // Create
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

    const paginationElements = parseInt($('.pagination').data('pages'), 10); 
    let currentPage = parseInt($('.pagination').data('current'), 10);

    const prevButton = $('.pagination .page-item[data-page="prev"]').detach();
    const nextButton = $('.pagination .page-item[data-page="next"]').detach();

    initializePagination();

    function initializePagination() {
        $('.pagination').empty();
        $('.pagination').append(prevButton);
    
        $('.pagination').append(`
            <li class="page-item ${currentPage === 1 ? 'active' : 'cursor'}" data-id="1">
                <span class="page-link">1</span>
            </li>
        `);
    
        if (paginationElements >= 5 && currentPage > 3) {
            $('.pagination').append(`
                <li class="page-item disabled not-clicable">
                    <span class="page-link">...</span>
                </li>
            `);
        }
    
        for (let i = Math.max(2, currentPage===paginationElements? currentPage-2:currentPage-1 ); i <= Math.min(paginationElements - 1, currentPage===1?currentPage + 2:currentPage+1); i++) {
            $('.pagination').append(`
                <li class="page-item ${currentPage === i ? 'active' : 'cursor'}" data-id="${i}">
                    <span class="page-link">${i}</span>
                </li>
            `);
        }
    
        if (paginationElements >= 5 && currentPage < paginationElements - 2) {
            $('.pagination').append(`
                <li class="page-item disabled not-clicable">
                    <span class="page-link">...</span>
                </li>
            `);
        }
    
        if (paginationElements > 1) {
            $('.pagination').append(`
                <li class="page-item ${currentPage === paginationElements ? 'active' : 'cursor'}" data-id="${paginationElements}">
                    <span class="page-link">${paginationElements}</span>
                </li>
            `);
        }
    
        $('.pagination').append(nextButton);
        updatePrevNextButtons();
    }

    function updatePrevNextButtons() {
        prevButton.toggleClass('disabled', currentPage === 1);
        nextButton.toggleClass('disabled', currentPage === paginationElements);

        if (prevButton.hasClass('disabled')) {prevButton.removeClass('cursor')}
        else{prevButton.addClass('cursor')};
        if (nextButton.hasClass('disabled')) nextButton.removeClass('cursor');
        else{nextButton.addClass('cursor')};
    }

        $(document).on('click', '.pagination .page-item', function () {
        if ($(this).hasClass('disabled') || $(this).hasClass('active')) return;

        const page = $(this).data('id') || (currentPage + ($(this).data('page') === 'next' ? 1 : -1));
        getPageFunc(page);

        if (window.innerWidth > 768) {
            $(document).scrollTop(250);
        } else {
            $(document).scrollTop(100);
        }
    });

    const getPageFunc = (e) => {
        axios.get("/blog", {
            params: {
                p: e
            }
        })
        .then(response => {
            currentPage = e;

            $('#blog-section').html($(response.data).find('#blog-section').html());

            initializePagination();

            window.history.pushState({}, '', `/blog?p=${e}`);
        })
        .catch(error => {
            console.error(error);
        });
    };

    window.addEventListener('popstate', function (event) {
        const url = new URL(window.location.href);
        if (url.hash) return;

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
            $('.navbar-collapse').collapse('hide');
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
                $('.navbar-collapse').collapse('hide');
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
            ['link', 'image'],
            ['clean'] 
          ] 
        }
    });
}



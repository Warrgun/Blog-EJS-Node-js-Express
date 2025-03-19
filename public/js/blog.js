

$(document).ready(function(){
    const blogId =$('#blogId').data('id')
    if(blogId<6){
        $('#blogId').addClass('d-none')
        $('#updateButton').removeAttr('data-bs-toggle data-bs-target')
    }else{
        $('.delete-blog').on('click', function () {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this blog. This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'Delete it!',
                cancelButtonText: 'Cancel',
                heightAuto: false,
                customClass:{
                    icon:'swalIconBg'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`/blog/${blogId}`)
                        .then(response => {
                            console.log('🗑️ Blog deleted:', response.data);
                            window.location.href = '/';
                        })
                        .catch(error => {
                            console.error('❌ Error deleting blog:', error);
                            window.location.reload();
                        });
                }
            });
        });
    }

    const formHandler = (title, content, design)=>{
        $('#title').val(title);
        $('#editor .ql-editor').html( content);

        $(`.list-group-item[data-design="${design}"]`).addClass("bg-light")
                                                            .removeClass('lh-condensed hover-effect').children('div')
                                                            .addClass('text-primary').
                                                            children('small')
                                                            .removeClass('text-muted');
        newDesignText = design
        $(".list-group-item strong").text(newDesignText);
    }

    $('#updateModal').on('show.bs.modal', function(){
        $('.background').attr('inert','');
        $(this).removeAttr('inert');

        $(this).find('[autofocus]').focus(); 
        const ifExist=$('.img-upload').find('#formFile');

        if(ifExist.length ===0){
            const fileField = document.createElement('input');
            fileField.type = 'file';
            fileField.id = 'formFile';
            fileField.classList.add('form-control', 'w-auto');
            fileField.name = 'thumbNail';
            fileField.accept = 'image/*';

            $('.img-upload').append(fileField);

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
        }

        formHandler($('body').data('title'),$('body').data('content'),$('body').data('style'))
    })

    $('#updateModal').on('hide.bs.modal', function(event){
        $('.background').removeAttr('inert');
        $(this).attr('inert','');

        $(event.relatedTarget).focus();
        const modal = $(this)
        $('#file-content').removeClass('ms-4').text('Thumbnail');
        $('.file-name-wrap .bi-check').removeClass('d-inline').addClass('d-none');
        const item =$('.list-group-item.bg-light');

        item.removeClass("bg-light").addClass('lh-condensed hover-effect');
        item.find('.text-primary').removeClass('text-primary').children('small').addClass('text-muted')

        const html = quill? quill.getSemanticHTML(): "";
  
        const formData = new FormData(document.getElementById('updateBlog'))
        formData.append('design', newDesignText);
        formData.append('content', html);

        const checkChanges = formData.get('design') !== $('body').data('style') || 
            formData.get('title') !==  $('body').data('title')|| 
            document.getElementById('formFile').files.length >0 || 
            formData.get('content') !==$('body').data('content');

        
        if(checkChanges){
            Swal.fire({
                title: 'Discard changes',
                text: 'Changes are unsaved. Do you want to save them before closing?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Save As',
                cancelButtonText: 'Close without Saving',
                heightAuto: false,
                customClass:{
                    icon:'swalIconBg'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    modal.modal('show')
                    $(`.list-group-item`).removeClass("bg-light")
                                        .addClass('lh-condensed hover-effect').children('div')
                                        .removeClass('text-primary').
                                        children('small')
                                        .addClass('text-muted');
                    formHandler(formData.get('title'),formData.get('content'),formData.get('design'))
                    if(document.getElementById('formFile').files.length >0){
                        let label = $('#file-content')
                        let fileName= document.getElementById('formFile').files[0].name

                        label.addClass('ms-4');
                        $('.file-name-wrap .bi-check').removeClass('d-none').addClass('d-inline');

                        !fileName? label.html(prevLabel): fileName.length >45?label.html(fileName.slice(0,45)+"..."): label.html(fileName);
                    }
                }else{
                    $('#formFile').remove();
                }
            });
        }else{
            $('#formFile').remove();
        }
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

    const updateHandler = (formData)=>{
        axios.put(`/blog/${blogId}`, formData,{
            headers:{
                'Content-Type': 'multipart/form-data'
            }
            })
            .then(function (response) {
                window.location.reload() ;
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
    }

    $('#updateFormBtn').on('click',function(){
        const html = quill? quill.getSemanticHTML(): "";
        const text = quill? quill.getText(0,400): "";
  
        const formData = new FormData(document.getElementById('updateBlog'))
        formData.append('design', newDesignText);
        formData.append('content', html);
        formData.append('description', text)

        Swal.fire({
            title: 'Are you sure you want to save these changes?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'Cancel',
            heightAuto:false
        }).then((result) => {
            if (result.isConfirmed) {
                updateHandler(formData)
            }
        });
      });

    $(document).on('click', function(e){
        if(!$('nav').is(e.target)&& $('nav').has(e.target).length === 0 && window.innerWidth<768){
            $('.navbar-collapse').collapse('hide');
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
        $('.heading').parent().removeClass(' justify-content-center px-3 px-md-5').addClass('container px-4 px-md-0 justify-content-between')
        $('.heading').removeClass('mx-auto text-center px-5').addClass('mx-0 mx-md-2')
        $('.heading p').removeClass('lead').addClass('fw-light')
        $('#blogContent p').addClass('lead')
        const retroImages = ['/images/retro1.jpg', '/images/retro2.jpg', '/images/retro3.jpg']
        const randomNum = Math.floor(Math.random()*3)

        $('.background').css('background',`url(${retroImages[randomNum]})`).removeClass('mb-5')
        $('body').removeClass('bg-body-tertiary').addClass('bg-dark-subtle')
        $(document.documentElement).attr('data-bs-theme','dark')

        const footer= $('footer').prop('outerHTML')
        const blogContent = $('#blogContent').prop('outerHTML')
        $('footer').replaceWith('')
        $('#blogContent').replaceWith(`<div class="w-100 filter pt-5 d-flex flex-column flex-grow-1">${blogContent}${footer}</div>`)
    }

    const toolbar=$('.ql-toolbar')
    if(toolbar.length) toolbar.addClass('position-sticky top-0 z-1').css('transform','translateY(-1px)');
})

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


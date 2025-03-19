import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tempFolder = path.join(__dirname, '../public/images/temp');

function clearFolder(){
    fs.readdir(tempFolder,(err,file)=>{
        if(err) console.error('foldere'+err);
        file.forEach(file=>{
            fs.unlink(path.join(tempFolder,file),err=> console.log(`file ${err}`))
        })
    })
}

clearFolder()

import express from 'express';
import multer from 'multer';
import { configDotenv } from 'dotenv';
import exampleBlogs from '../public/js/exampleBlogs.js';
configDotenv()

const app=express();
const port = process.env.PORT || 3000;
let blogs = []

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/images/temp'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix+ext)
    }
})

const uploadFile = function (req, res, next) {
    const upload = multer({ 
        storage: storage, 
        fileFilter: function (req, file, cb) {
            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.apng', '.ico', '.svg', '.webp'];
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/apng', 'image/x-icon', 'image/svg+xml', 'image/webp'];
            const ext = path.extname(file.originalname).toLowerCase();
            if (!allowedExtensions.includes(ext) && !allowedMimeTypes.includes(file.mimetype)) {
                req.fileValidationError = `Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`;
                return cb(null, false);
            }       
            cb(null, true);            
        },
        limits: {
            fileSize: 25 * 1024 * 1024,
            fieldSize: 25 * 1024 * 1024,
        }
    }).single('thumbNail');

    upload(req, res, function (err) {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ contentErr: "Size of all images together is too large!" });
                } else if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({ contentErr: "Too many files uploaded!" });
                } else {
                    return res.status(400).json({ contentErr: "Error: " + err.message });
                }
            } else {
                return res.status(400).json({ imageFileErr: "Upload error: " + err.message });
            }
        }

        console.log('file uploaded')
        next();
    });
};


const BlogCreator= (()=>{  
    let nextId = 0
    return class BlogCreator{
        constructor(design, thumbNail, title, content, description, date){
            this.id= nextId++;
            this.design= design;
            this.thumbNail= thumbNail;
            this.title= title;
            this.content= content;
            this.description = description;
            this.date = date;
        }
    };
})();

const jsonPath = path.join(__dirname,'../public');

fs.writeFile(path.join(jsonPath,'exampleBlogs.json'),exampleBlogs(), 'utf-8',(err)=>{if(err) console.error(err)})

fetch('http://localhost:3000/exampleBlogs.json')
    .then(response => response.json())
    .then(value => value.map(e=> blogs.push(new BlogCreator(e.design,e.thumbNail,e.title,e.content,e.description,e.date))))


app.get('/', (req, res)=>{
    res.render('home.ejs',{blogs});
})

app.get('/create-blog', (req, res)=>{
    res.render('createBlog.ejs');

})

app.post('/create-blog',uploadFile, (req, res)=>{
    const checkWhiteSpace = (e) => e && e.trim().length > 0;
    const data = req.body;
    const thumbNail = req.file ? `/images/temp/${req.file.filename}` : 'https://placehold.co/600x400';
    const isTitleValid = checkWhiteSpace(data.title);
    const isContentValid = checkWhiteSpace(data.description);

    let errors = {};
    if (!isTitleValid) {
        errors.titleErr = "Provide a valid title!";
    }
    if (!isContentValid) {
        errors.contentErr = "Your blog must contain letters!";
    }
    if(req.fileValidationError){
        errors.imageFileErr=req.fileValidationError
    }
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    const today = new Date();
    const date = `${new String(today.getDate()).padStart(2,0)}-${new String(today.getMonth()+1).padStart(2,0)}-${today.getFullYear()}`;
    let title = data.title.trim();
    title[0].toUpperCase()+title.slice(1)

    const blog = new BlogCreator(data.design,thumbNail,title, data.content, data.description, date);


    blogs.push(blog);
    res.json({redirectUrl: `/blog/${blog.id}`})

})

app.get('/blog', (req, res)=>{
    const limitPerPage = 10;
    let currentPage = parseInt(req.query?.p, 10) || 1;
    res.render('blogs.ejs',{
        blogs:[...blogs].reverse().slice((currentPage-1) * limitPerPage,currentPage *limitPerPage),
        currentPage: currentPage,
        pages: Math.ceil(blogs.length /limitPerPage)
    });
})

app.get(`/blog/:id`, (req, res)=>{
    const blogId = parseInt(req.params.id,10)
    const blog = blogs.find((e)=>e.id===blogId);

    if(blog){
        res.render('blog.ejs',{blog});
    }
    else{
        res.status(404).render('error.ejs');
    }

})

app.put(`/blog/:id`,uploadFile, (req, res)=>{
    const checkWhiteSpace = (e) => e && e.trim().length > 0;
    const {body, params:{id}} = req
    const blogId = parseInt(id,10)
    const thumbNail = req.file ? `/images/temp/${req.file.filename}` : 'https://placehold.co/600x400';
    const isTitleValid = checkWhiteSpace(body.title);
    const isContentValid = checkWhiteSpace(body.description);

    console.log(body)

    let errors = {};
    if (!isTitleValid) {
        errors.titleErr = "Provide a valid title!";
    }
    if (!isContentValid) {
        errors.contentErr = "Your blog cannot be empty!";
    }
    if(req.fileValidationError){
        errors.imageFileErr=req.fileValidationError
    }
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    if(isNaN(blogId)) return res.status(400).json({ error: '❌ Incorrect path.' })


    const findBlogIndex = blogs.findIndex(e=> e.id===blogId);
    if(findBlogIndex === -1){ 
        return res.status(404).json({ error: '❌ Blog not found.' })
    }else{
        const thubmNailPath = path.join(__dirname,'../public');
        const thumbNailDelete = blogs[findBlogIndex].thumbNail
        if(thumbNailDelete != 'https://placehold.co/600x400') fs.unlink(path.join(thubmNailPath,thumbNailDelete),err=> console.log(`file ${err}`))
        const today = new Date();
        const updateDate = `${new String(today.getDate()).padStart(2,0)}-${new String(today.getMonth()+1).padStart(2,0)}-${today.getFullYear()}`;
        blogs[findBlogIndex] ={
            id:blogId, 
            design:body.design, 
            thumbNail:thumbNail, 
            title: body.title, 
            content: body.content, 
            description: body.description, 
            date:updateDate 
        }
        res.status(200).json({ message: '✅ Blog updated successfully.', blog: blogs[findBlogIndex] });
    }

})

app.delete(`/blog/:id`, (req, res)=>{
    const blogId = parseInt(req.params.id,10);
    const beforeLength = blogs.length;
    const thubmNailPath = path.join(__dirname,'../public');
    if (isNaN(blogId)) return res.status(400).json({ error: '❌ Incorrect path.' });

    const thumbNailDelete =blogs.filter(e=> e.id===blogId)[0].thumbNail
    if(thumbNailDelete != 'https://placehold.co/600x400')fs.unlink(path.join(thubmNailPath,thumbNailDelete),err=> console.log(`file ${err}`))

    blogs = blogs.filter(e => e.id !== blogId);

    if (blogs.length < beforeLength) {
        res.status(200).json({ message: `🗑️ Blog ${blogId} deleted.` });
    } else {
        res.status(404).json({ error: '❌ Blog not found.' });
    }
})

function cleanupOnExit() {
    clearFolder();
    process.exit();
}  

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}.`);
})

process.on('SIGINT', cleanupOnExit);
process.on('SIGTERM', cleanupOnExit);

app.use((req, res, next) => {
    res.status(404).render('error.ejs', { title: 'Page Not Found' });
  });


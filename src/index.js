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
import exampleBlogs from '../public/js/exampleBlogs.js';

const app=express();
const port = 3000;
let blogs = []

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({extended: true}));

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

const upload = multer({ storage: storage })


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

app.post('/create-blog',upload.single('thumbNail'), (req, res)=>{
    const data = req.body;
    const thumbNail = req.file ? `/images/temp/${req.file.filename}` : 'https://placehold.co/600x400';
    const today = new Date();
    const date = `${today.getDate()<10?new String(0)+today.getDate():today.getDate()}-${(today.getMonth()+1)<10?new String(0)+(today.getMonth()+1):today.getMonth()+1}-${today.getFullYear()}`;

    const blog = new BlogCreator(data.design,thumbNail,data.title, data.content, data.description, date);


    blogs.push(blog);
    res.json({redirectUrl: `/blog/${blog.id}`})
})

app.get('/blog', (req, res)=>{
    res.render('blogs.ejs',{blogs});
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

app.put(`/blog/:id`, (req, res)=>{
    const blogId = parseInt(req.params.id,10)
    res.render(`/blog/${blogId}`);
})

app.delete(`/blog/:id`, (req, res)=>{
    const blogId = parseInt(req.params.id,10);
    const beforeLength = blogs.length;
    const thubmNailPath = path.join(__dirname,'../public');

    fs.unlink(path.join(thubmNailPath,blogs.filter(e=> e.id===blogId)[0].thumbNail),err=> console.log(`file ${err}`))

    blogs = blogs.filter(e => e.id !== blogId);

    if (blogs.length < beforeLength) {
        res.status(200).json({ message: `🗑️ Blog ${blogId} deleted.` });
    } else {
        res.status(404).json({ error: '❌ Blog not found.' });
    }
})

function cleanupOnExit() {
    clearUploadsFolder();
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


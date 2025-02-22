import express from 'express';

const app=express();
const port = 3000;
let blogs = []

app.use(express.static('../public'));
app.use(express.urlencoded({extended: true}));

const BlogCreator= (()=>{  
    let nextId = 0
    return class BlogCreator{
        constructor(design, title, content){
            this.id= nextId++;
            this.design= design;
            this.title= title;
            this.content= content;
        }
    };
})();

app.get('/', (req, res)=>{
    res.render('home.ejs',{blogs});
})

app.get('/create-blog', (req, res)=>{
    res.render('createBlog.ejs');

})
app.post('/create-blog', (req, res)=>{
    const data = req.body;
    const blog = new BlogCreator(data.design, data.title, data.content);
    blogs.push(blog);
    res.redirect(`/blog/${blog.id}`)

})

app.get('/blog', (req, res)=>{
    res.render('blogs.ejs');

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
    blogs = blogs.filter(e => e.id !== blogId);

    if (blogs.length < beforeLength) {
        res.status(200).json({ message: `🗑️ Blog ${blogId} deleted.` });
    } else {
        res.status(404).json({ error: '❌ Blog not found.' });
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}.`);
})


import express from 'express';

const app=express();
const port = 3000;
let blogs = []

app.use(express.static('../public'));
app.use(express.urlencoded({extended: true}));

const BlogCreator= (()=>{  
    let nextId = 0
    return class BlogCreator{
        constructor(design, thumbNail, title, content){
            this.id= nextId++;
            this.design= design;
            this.thumbNail= thumbNail;
            this.title= title;
            this.content= content;
        }
    };
})();

blogs.push(new BlogCreator('main','https://placehold.co/600x400','Homelander','Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aut provident aliquam illo consectetur labore ea. Quaerat, odio at consectetur animi voluptatem ipsum dignissimos reprehenderit consequuntur unde sit? Doloremque, consequatur.'));
blogs.push(new BlogCreator('main','https://placehold.co/600x400','Invincable','Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aut provident aliquam illo consectetur labore ea. Quaerat, odio at consectetur animi voluptatem ipsum dignissimos reprehenderit consequuntur unde sit? Doloremque, consequatur.'));
blogs.push(new BlogCreator('main','https://placehold.co/600x400','The reacher','Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aut provident aliquam illo consectetur labore ea. Quaerat, odio at consectetur animi voluptatem ipsum dignissimos reprehenderit consequuntur unde sit? Doloremque, consequatur.'));
blogs.push(new BlogCreator('main','https://placehold.co/600x400','Jobs 2025','Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aut provident aliquam illo consectetur labore ea. Quaerat, odio at consectetur animi voluptatem ipsum dignissimos reprehenderit consequuntur unde sit? Doloremque, consequatur.'));
blogs.push(new BlogCreator('main','https://placehold.co/600x400','Businuess','Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aut provident aliquam illo consectetur labore ea. Quaerat, odio at consectetur animi voluptatem ipsum dignissimos reprehenderit consequuntur unde sit? Doloremque, consequatur.'));
blogs.push(new BlogCreator('main','https://placehold.co/600x400','The reacher','Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aut provident aliquam illo consectetur labore ea. Quaerat, odio at consectetur animi voluptatem ipsum dignissimos reprehenderit consequuntur unde sit? Doloremque, consequatur.'));

app.get('/', (req, res)=>{
    console.log(blogs)
    res.render('home.ejs',{blogs});
})

app.get('/create-blog', (req, res)=>{
    res.render('createBlog.ejs');

})
debugger;
app.post('/create-blog', (req, res)=>{
    const data = req.body;
    console.log(data)
    if(!data.thumbNail) data.thumbNail='https://placehold.co/600x400';
    const blog = new BlogCreator(data.design, data.thumbNail,data.title, data.blog);
    blogs.push(blog);
    res.redirect(`/blog/${blog.id}`)

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

app.use((req, res, next) => {
    res.status(404).render('error.ejs', { title: 'Page Not Found' });
  });


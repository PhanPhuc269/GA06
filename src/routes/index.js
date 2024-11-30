const authRouter=require('../auth/auth');
const productRouter=require('../components/product/productRoutes');
const blogRouter=require('../components/blog/blogRoute');
const pagesRouter=require('../components/pages/pagesRoute');
const contactRouter=require('../components/contact/contactRoute');
const aboutRouter=require('../components/about/aboutRoute');


function router(app)
{
   app.use('/', authRouter);
   app.use('/product', productRouter);
   app.use('/blog', blogRouter);
   app.use('/pages', pagesRouter);
   app.use('/contact', contactRouter);
   app.use('/about', aboutRouter);
}

module.exports = router
const authRouter=require('./auth');
const productRouter=require('./product');
const blogRouter=require('./blog');
const pagesRouter=require('./pages');
const contactRouter=require('./contact');
const aboutRouter=require('./about');


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
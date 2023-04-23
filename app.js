
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const bodyParser=require('body-parser');
const mongoose = require('mongoose')
const app = express();


// map Global Promise- get rid of warnings
mongoose.Promise=global.Promise;


//connect to mongoose
mongoose.connect('mongodb://0.0.0.0:27017/recapp-dev'
)
  .then(() => console.log('mongoDb connected...'))
  .catch(err => console.log(err));


//load recipie Model
require('./models/recipie');
const Recipie= mongoose.model('Recipie')


//middleware in handlebars
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main'
}));
app.set('view engine', '.hbs');


//Body parser middelware
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

//method middleware
app.use(methodOverride('_method'));

//index recipie page
app.get('/recipies', (req, res) => {
  Recipie.find({}).lean()
  .sort({date:'desc'})
  .then(Recipie =>{
    res.render('remedy/index',{
      Recipie:Recipie
    }); 
  });
  
});


//index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});
app.get('/about', (req, res) => {
  res.render('about');
});


//add recipie form
app.get('/remedy/add', (req, res) => {
  res.render('remedy/add');
});


//process forms
app.post('/recipies',(req , res)=>{
 let errors =[];
 if(!req.body.title){
  errors.push({text:'Please Add the title'})
 }
 if(!req.body.details){
  errors.push({text:'Please Add the Details'})
 }
if(errors.length>0){
  res.render('remedy/add',{
    errors:errors,
    title:req.body.title,
    details:req.body.details
  });
}else{
  const newUser = {
    title:req.body.title,
    details:req.body.details
  }
  new Recipie(newUser)
  .save()
  .then(Recipie=>{
    res.redirect('/recipies');
  })
}
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
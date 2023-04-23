const mongoose= require('mongoose');
const Schema = mongoose.Schema;

//create our schema
const RecipieSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  
  details:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  }

});
mongoose.model('Recipie',RecipieSchema);
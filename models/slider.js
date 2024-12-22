const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const sliderSchema=new Schema({
    backgroundImage:String,
    heading:String,
    description:String,
});
const Slider=mongoose.model("Slider",sliderSchema);

module.exports=Slider;
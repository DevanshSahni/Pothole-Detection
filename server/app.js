const express= require("express");
const { loadModel }=require("./YOLOv8/script");

const app=express();
app.use(express.json());
 
app.get("/",async (req,res)=>{
  res.send(await loadModel());
});

app.listen(3001, ()=>{
  console.log('Server started');  
}) 

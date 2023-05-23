// jshint eserver:6
const express= require("express");
const bodyParser= require("body-parser");
const mongoose =require("mongoose");

const DB= "mongodb+srv://dhakad:annu&aayu777@cluster1.jlcm2rx.mongodb.net/mernstack?retryWrites=true&w=majority";

const app=express(); 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//  mongodb://127.0.0.1:27017/todolist-v2
mongoose.connect(DB)
.then(()=>console.log("connected successful"))
.catch((err)=>console.log(err));

const itemSchema =new mongoose.Schema({
      name:String
})
const Item = new mongoose.model("Item",itemSchema);

const createitems= async()=>{
      try{
            const item1 = new Item({
                  name: "welcome to your todolist"
            });
                const item2= new Item({
                   name:"hit the + button to add a new item."
                 });
            const item3=new Item({
                  name:"<--- hit this to delete an item."
            });
            const defaultItems= [item1, item2, item3];
      
            const listSchema = {
                  name: String,
                  items :[itemSchema]
             };
             const List = mongoose.model("List",listSchema);
            

              app.get ("/",  function (req,res) {   
                  Item.find()
                  .then (function(foundItems){
                        if(foundItems.length ===0){
                              const foundItems=  Item.insertMany(defaultItems);
                              console.log(foundItems);
                        res.redirect("/");
                        } 
                        else{
                        res.render("list", {ListTitle: "Today",newListItems:foundItems});     }
                  })
             .catch(function(err){
                   console.log(err);
                  });              
             });


            //  app.get("/:customListName", function(req,res){
            //      const customListName =req.params.customListName;
            //       List.findOne()
            //      .then({name: customListName},function(foundList){
            //                   if(!foundList){
            //                         const list =new List({
            //                               name:customListName,
            //                               items:defaultItems 
            //                         });
            //                        list.create();
            //                        console.log(foundList);
            //                        res.redirect("/" + customListName);
            //                   }else{
            //                         res.render("list",{ListTitle: foundList.name, newListItems: foundList.items});
            //                   }
            //       })
            //       .catch(function(err){
            //        console.log(err);
            //       })
                  
            //  });

            app.post("/",function(req,res){
                  const   itemName = req.body.newItem;
                  const listname = req.body.list;
                        const item =new Item({
                              name:itemName
                             });

                             item.save();
                         res.redirect("/");   
                  // if(listname=="Today"){
                  //      
                  // }  
                  // else{
                  //       List.findOne({name: listname}, function(err,foundList){
                  //             foundList.items.push(item);
                  //             foundList.save();
                  //             res.redirect("/"+listname);
                  //       });
                  // }
            });

            app.post("/delete", async function(req,res){
                  const checkedItemId = req.body.checkbox;
                  console.log(checkedItemId);
                  if(checkedItemId != undefined){
                  await      Item.findByIdAndRemove(checkedItemId)
                        .then(()=>console.log("Deleted $ {checkedItemId} Sucessfully"))
                        .catch((err)=> console.log("Deletion Error: "+err));
                        res.redirect("/");
                  }          
            });
             
           
            app.get("/about",function(req,res){
                  res.render("about");
            })
                
}catch(error){
      console.log(error.message);
}
}
createitems();

app.listen(3000,function(){
                    console.log("server is running on port 3000");
});

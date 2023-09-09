const express = require("express"); 
const app = express();

const body_parser = require("body-parser");
app.use(body_parser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

	const mongoose = require("mongoose");            
main().catch(err => console.log(err));

async function main() {
await mongoose.connect('mongodb+srv://unstable_chad:idkpass13579.@clustertest.cxys5wb.mongodb.net/todolist_DB');
}


//SCHEMA FOR to do items
const items_schema = new mongoose.Schema({
    _id:  Number,
    name: String
});

const Items_model = mongoose.model("Item", items_schema);



//SCHEMA FOR list thingy
const list_schema = new mongoose.Schema({
    name: String,
    items: [items_schema]
})

const List_model = mongoose.model("List", list_schema);





//default items before user addition
const item_1 = new Items_model ({
    _id:1,
    name: "Welcome!"
});


const item_2 = new Items_model ({
    _id:2,
    name: "Click '+' button to add"
});


const item_3 = new Items_model ({
    _id:3,
    name: "<-- Click this to remove"
});

const default_items = [item_1, item_2, item_3];














//HOME GET ROUTE
app.get("/", function (req,res) {
    Items_model.find({}).then(function(findings) {

        if (findings.length == 0) {
            //insersion of default items into DB collection

                Items_model.insertMany([
                    item_1, item_2, item_3
                ]).then (function () {
                    console.log("Successfully saved default items to DB");
                    
                })
                .catch(function (err) {
                console.log(err);
                });
                res.redirect("/");
        } else {
            res.render("list", {list_title: "today",
                        next: findings
                        });
        }

        
    }).catch((err) => {
    console.log(err);
    });
    
});


//GET ROUTE FOR LIST THINGY
app.get("/:key", function (req,res){

    const custom_list_name = req.params.key; 

    List_model.findOne({name: custom_list_name}).then(function(findings) {
       if (findings) {
        //Existing List
        res.render("list", {
                list_title: findings.name,
                next: findings.items
        })
       } else {
        //List Creation
        console.log("creating now");
        const list = new List_model({
            name: custom_list_name,
            items: default_items
           })
           list.save();
           res.redirect("/"+ custom_list_name);
       }
       
    })
.catch((err) => {
    console.log(err);
});


});










//POST ROUTE ADD...
let x = 4;          // global variable dw its all good
app.post("/", function (req,res) {
    let td = req.body.next_to_do;
    let title = req.body.add_button_name;

    const new_item_obj = new Items_model({
        _id: x,
        name: td
    });
    x++;

        if (title == "today") {
            new_item_obj.save();
    console.log("added new item to list");
    x++;
    res.redirect("/");
        } else {
            List_model.findOne({name: title}).then(function(findings) {
                findings.items.push(new_item_obj);
                findings.save();
                res.redirect("/"+ title);
            })
            .catch((err) => {
            console.log(err);
            });  


        }
    }
);





//POST ROUTE DELETE...
app.post("/delete", function (req,res) {
    const changed_box_thing = req.body.checkbox_name;
    const hidden_input_thing = req.body.hidden_input_name;

    if (hidden_input_thing == "today") {
        Items_model.findOneAndRemove({_id: changed_box_thing}).then(function () {
            console.log("successfully deleted" + req.body.checkbox_name);
            
        }).catch(function (err) {
            console.log(err);
        });
            res.redirect("/");
    } else {
        List_model.findOneAndUpdate({name: hidden_input_thing},{$pull: {items: {_id: changed_box_thing}}},{ includeResultMetadata: true }).then(function (fin) {
            console.log("sucessfully updated list array of "+ hidden_input_thing);

            res.redirect("/"+hidden_input_thing);


        }).catch((err) =>{
            console.log(err);
        });
    }

  
});






app.listen(process.env.PORT, function(){
    console.log(process.env.PORT )});

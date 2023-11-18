const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

let worklist = [];
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));


let current_date = new Date();

app.get("/", function (req, res) {
    // learned sorting by date from https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
    worklist.sort(function(object1, object2){
        let difference = new Date(object1.duedate) - new Date(object2.duedate);
        return difference;
    });
    res.render("homepage", {worklist: worklist});
});

app.get("/work/:title", function (req, res) {
    //console.log(req.params.title);
    let index;
    for (let i = 0; i < worklist.length; i++) {
        if (worklist[i].title == req.params.title) {
            index = i;
            break;
        }
    }
    
    res.render("viewwork", {title: worklist[index].title, description: worklist[index].description, duedate: worklist[index].duedate});
});

app.post("/", function (req, res) {
    res.redirect("/addwork");
});

app.get("/addwork", function(req, res) {
    let date_string = current_date.toISOString().substring(0,10);
    res.render("addwork", {min_date: date_string, found_same_title: false, worktitle: ""});
});

app.post("/addwork", function(req, res) {
    let found_same_title = false;
    for (let i = 0; i < worklist.length; i++) {
        if (worklist[i].title == req.body.worktitle) {
            found_same_title = true;
            let date_string = current_date.toISOString().substring(0,10);
            res.render("addwork", {min_date: date_string, found_same_title: found_same_title, worktitle: req.body.worktitle});
        }
    }
    if (found_same_title == false) {
        worklist.push({title: req.body.worktitle, description: req.body.description, duedate: req.body.duedate});
        res.redirect("/");
    }
    
});

app.get("/editwork/:title", function(req, res) {
    //console.log(req.params.title);
    let index;
    for (let i = 0; i < worklist.length; i++) {
        if (worklist[i].title == req.params.title) {
            index = i;
            break;
        }
    }
    let date_string = current_date.toISOString().substring(0,10);
    res.render("editwork", {min_date: date_string,
                            title_value: worklist[index].title, 
                            description_value: worklist[index].description, 
                            duedate_value: worklist[index].duedate});
});

app.post("/editwork/:title", function(req, res) {
    //console.log(req.params.title);
    let found_same_title = false;
    if (req.body.worktitle != req.params.title) {
        //console.log("title changed");
        for (let i = 0; i < worklist.length; i++) {
            if (worklist[i].title == req.body.worktitle) {
                found_same_title = true;
                let date_string = current_date.toISOString().substring(0,10);
                res.render("addwork", {min_date: date_string, found_same_title: found_same_title, worktitle: req.body.worktitle});
            }
        }

        for (let i = 0; i < worklist.length; i++) {
            if (worklist[i].title == req.params.title) {
                worklist[i].title = req.body.worktitle;
                worklist[i].description = req.body.description;
                worklist[i].duedate = req.body.duedate;
                res.redirect("/");
            }
        }
    } else {
        //console.log("title not changed");
        for (let i = 0; i < worklist.length; i++) {
            if (worklist[i].title == req.params.title) {
                //worklist[i].title = req.body.worktitle;
                worklist[i].description = req.body.description;
                worklist[i].duedate = req.body.duedate;
                res.redirect("/");
            }
        }

    }

});

app.post("/delete/:title", function(req, res) {
    //console.log(req.params.title);
    for (let i = 0; i < worklist.length; i++) {
        if (worklist[i].title == req.params.title) {
            worklist.splice(i,1);
            res.redirect("/");
        }
    }

});


app.listen(3000, function() {
    console.log("server is running");
});
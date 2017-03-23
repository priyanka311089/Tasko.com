var express = require("express"),
    app = express(),
    http = require("http"),
    jsonfile = require('jsonfile'),
    file = './assets/task.json',
    fs = require('fs'),
    bodyParser = require('body-parser'),
    taskManagerData = [], homePageData = [];


app.get("/", function(req, res) {
  fs.readFile('home.html', 'utf8', function(err, contents) {
        if (!err)
            res.send(contents);
        else
            res.send('error' + err);
    });
})

app.use(express.static('.'));
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var server = app.listen(8080, function() {
    var host = server.address().address,
        port = server.address().port;

    //console.log('taskManager started at ' + port);
})

//returns all types of products
app.get('/api/getTasks', function(req, res) {
   jsonfile.readFile(file, function(err, obj) {
     if(taskManagerData.length == 0){
          taskManagerData = obj.tasks;
          res.json(obj.tasks);
      }
      else{
        //console.log("taskManagerData",taskManagerData);
        res.json(taskManagerData)
        res.status(200);
      }

  })
})



//returns a product in the cart
app.get('/api/getCardList/:taskTitle', function(req, res) {

  for (var i = 0; i < taskManagerData.length; i++) {
      //console.log("Record entered in loop");
          //console.log(taskManagerData[i].title);
          //console.log( req.params.taskTitle);

      if (taskManagerData[i].title == req.params.taskTitle){
        //console.log("list--",taskManagerData[i].cardList);
        res.json(taskManagerData[i].cardList);
        res.status(200);

      }
    }
});
app.post('/api/moveCard', function(req, res) {
  var card=req.body.card;
   for (var i = 0; i < taskManagerData.length; i++) {
    if (taskManagerData[i].title == card.taskTitle){
        for (var j = 0; j < taskManagerData[i].cardList.length; j++) {
          if (taskManagerData[i].cardList[j].cardId == card.cardId){
                var cardList=taskManagerData[i].cardList;
                console.log("before:",taskManagerData);
                cardList.splice(j,1);
                  console.log("after:",taskManagerData);

          }
        }
      }
     }
   card.taskTitle=req.body.newTask.title;
    for (var i = 0; i < taskManagerData.length; i++) {
            if  (taskManagerData[i].title == req.body.newTask.title){

                taskManagerData[i].cardList.push(card)
          }
    }
        console.log("updated:",taskManagerData);
    res.json(taskManagerData);
    res.status(200);

});
//Adds a task
app.post('/api/addTask', function(req, res) {

    var resJSON = req.body;


      //console.log(taskManagerData);
        var updatedQty = null;
        tasksPageLen = taskManagerData.length,
            foundObject = null;

        for (var i = 0; i < tasksPageLen; i++) {
            //console.log("Record entered in loop");

            if (taskManagerData[i].title == req.body.title){
                //console.log("Same Record Found");
                foundObject = taskManagerData[i];
                taskManagerData.splice(i,1);
                taskManagerData.push(resJSON)
                res.json(taskManagerData);

                //console.log("Record updated - 1st Time");
            }
        }

        if (!foundObject) {
            //console.log("Record Added - 2nd Time", taskManagerData.length);
            taskManagerData.push(resJSON);

            //console.log(taskManagerData);
            // res.status(200);
            res.json(taskManagerData);
        }


});
//Adds card in task
app.post('/api/addCard', function(req, res) {

    var resJSON = req.body;


      //console.log(taskManagerData);
        var updatedQty = null;
        tasksPageLen = taskManagerData.length,
            foundObject = null;

        for (var i = 0; i < tasksPageLen; i++) {
            //console.log("Record entered in loop");

            if (taskManagerData[i].title == req.body.taskTitle){
                //console.log("Same Record Found");
                foundObject = taskManagerData[i];
                taskManagerData[i].cardList.push(resJSON)
                res.json(taskManagerData[i]);

                //console.log("Card Added - 1st Time");
            }
        }

});
//Removes a product from the cart
app.post('/api/removeFromCart', function(req, res) {

    var resJSON = req.body;

    if (taskManagerData.length > 0) {

        var updatedQty = null;
        tasksPageLen = taskManagerData.length,
        foundObject = null;

        for (var i = 0; i < tasksPageLen; i++) {
           if (taskManagerData[i].p_id == req.body.p_id && taskManagerData[i].p_selected_size.code == req.body.p_size && taskManagerData[i].p_quantity == req.body.p_quantity && taskManagerData[i].p_selected_color.name == req.body.p_selectedColor) {
            taskManagerData.splice(i, 1);
            break;
            }
        }
        //console.log("xxxx="+taskManagerData);
        res.json(taskManagerData);


        res.end();
    }
});


//Get products which are in cart
app.get('/api/cartPage', function(req, res) {
  if(taskManagerData.length == 0){
    jsonfile.readFile(file, function(err, obj) {
        taskManagerData = obj.tasks;
        //console.log("DATA" , taskManagerData);
        res.json(taskManagerData);
    })
  }else{
    //console.log(taskManagerData);
    res.json(taskManagerData)
    res.status(200);
  }

})

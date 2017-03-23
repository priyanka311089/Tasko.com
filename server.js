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

    console.log('Tasko.com started at ' + port);
})

//returns all types of tasks
app.get('/api/getTasks', function(req, res) {
   jsonfile.readFile(file, function(err, obj) {
     if(taskManagerData.length == 0){
          taskManagerData = obj.tasks;
          res.json(obj.tasks);
      }
      else{
        console.log("taskManagerData",taskManagerData);
        res.json(taskManagerData)

      }

  })
})



//returns a product in the cart
app.get('/api/getCardList/:taskId', function(req, res) {

  for (var i = 0; i < taskManagerData.length; i++) {
      //console.log("Record entered in loop");
          //console.log(taskManagerData[i].title);
          //console.log( req.params.taskTitle);

      if (taskManagerData[i].taskId == req.params.taskId){
        //console.log("list--",taskManagerData[i].cardList);
        res.json(taskManagerData[i].cardList);
        res.status(200);

      }
    }
});
app.post('/api/removeTask', function(req, res) {
  var task=req.body;
  console.log(task);
   for (var i = 0; i < taskManagerData.length; i++) {
      if (taskManagerData[i].taskId == task.taskId){
            taskManagerData.splice(i,1);
            console.log("after:",taskManagerData);
      }
    }
     res.json("{message:'success'}");
     res.status(200);
});
app.post('/api/removeCard', function(req, res) {
  var card=req.body;
   for (var i = 0; i < taskManagerData.length; i++) {
    if (taskManagerData[i].taskId == card.taskId){
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
     res.json("{message:'success'}");
     res.status(200);
   });
   //Get tasks which are in cart
   app.post('/api/ChangeCardData', function(req, res) {
     var card=req.body;
      for (var i = 0; i < taskManagerData.length; i++) {
       if (taskManagerData[i].taskId == card.taskId){
           for (var j = 0; j < taskManagerData[i].cardList.length; j++) {
             if (taskManagerData[i].cardList[j].cardId == card.cardId){
                    taskManagerData[i].cardList[j].cardDetail = card.cardDetail;
                    taskManagerData[i].cardList[j].member = card.member;
                    console.log("updated cards:",taskManagerData[i].cardList[j]);

             }
           }
         }
        }
        res.json("{message:'success'}");
        res.status(200);
   });

app.post('/api/moveCard', function(req, res) {
  var card=req.body.card;
   for (var i = 0; i < taskManagerData.length; i++) {
    if (taskManagerData[i].taskId == card.taskId){
        for (var j = 0; j < taskManagerData[i].cardList.length; j++) {
          if (taskManagerData[i].cardList[j].cardId == card.cardId){
                var cardList=taskManagerData[i].cardList;
                console.log("before:",taskManagerData,cardList);
                cardList.splice(j,1);
                  console.log("after:",taskManagerData);

          }
        }
      }
     }
   card.taskId=req.body.newTask.taskId;
    for (var i = 0; i < taskManagerData.length; i++) {
            if  (taskManagerData[i].taskId == req.body.newTask.taskId){

                taskManagerData[i].cardList.push(card)
          }
    }
        console.log("updated:",taskManagerData);
        res.json("{message:'success'}");
        res.status(200);

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

            if (taskManagerData[i].taskId == req.body.taskId){
                //console.log("Same Record Found");
                foundObject = taskManagerData[i];
                taskManagerData[i].cardList.push(resJSON)
                res.json(taskManagerData[i]);
                break;
                //console.log("Card Added - 1st Time");
            }
        }


});
app.post('/api/addTask', function(req, res) {
         var resJSON = req.body;
          taskManagerData.push(resJSON);
         res.json(taskManagerData);
});//Adds card in task


//Adds card in task
app.post('/api/editTask', function(req, res) {
   for (var i = 0; i < tasksPageLen; i++) {
            if (taskManagerData[i].taskId == req.body.oldTask.taskId){
                taskManagerData[i].title = req.body.newTaskTitle;
                console.log("changed task")
                break;
            }
          }

        res.status(200);
        res.json(taskManagerData);
});

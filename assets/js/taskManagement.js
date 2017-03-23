angular
    .module("taskManagement", ['ngRoute'])
    .config(['$routeProvider', function(routeProvider) {
        routeProvider
            .when("/", {
                templateUrl: "assets/js/views/board.html",
                controller: "boardController"
            })

  }]).controller('boardController', ['$scope', '$http', '$rootScope', '$window',
  function($scope, $http, $rootScope, windowObj) {
    $scope.showInputSection=false;
    $scope.taskList=[];
    $scope.index = 0;
   //  $scope.updateTasks();
    $scope.updateTasks=function(){
      $http.get('/api/getTasks').success(function(response) {
            if(response.length>0){
              $scope.index = parseInt(response[response.length-1].taskId.split("_")[1])+1;

            }
            $scope.taskList = response;
            console.log(response);

      });

    };
  $scope.updateTasks();
    $scope.saveTask = function(){
          var task = {
              taskId : "task_"+$scope.index,
              title : $scope.titleList,
              cardList:[]
            }
            $scope.index++;
            $http.post('/api/addTask', task)
                .success(function(response) {
                    if (response) {

                      $scope.taskList = response;
                      console.log("task added in board");
                      $scope.showInputSection = false;
                    }
            });

    };
    $scope.addTaskList = function($event){
          $(".input-section").hide();
          $($event.target).parent().find(".add-task-section").show();
          $scope.titleList = "";
          $scope.showInputSection=true;
    };
    $scope.hideInputSection = function(){
         $scope.showInputSection=false;
    };


}]).directive('myTask',function () {
    return {
        restrict: 'E',
        scope: {
          task: '='
        },
         templateUrl: 'assets/js/views/task.html',
         controller: ['$scope', '$http',function MyTabsController($scope,$http) {
           $scope.showInputSection=false;
           $scope.index = 0;
           $scope.getCardList = function(){
              $http.get('/api/getCardList/'+$scope.task.taskId).success(function(response) {
                if(response.length>0){
                $scope.index = parseInt(response[response.length-1].cardId.split("_")[3])+1;

              }

              $scope.cardList = response;
            });
          };
          $scope.showEditTask=function(){
            $scope.editTaskTitle = true;

          }
          $scope.hideEditTask=function(){
            $scope.editTaskTitle = false;

          }
          $scope.editTask=function(){
            $http.post('/api/editTask',{ newTaskTitle:$scope.newTaskTitle ,oldTask:$scope.task}).success(function(response) {
                 $scope.$parent.$parent.updateTasks();
                 $scope.editTaskTitle = false;
             });
          }

          $scope.removeTask= function(){
            $http.post('/api/removeTask',$scope.task).success(function(response) {
                //Update card list
                $scope.$parent.$parent.updateTasks();
             });
          }
          $scope.getCardList();
          $scope.addCard = function(){

                var card = {
                    cardId : $scope.task.taskId+"_card_"+$scope.index,
                    cardDetail : $scope.cardDetail,
                    member : "",
                    taskId : $scope.task.taskId
                  }

                  $http.post('/api/addCard', card)
                      .success(function(response) {
                          if (response) {
                            $scope.index = parseInt(response.cardList[response.cardList.length-1].cardId.split("_")[3])+1;
                            $scope.cardList = response.cardList;
                            console.log("card added in board");
                            $scope.showInputSection = false;
                          }
                  });
          };
          $scope.addCardList = function($event){
                $(".input-section").hide();
                $($event.target).parent().parent().parent().find(".add-card-section").show();
                $scope.cardDetail = "";
                $scope.showInputSection=true;
          };
          $scope.hideInputSection = function(){
               $scope.showInputSection=false;
          };

        } ]//DOM manipulation
    }
}).directive('cardItem',["$http",function ($http) {
    return {
        restrict: 'E',
        scope: {
          card: "="
        },
        templateUrl: 'assets/js/views/card.html',
         require: '^^myTask',

        link: function ($scope, element, attrs,myTaskCtrl) {
          $scope.showEditingSection = false;
           $scope.taskList = [];
          $scope.editOptions = {
            editDetailBox :false,
            editMemberBox :false,
            selectTaskBox : false
          };
          $scope.updateCardList=function(){
            $http.get('/api/getTasks').success(function(response) {
              $scope.taskList = response;
              $scope.selectedTask = response[0];
                //$scope.$apply($scope.taskList);
            });
          };
          $scope.updateCardList();

          $scope.editCard=function($event){
            $(".input-section").hide();
            $($event.target).parent().parent().parent().find(".edit-card-section").show();
            $scope.showEditingSection = true;
          }
          $scope.closeEditCard =function(){
              $scope.showEditingSection = false;
              $scope.editOptions.selectTaskBox = false;
              $scope.editOptions.editMemberBox = false;
              $scope.editOptions.editDetailBox = false;
          }
          $scope.showMoveCard=function(){
           $scope.editOptions.selectTaskBox = true;
           $scope.editOptions.editMemberBox = false;
           $scope.editOptions.editDetailBox = false;
         }
         $scope.showCardMemberBox=function(){
          $scope.editOptions.selectTaskBox = false;
          $scope.editOptions.editMemberBox = true;
          $scope.editOptions.editDetailBox = false;
        }
        $scope.showCardDetailBox=function(){
         $scope.editOptions.selectTaskBox = false;
         $scope.editOptions.editMemberBox = false;
         $scope.editOptions.editDetailBox = true;
       }
         $scope.removeCard= function(card){
           $http.post('/api/removeCard',card).success(function(response) {
               //Update card list
               $scope.$parent.$parent.getCardList();
            });
         }
         $scope.submitCard=function(card){
           if($scope.editOptions.selectTaskBox){
             var moveCardData = {
               card:card,
               newTask : $scope.selectedTask
             }
             $http.post('/api/moveCard',moveCardData).success(function(response) {
                 //Update whole board
                 $scope.$parent.$parent.$parent.$parent.updateTasks();
              });
           }
           else if($scope.editOptions.editMemberBox){
             var changedCard = card;
             card.member = $scope.newCardMember
             $http.post('/api/ChangeCardData',card).success(function(response) {
                //Update whole board
                 $scope.$parent.$parent.$parent.$parent.updateTasks();
              });
           }
           else if($scope.editOptions.editDetailBox){
             var changedCard = card;
             card.cardDetail = $scope.newCardDetail;
             $http.post('/api/ChangeCardData',card).success(function(response) {
                 console.log(response);
                 $scope.$parent.$parent.$parent.$parent.updateTasks();
              });
           }

          }

        } //DOM manipulation
    }
}]);

var randomName = function(){
   var names = ["Sir Poop-a-lot", "Socraptes", "Butt", "Rear ender", "Gluteus Maximus"];
   return names[Math.floor(Math.random() * (names.length))];
}
var generateRandomId = function(){
    return Math.random().toString(36).substring(11);
}

function ListController($scope, $cookieStore, $routeParams, ListItems, $timeout, UserList) {
   $scope.url = 'https://'+window.location.host+'/'+$routeParams.listid;
   var ListItems = ListItems.bind({listid:$routeParams.listid});
   $scope.items = ListItems.query();
   
   (function tick() {
       ListItems.query({
       }, function(model) {
           $scope.items = model;
           $timeout(tick, 3000);
       });
   })();

   $scope.init = function () {   
      $scope.currId = $cookieStore.get('id');
      if (!$scope.currId) {
         var temp = randomName();
         $cookieStore.put('name', temp);
         $scope.currName = temp;
         var newUser = {name: $scope.currName, room: $routeParams.listid, inRoom: 1, waiting: false};
         UserList.create(newUser, function(model) {
            newUser = model;
            $cookieStore.put('id', newUser.id);
            $scope.currId = newUser.id;
            console.log("No existing id User " + $scope.currName + " just joined. " + $scope.currId);
            newItem = {text: $scope.currName + " has joined the chat.", name: $scope.currName}
            ListItems.create(newItem, function(model) {
               newItem = model;
               $scope.items = ListItems.query();
               $scope.items.push(newItem);
            });
         });
      } else {
         $scope.currName = $cookieStore.get('name');
         newItem = {text: $scope.currName + " has joined the chat.", name: $scope.currName}
         ListItems.create(newItem, function(model) {
            newItem = model;
            $scope.items = ListItems.query();
            $scope.items.push(newItem);
         });
      }
   };

   $scope.changeName = function() {
      if($scope.nameText == "") {
         $cookieStore.put('name', randomName());
      } else {
         $cookieStore.put('name', $scope.nameText);
      }
      $scope.currName = $cookieStore.get('name');
   };
   
   $scope.addNewItem = function() {
      newItem = {text: $scope.itemText, name: $scope.currName}
      newItem = ListItems.create(newItem);
      $scope.items.push(newItem);
      $scope.itemText = "";
   };
   
   $scope.$on('$locationChangeStart', function (event, next, current) {
      var newItem = {text: $scope.currName + " has left the room.", name: $scope.currName}
      ListItems.create(newItem, function(model) {
         newItem = model;
         $scope.items = ListItems.query();
         $scope.items.push(newItem);
      });
   });
}

function MainController($scope, $routeParams, UserList, $cookieStore) {
   $scope.users = UserList.query();

   $scope.newRoom = function() {
   
      window.location = 'https://'+window.location.host+'/'+generateRandomId();
   }
   
   $scope.findRoom = function() {
      if (!$scope.users || $scope.numOnline <= 0) {
         $scope.message = "Sorry, nobody else is in the bathroom at this moment.";
      } else {
         //add random selection of waiting users later
         /*var flag = false;
         for (var i in $scope.users) {
            if (i.waiting) {
               flag = true;
               newUser.waiting = false;
               newUser.room = generateRandomId();
               newUser = UserList.update(newUser);
               window.location='https://'+window.location.host+'/'+newUser.room;
               i.waiting = false;
               i.room = newUser.room;
               i = UserList.update(i);
            }
         }
         
         if (!flag) {
            /*(function tick() {
               ListItems.query({
               }, function(model) {
                  $scope.items = model;
                  $timeout(tick, 3000);
               });
            })();*/
      }
   }
 
   $scope.deleteAllUsers = function() {
      //$scope.users = UserList.query();
      var temp = [];
      //for (var i in $scope.users) {
         //console.log("removing..." + $scope.users[i].id);
         UserList.remove(temp);
      //}
      window.location = "https://"+window.location.host+"/";
   }
 
   $scope.init = function() {
      $scope.currId = $cookieStore.get('id');
      if (!$scope.currId) {
         var temp = randomName();
         $cookieStore.put('name', temp);
         $scope.currName = temp;
         var newUser = {name: $scope.currName, room: "", inRoom: 0, waiting: true};
         UserList.create(newUser, function(model) {
            newUser = model;
            $cookieStore.put('id', newUser.id);
            $scope.currId = newUser.id;
         });
         //$cookieStore.put('currUser', newUser);
      } else {
         //$cookieStore.put('currUser', newUser);
      }
      $scope.currName = $cookieStore.get('name');
      
      UserList.query({}, function(model) {
         $scope.users = model;
         if(!$scope.users) {
            $scope.numOnline = 0;
         } else {
            $scope.numOnline = $scope.users.length;
         }
       });
   }
}
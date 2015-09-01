var app = angular.module('AngularUIBucketApp', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui",
    "firebase",
    "ui.bootstrap",
    "ui.select",
    'ngSanitize',
//    "ngAnimate",
    "toastr"
]);
 
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: "signin.html"
    });
    $routeProvider.when('/main', {
        templateUrl: 'main.html'
    });
    
    $routeProvider.when('/viewpeople', {
        templateUrl: 'viewpeople.html'
    });
    $routeProvider.when('/createpeople', {
        templateUrl: 'createpeople.html'
    });
    
    $routeProvider.when('/editpeople',{
        templateUrl:'editpeople.html'
    });
    
    $routeProvider.when('/createrecord',{
        templateUrl:'createrecord.html'
    });
    
    $routeProvider.when('/viewrecord', {
        templateUrl:'viewrecord.html'
    });
    
    $routeProvider.when('/viewrecord_all',{
        templateUrl:'viewrecord_all.html'
    });
    
//    ngToastProvider.configure({
//      verticalPosition: 'bottom',
//      horizontalPosition: 'center',
//      maxNumber: 3
//    });

});


app.controller('MainController', ['$scope','$firebaseSimpleLogin','$location', "toastr", "$compile",
    function($scope,$firebaseSimpleLogin,$location,toastr ,$compile) {
 
        // Init Firebase
        var ref = new Firebase("https://radiant-heat-7078.firebaseio.com/");
//        var auth = $firebaseSimpleLogin(ref);
 
//         Initialized the user object
        $scope.user = {
            username: "",
            password: ""
        };
        
        $scope.main=function(){
          $location.path("/main");  
        };
 
        
        // Handle Email/Password login
        // Sign In auth function
        $scope.signin = function() {
            
            ref.authWithPassword({
              "email": "joekoken@hotmail.com",
              "password": "12345678"
            }, function onAuth(error, authData) {
              if (error) {
//                $location.path('/viewpeople');
                console.log("Login Failed!", error);
              } else {
//                
                console.log("Authenticated successfully with payload");
                
                console.log("here");
                $scope.userEmailId = authData.email;
                  
                $scope.userid=authData.uid;
                localStorage.login=authData.uid;  
                $scope.loggedIn = true;
                $location.path('/main');
              }
            });
            
            return false;
        };
        
//        // Sign In auth function
//        $scope.signin = function() {
////            var email = $scope.user.username;
////            var password = $scope.user.password;
//            var email = "joekoken@hotmail.com";
//            var password = "12345678";
//            if (email && password) {
//                    // Sign In Logic
//                    auth.$login('password', {
//                            email: email,
//                            password: password
//                        })
//                        .then(function(user) {
//                            // On success callback
//                            console.log('Username and password found');
//                            $scope.userEmailId = user.email;
//                            $scope.userid=user.uid;
////                            console.log($scope.userid);
//                            $scope.loggedIn = true;
//                            $location.path('/main');
//                            
//                        }, function(error) {
//                            // On failure callback
//                            console.log('Username and password not found');
//                        });
//            }
//        };
        
        
        
        $scope.patient={
            name:"",
            phone:"",
            email:"",
            sex:"",
            age:"",
            
        };
        
        $scope.pcreate=function(){
            var pname=$scope.patient.name;
            var pemail=$scope.patient.email;
            var pphone=$scope.patient.phone;
            var psex=$scope.patient.sex;
            var page=$scope.patient.age;
            var patientRef=ref.child(localStorage.login+"/patient");
            if(pname!==''){
                patientRef.push({
                    name:pname,
                    email:pemail,
                    phone:pphone,
                    sex:psex,
                    age:page,
                });
                $location.path('/viewpeople');
            }
            else{
                toastr.error("Please input your patient information","",{timeOut:2000, positionClass:'toast-bottom-full-width'});

            }
            
        };

        $scope.logout = function() {
            $scope.loggedIn = false;   // to toggle display of SignUp/Logout
            $scope.user = {            // re init the user object
                username: "",
                password: ""
            };

            $location.path('/');       // redirect to home page after logout
        };
        

        $scope.viewpeopleload=function(){
            var patientRef=ref.child(localStorage.login+"/patient");
            patientRef.on("value",function(snapshot){
//                console.log(patient);
                var i=0;
                var mypatientlist=angular.element(document.querySelector("#MyPatientList"));
                mypatientlist.empty();
                snapshot.forEach(function(patient){
                    
                    var el=$compile('<a class="list-group-item" ng-Click="editpeople($event);" id="'+patient.key()+'">'+patient.child("name").val()+"<br>"+patient.child("email").val()+"<br>"+patient.child("phone").val()+'</a>')($scope);
                    mypatientlist.append(el);
//                    var $scope=angular.element("#MyPatientList").scope();
                    
//                    console.log('%s,%s,%s',patient.child("email").val(),patient.child("name").val(),patient.child("phone").val());
                });
//                var patient=snapshot.val();
                
//                console.log(patient.name);
            });
        };
        
        $scope.viewpeople =function(){

            $location.path('/viewpeople');
        };
                
        $scope.editpeopleload=function(){
            var pid=localStorage.getItem("pid");
//            console.log(pid);
            var patientRef=ref.child(localStorage.login+"/patient/"+pid);
            patientRef.on("value",function(snapshot){
                $scope.patient={
                    name:snapshot.child("name").val(),
                    phone:snapshot.child("phone").val(),
                    email:snapshot.child("email").val(),
                    sex:snapshot.child("sex").val(),
                    age:snapshot.child("age").val()
                };
            });
            
        };
        
        $scope.createpeople =function(){
            $scope.patient={
                name:"",
                phone:"",
                email:"",
                sex:"",
                age:"",

            };
            $location.path('/createpeople');
        };
        
        $scope.editpeople=function(event){
            localStorage.setItem("pid", event.target.id);
            
//            console.log(event.target.id);
            $location.path('/editpeople');
        };
                
        $scope.psave=function(){
            var pname=$scope.patient.name;
            var pemail=$scope.patient.email;
            var pphone=$scope.patient.phone;
            var psex=$scope.patient.sex;
            var page=$scope.patient.age;
            var pid=localStorage.getItem("pid");
            var patientRef=ref.child(localStorage.login+"/patient/"+pid);
            if(pname!==''){
                patientRef.update({
                    name:pname,
                    email:pemail,
                    phone:pphone,
                    sex:psex,
                    age:page,
                });
                $scope.patient={
                    name:"",
                    phone:"",
                    email:"",
                    sex:"",
                    age:""
                };
                toastr.success("Record Save","",{timeOut:2000, positionClass:'toast-bottom-full-width'});
                $location.path('/viewpeople');
            }
            else{
                toastr.error("Please input your patient information","",{timeOut:2000, positionClass:'toast-bottom-full-width'});

            }
            
        };
        
        $scope.deletepeople=function(){
            var pid=localStorage.getItem("pid");
            var patientRef=ref.child(localStorage.login+"/patient/"+pid);
            patientRef.remove();
            $location.path('/viewpeople');
            
        };
        
        $scope.createrecord=function(){
            $scope.record={
                main:"",
                current:"",
                history:"",
                tongue:"",
                check:"",
                result:"",
                solution:"",
                date:new Date(),
            };

            
            var patientRef=ref.child(localStorage.login+"/patient");
            $scope.patients=[];
            $scope.person = {};
            patientRef.on("value",function(snapshot){

                snapshot.forEach(function(data){
//                     console.log(data.key());
                    $scope.patients.push(                        
                        {
                           
                            pid:data.key(),
                            name:data.child("name").val(),
                            phone:data.child("phone").val(),
                            email:data.child("email").val()
                        }
                    );
                });
//                console.log($scope.patients);
            });
            

            $location.path('/createrecord');
        };
        
        
 
        
        
        $scope.rcreate=function(){
            var rmain=$scope.record.main;
            var rcurrent=$scope.record.current;
            var rhistory=$scope.record.history;
            var rtongue=$scope.record.tongue;
            var rcheck=$scope.record.check;
            var rresult=$scope.record.result;
            var rsolution=$scope.record.solution;
//            var test=new Date($scope.record.date);
//            var test2=test.format('dd-MM-yyyy');
//            console.log(test2);
            var rdate=$scope.record.date.toString();
            
//          if($scope.testForm.$valid){
//            console.log("success");
//          }else{
//            console.log("validation error");
//            $scope.submitted = true;
//          }
            if(!$scope.person.selected){
//                toastr.options.preventDuplicates = true;
                toastr.error("Please select patient","",{timeOut:2000, positionClass:'toast-bottom-full-width', preventDuplicates: 'true'});
            }
            else{
                var pid=$scope.person.selected.pid;
                var recordRef=ref.child(localStorage.login+"/patient/"+pid+"/record/");
//                console.log(pid);

    //            if(pname!==''){
                    recordRef.push({
                        main:rmain,
                        current:rcurrent,
                        history:rhistory,
                        tongue:rtongue,
                        check:rcheck,
                        result:rresult,
                        solution:rsolution,
                        date:rdate,
                    });
                    $scope.record={
                        main:"",
                        current:"",
                        history:"",
                        tongue:"",
                        check:"",
                        result:"",
                        solution:"",
                        date:"",
                    };
                    toastr.success("Record Save","",{timeOut:2000, positionClass:'toast-bottom-full-width'});
                    $location.path('/main');
//            }
            }
        };
        
        $scope.format=['dd-MM-yyyy'];
        
        
        $scope.viewrecord =function(){
            $location.path('/viewrecord');
        };
        $scope.viewrecord_all =function(){
            $location.path('/viewrecord_all');
        };
        
        $scope.viewrecord_allload=function(){
            var patientRef=ref.child(localStorage.login+"/patient");
            $scope.patients=[];
            $scope.person = {};
            patientRef.on("value",function(snapshot){

                snapshot.forEach(function(data){
                     console.log(data.key());
                    $scope.patients.push(                        
                        {
                           
                            pid:data.key(),
                            name:data.child("name").val(),
                            phone:data.child("phone").val(),
                            email:data.child("email").val()
                        }
                    );
                });
                console.log($scope.patients);
            });
        };

    }
                                  
                                
                                  
                                  
]);


app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

app.directive('datepickerPopup', function (){
  return {
    restrict: 'EAC',
    require: 'ngModel',
    link: function(scope, element, attr, controller) {
      //remove the default formatter from the input directive to prevent conflict
      controller.$formatters.shift();
    }
  }
})

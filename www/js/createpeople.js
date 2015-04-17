var db;
var dbCreated = false;
 
//var scroll = new iScroll('wrapper', {
// vScrollbar : false,
// hScrollbar : false,
// hScroll : false
//});
// document.addEventListener("deviceready", onDeviceReady, false);
 
function formcreate() {
 
// var fname = document.getElementById("fname").value;
// var lname = document.getElementById("lname").value;
// var age = document.getElementById("age").value;
// var username = document.getElementById("username").value;
// var password = document.getElementById("psw").value;
 var name = document.getElementById("pname").value;
 var phone = document.getElementById("pphone").value;
 var email = document.getElementById("pemail").value;
 
 db = window.openDatabase("cmedicineDB", "1.0", "cmedicine", 200000);
 db.transaction(populateDB, transaction_error, populateDB_success);
}
 
function populateDB(tx) {
 // tx.executeSql('DROP TABLE IF EXISTS Patient');
tx.executeSql('CREATE TABLE IF NOT EXISTS Patient (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name VARCHAR(50),phone INTEGER,email VARCHAR(50))');
 var name = document.getElementById("pname").value;
 var phone = document.getElementById("pphone").value;
 var email = document.getElementById("pemail").value;
 tx.executeSql("INSERT INTO Patient (name,phone,email) VALUES ('"+ name +"','"+ phone +"' , '"+ email+"')");
  
}
 
function transaction_error(tx, error) {
 alert("Database Error: " + error);
}
   
function populateDB_success() {
 // dbCreated = true;
  
 // where you want to move
 alert("Successfully inserted");
 window.location="viewpeople.html";
}


var ref = new Firebase("https://rentit-web.firebaseio.com");
var postRef = new Firebase("https://rentit-web.firebaseio.com/Posts");

function EL(id) { return document.getElementById(id); } // Get el by ID helper function

var Price;
var Title;
var imgCode;
var count=0;
var key;
var displayoption;
var selectedCategory;
var selectedProduct;
var selectedCity;
var selectedStartDate;
var selectedEndDate;

$(document).ready(function() {
    selectedProduct = sessionStorage.getItem("product");
    $('#productInput').attr("placeholder",selectedProduct);
    console.log("product:" + selectedProduct);
    selectedCity = sessionStorage.getItem("city");
    $("#cityInput").attr("placeholder",selectedCity);
    console.log("city:" + selectedCity);
});



displayoption =sessionStorage.getItem("option");

switch (displayoption){
    case 1:
        displayAll(); //option 1 to display all
        break;
    case 2:
        displayByCategory();
        break;
    case 3:
        displayByProduct();
        break;
    default:
        break;
}

//function that displays all categories/products
function displayAll(){
    postRef.on("child_added",function(snapshot){
            var newPost = productSnapshot.val();
            Price = newPost.Amount;
            Title = newPost.Title;
            imgCode = newPost.image;
            key = productSnapshot.key();
            count++;
            populatePosts();
    });

}



function displayByCategory(){
    //read the selected category
    selectedCategory = sessionStorage.getItem("category");
    //query the database to retrieve only the category
    postRef.orderByChild("Category").equalTo(selectedCategory).on("child_added", function(snapshot){
            var newPost = snapshot.val();
            Price = newPost.Amount;
            Title = newPost.Title;
            imgCode = newPost.image;
            key = productSnapshot.key();
            count++;
            populatePosts();
    });
}

function displayByProduct(){

    selectedCity = sessionStorage.getItem("city");
    selectedProduct = sessionStorage.getItem("product");

//query the database to retrieve only  the product being searched
    postRef.orderByChild("Product").equalTo(selectedProduct).on("child_added", function(productSnapshot){

        if(productSnapshot.val().City == selectedCity) {
            var newPost = productSnapshot.val();
            Price = newPost.Amount;
            Title = newPost.Title;
            imgCode = newPost.image;
            key = productSnapshot.key();
            count++;
            populatePosts();

        }
    });


}


function populatePosts(){

    var postContent = EL("postFigure1").cloneNode(true);
    postContent.setAttribute("id",key);
    postContent.className= "figure";
    contentChildren = postContent.children;

    //set image src
    contentChildren[0].setAttribute("src",imgCode);
    contentChildren[0].setAttribute("alt",Price);

    //add price over image
    contentChildren[1].innerText = (Price+" Kr/Day");

    //set title to caption
    contentChildren[2].innerText=Title;

    //position the DOM to left or right
    if (count % 2 !=0) {
        EL("postFigureLeft").appendChild(postContent);
    }else{

        EL("postFigureRight").appendChild(postContent);

    }
}



//Google map initialize
function initMap() {
    var mapDiv = EL('googleMap');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 55.6761, lng: 12.5683},
        zoom: 12
    });

}

//login authentication method
function loginUser(){
    //read login input
    var emailLogin = EL("loginEmail").value;
    var passwordLogin = EL("loginPass").value;

    //authenticate with Firebase
    ref.authWithPassword({
        email: emailLogin,
        password: passwordLogin

    }, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            alert("Login failed, please try again");
        } else {
            console.log("Authenticated successfully with payload:", authData);
            ref.onAuth(authDataCallback); //if successful, call onAuth and change header and display Post button
            $("#loginModal").modal("hide");
        }
    });
}

//load php according to authentication status
function authDataCallback(authData) {
    //if user is authenticaed, display corresponding header and button
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        uid = authData.uid; //retrieve uid
        $("#SearchResultHeader").load("AuthHeader.php");
    } else {
        console.log("User is logged out");
        //if user logout, display corresponding header and button
        $("#SearchResultHeader").load("UnauthHeader.php");
    }
}


//logout function
function logout() {
    ref.unauth();
    ref.onAuth(authDataCallback);
}



function createUsers() {

    var registerEmail = EL("registerEmail").value;
    var registerPassword = EL("registerPassword").value;

    ref.createUser({
        email: registerEmail,
        password: registerPassword
    }, function (error, userData) {
        if (error) {
            console.log("Error creating user:", error);
            alert("registration failed, please Try Again");

        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            $("#RegistrationModal").modal("hide");
            alert("registration successful, please Sign In");
        }
    });
}


function userDetails() {
    var userName = EL("registerName").value;
    var email = EL("registerEmail").value;
    var bday = EL("registerBday").value;
    var gender = EL("registerGender").value;

    userRef.push().set({
        Name:userName,
        Email:email,
        Birthday:bday,
        Gender:gender
    });
}

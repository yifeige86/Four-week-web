/**
 * Created by yifei on 5/23/16.
 */


//Firebase ref

var ref = new Firebase("https://rentit-web.firebaseio.com");
var userRef=new Firebase("https://rentit-web.firebaseio.com/Users");
var postRef=new Firebase("https://rentit-web.firebaseio.com/Posts");

var uid; //user id, to be added into post, to retrieve publisher information in future development
//simplify getElementByID
function EL(id){
    return document.getElementById(id);
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
        $("#HomepageHeader").load("AuthHeader.php");
        $("#startPageunauth").load("postItem.php");
    } else {
        console.log("User is logged out");
        //if user logout, display corresponding header and button
        $("#HomepageHeader").load("UnauthHeader.php");
        $("#startPageunauth").load("unauthPostItem.php");
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
        Gender:gender,
    });
}


function CreatePost() {
    var Categories = EL("postCategory").value;
    var Title = EL("postTitle").value;
    var Product = EL("postProduct").value;
    var Amount = EL("postPrice").value;
    var city = EL("postCity").value;
    var startDate = EL("postStartDate").value;
    var endDate = EL("postEndDate").value;
    var description = EL("postDescription").value;
    var image = EL("postImg").getAttribute("src"); //read the Base64 String of the image

    postRef.push().set({
            Category: Categories,
            Product: Product,
            Title: Title,
            Amount: Amount,
            City: city,
            StartDate: startDate,
            EndDate:endDate,
            Description: description,
            image:image,
            Uid: uid
        },
        function(error, authData) {
            if (error) {
                console.log("Posting Failed!", error);
                alert("Your post failed to publish, please try again");
            } else {
                $("#ItemModal").modal("hide");
            }
        });
}


//upload file and convert to Base64 string
function readFile() {
    if (this.files && this.files[0]) {
        var FR= new FileReader();
        FR.onload = function(e) {
            EL("postImg").src= e.target.result; //set src of the img to Base64 String
        };
        FR.readAsDataURL( this.files[0] );
    }
}

//listener for changes in the file
EL("inp").addEventListener("change", readFile, false);


//pass search criteria to searchResult page
function passSearch(){
    var product= document.getElementById("productInput").value;
    var city = document.getElementById("cityInput").value;
    var startDate = document.getElementById("startDateInput").value;
    var endDate = document.getElementById("endDateInput").value;
    sessionStorage.setItem("product", product);
    sessionStorage.setItem("city",city);
    sessionStorage.setItem("startDate",startDate);
    sessionStorage.setItem("endDate",endDate);
    sessionStorage.setItem("option","3");
    window.open("SearchResult.html");
}


//onclick for all categories
function allCategories(){
    sessionStorage.setItem("option","1");
    window.open("SearchResult.html");
}

//onclick for selected Category

function selectedCategory(id){
    sessionStorage.setItem("option","2");
    sessionStorage.setItem("category",id);
    window.open("SearchResult.html");


}
var signup = document.getElementById('signup').getElementsByTagName("input");
var signupBtn = document.getElementById('signup').getElementsByTagName("button");

signup[0].addEventListener("keydown", validateSignup, false);
signup[1].addEventListener("keydown", validateSignup, false);
signup[2].addEventListener("keydown", validateSignup, false);
signup[3].addEventListener("keydown", validateSignup, false);

function validateSignup() {
  console.log(signupBtn);
}



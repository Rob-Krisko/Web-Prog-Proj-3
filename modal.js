//Login
const login = document.querySelector(".login");
const loginOverlay = document.querySelector(".loginOverlay");
const openLoginBtn = document.querySelector(".login-open");
const closeLoginBtn = document.querySelector(".login-close");
const loginForm = document.querySelector(".login-form");
//Register
const registrationModal = document.querySelector(".registration");
const registrationOverlay = document.querySelector(".register-overlay");
const openRegistrationBtn = document.querySelector(".btn-register");
const closeRegistrationBtn = document.querySelector(".register-close");
const registrationForm = document.querySelector(".registration-form");

// Added this function to save user data to localStorage
function saveUserData(username, password) {
  const userData = {
    username: username,
    password: password,
  }
  localStorage.setItem(username, JSON.stringify(userData));
}

// Updated this function to retrieve user data from localStorage
function getUserData(username) {
  const userData = localStorage.getItem(username);
  if (userData) {
    const { password } = JSON.parse(userData);
    return { password };
  }
  return null;
}

// Modified the registration form event listener
registrationForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.querySelector('#name').value;
  const password = document.querySelector('#pass').value;
  const passwordConfirm = document.querySelector('#passtwo').value;

  if (password !== passwordConfirm) {
    // Passwords do not match
    console.log('Passwords do not match');
  } else {
    saveUserData(username, password);
    console.log('Registration successful');
    console.log(username);
    console.log(password);
    closeRegister();
  }
});

// Modified the login form event listener
loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#lpassword').value;
  const storedUserData = getUserData(username);

  if (storedUserData && storedUserData.password === password) {
    // authentication successful
    console.log('Login successful');
    console.log(username);
    console.log(password);
    localStorage.setItem('lastLoggedInUser', username); // Save the last logged-in user
    closeLogin();
    updateUserDisplay(username);
  } else {
    // authentication failed
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function (error) {
      error.textContent = 'Invalid username or password';
    });
  }
});

//------------------------------Login----------------------------
// close modal function
const closeLogin = function () {
  login.classList.add("login-hidden");
  loginOverlay.classList.add("login-hidden");
};

// close the modal when the close button and overlay is clicked
closeLoginBtn.addEventListener("click", closeLogin);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !login.classList.contains("login-hidden")) {
    closeLogin();
  }
});

// open modal function
const openLogin = function () {
  login.classList.remove("login-hidden");
  loginOverlay.classList.remove("login-hidden");
};
// open modal event
openLoginBtn.addEventListener("click", openLogin);

//------------------------------Registration----------------------------
// close modal function
const closeRegister = function () {
  registrationModal.classList.add("register-hidden");
  registrationOverlay.classList.add("register-hidden");
};

// close the modal when the close button and overlay is clicked
closeRegistrationBtn.addEventListener("click", closeRegister);
registrationOverlay.addEventListener("click", closeRegister);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !registrationModal.classList.contains("register-hidden")) {
      closeRegister();
    }
  });
  
  // open modal function
  const openRegister = function () {
    registrationModal.classList.remove("register-hidden");
    registrationOverlay.classList.remove("register-hidden");
  };
  // open modal event
  openRegistrationBtn.addEventListener("click", openRegister);
  
  // Function to update the user display
  function updateUserDisplay(username) {
    const usernameElement = document.querySelector('#Username');
    if (username) {
      usernameElement.textContent = `Welcome ${username}`;
    } else {
      usernameElement.textContent = 'User Not Logged In';
    }
  }
  
  // Get the last logged-in user's username and update the user display
  const lastLoggedInUser = localStorage.getItem('lastLoggedInUser');
  if (lastLoggedInUser) {
    updateUserDisplay(lastLoggedInUser);
  } else {
    updateUserDisplay(null);
  }
  

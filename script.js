// Greet if already logged in during session
window.onload = function () {
  const user = localStorage.getItem("loggedInUser");
  const bookingSection = document.getElementById("bookingSection");
  const bookingHistorySection = document.getElementById("bookingHistorySection");
  const paymentSection = document.getElementById("paymentSection");
  const loginButton = document.getElementById("loginButton");
  const greeting = document.getElementById("greeting");
  
  // Show the booking and booking history links if logged in
  if (user) {
    if (bookingSection) bookingSection.style.display = "block";
    if (bookingHistorySection) bookingHistorySection.style.display = "block";
    if (paymentSection) paymentSection.style.display = "block";
    if (loginButton) loginButton.innerText = "Logout";  // Change the login button to logout if logged in
  } else {
    if (bookingSection) bookingSection.style.display = "none";
    if (bookingHistorySection) bookingHistorySection.style.display = "none";
    if (paymentSection) paymentSection.style.display = "none";
    if (loginButton) loginButton.innerText = "Login";  // Show login if not logged in
  }

  // Update greeting message if logged in
  if (greeting && user) {
    greeting.innerText = `Welcome, ${user}`;
  }

  // Redirect protection for booking pages
  if (location.pathname.includes("CarBooking.html") && !user) {
    showLoginModal();
  }

  // Login/Logout button functionality
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      if (user) {
        // Handle logout
        localStorage.removeItem("loggedInUser");
        alert("You have logged out successfully.");
        window.location.href = "index.html"; // Redirect to homepage after logout
      } else {
        // Redirect to login page if not logged in
        window.location.href = "Login.html";
      }
    });
  }

  // Existing user retrieval code
  const users = JSON.parse(localStorage.getItem("users"));  // Assume it's an array of user objects
  const usernameDisplay = document.getElementById("usernameDisplay");

  // Clear the previous content in the userDataSection
  if (usernameDisplay) {
    usernameDisplay.innerHTML = "";  // Clear previous content
  }

  // Check if there are users in localStorage and display them
  if (users && users.length > 0) {
    users.forEach((user, index) => {
      const userElement = document.createElement("div");
      userElement.classList.add("user-element");

      // Create username and email display
      const userNameEmail = document.createElement("p");
      userNameEmail.innerHTML = `Username ${index + 1}: ${user.username} <br> Email: ${user.email}`;
      userElement.appendChild(userNameEmail);

      // Create password field with a toggle button
      const passwordContainer = document.createElement("div");
      passwordContainer.classList.add("password-container");

      const passwordField = document.createElement("input");
      passwordField.type = "password";  // Set the input type to 'password'
      passwordField.value = user.password;  // Assuming each user object has a 'password' field
      passwordField.id = `password-${index}`;
      passwordField.disabled = true;  // Disable password field by default

      const toggleButton = document.createElement("button");
      toggleButton.innerText = "Show Password";
      toggleButton.addEventListener("click", function() {
        // Toggle password visibility
        if (passwordField.type === "password") {
          passwordField.type = "text";
          toggleButton.innerText = "Hide Password";
        } else {
          passwordField.type = "password";
          toggleButton.innerText = "Show Password";
        }
      });

      // Get the reset modal and close button elements
      const modal = document.getElementById("resetModal");
      const closeModalButton = document.getElementsByClassName("close")[0];

      // Reset Password Button (Triggers Modal)
      const resetPasswordButton = document.createElement("button");
      resetPasswordButton.innerText = "Reset Password";

      resetPasswordButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent form submission (if applicable)

        // Show the modal directly when the button is clicked
        if (modal) {
          modal.style.display = "block"; // Display the modal
        }
      });

      // Add the reset password button to the DOM (if it's a dynamic button)
      // This assumes you want to append this to a specific container, e.g., user element.
      // Example: document.body.appendChild(resetPasswordButton);

      // Close modal when the "×" button is clicked
      if (closeModalButton) {
        closeModalButton.addEventListener("click", function () {
          if (modal) {
            modal.style.display = "none"; // Hide the modal
          }
        });
      }

      // Optionally close modal if clicked outside modal content
      window.addEventListener("click", function (event) {
        if (event.target === modal) {
          modal.style.display = "none"; // Close modal if clicked outside
        }
      });

      passwordContainer.appendChild(passwordField);
      passwordContainer.appendChild(toggleButton);
      passwordContainer.appendChild(resetPasswordButton);
      userElement.appendChild(passwordContainer);

      // Append the user element to the user display section
      usernameDisplay.appendChild(userElement);
    });
  } else {
    const noUsersMessage = document.createElement("p");
    noUsersMessage.innerText = "No users found";
    usernameDisplay.appendChild(noUsersMessage);
  }
  // Close the modal when the close button (×) is clicked
  const closeModalButton = document.getElementsByClassName("close")[0];
  closeModalButton.addEventListener("click", function() {
    const modal = document.getElementById("resetModal");
    modal.style.display = "none";
  });
  
};

// Function to show the login modal
function showLoginModal() {
  const modal = document.getElementById("loginModal");
  modal.style.display = "flex"; // Display the modal

  // Add event listeners to modal buttons
  const closeButton = document.getElementById("modalCloseButton");
  const loginButton = document.getElementById("modalLoginButton");

  closeButton.onclick = function () {
    window.location.href = "index.html"; // Redirect to home page
  };

  loginButton.onclick = function () {
    window.location.href = "Login.html"; // Redirect to login page
  };
}

// Login Page logic
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  // Handle form submission
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("loginIdentifier").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();
      const msg = document.getElementById("loginMessage");

      // Validate username and password input
      if (!username || !password) {
        msg.textContent = "Please enter both username and password.";
        return;
      }

      // Hardcoded admin credentials
      const admin = { username: 'admin', password: 'admin123', role: 'admin' };

      // Check if the entered credentials match admin
      if (username === admin.username && password === admin.password) {
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userRole", 'admin');
        window.location.href = "AdminDashboard.html";
        return;
      }

      // Get existing users or initialize empty array
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Find user by username or email
      const user = users.find(u => 
        (u.username.toLowerCase() === username || u.email.toLowerCase() === username)
      );

      if(user) {
        if (user.password === password) {
          // If user is found and password matches, log in
          localStorage.setItem("loggedInUser", username);
          localStorage.setItem("userRole", 'user');
          window.location.href = "index.html";
        } else {
          // If no user found or password doesn't match, show an error
          msg.textContent = "Invalid password.";
          return;
        }
      } else {
        window.location.href = "Register.html";
      }
    });
  }

  // Reset Password logic
  const resetPasswordButton = document.getElementById("resetPasswordButton");
  const modal = document.getElementById("resetModal");
  const closeModalButton = document.getElementById("closeModalButton");
  const closeIcon = document.getElementsByClassName("close")[0];

  // Show the modal when "Reset Password" is clicked
  if (resetPasswordButton) {
    resetPasswordButton.addEventListener("click", function() {
      modal.style.display = "block";
    });
  }

  // Close the modal when the "×" icon is clicked
  if (closeIcon) {
    closeIcon.addEventListener("click", function() {
      modal.style.display = "none";
    });
  }

  // Close the modal when the "Close" button is clicked
  if (closeModalButton) {
    closeModalButton.addEventListener("click", function() {
      modal.style.display = "none";
    });
  }
});





// Register with username, email, password
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();
      const msg = document.getElementById("registerMessage");

      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const exists = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
      );

      if (exists) {
        msg.textContent = "Username or email already exists.";
        setTimeout(function() {
          window.location.href = "Login.html"
        }, 2000);
        return;
      }

      users.push({ username, email, password, userRole: 'user' });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", username);
      localStorage.setItem("userRole", 'user');
      window.location.href = "index.html";
    });
  }
});

function goToDetails(carName) {
  window.location.href = "CarDescription.html?car=" + encodeURIComponent(carName);
}


// This JavaScript will be used for both CarTypes.html and CarDescription.html

document.addEventListener("DOMContentLoaded", function () {
  const carTitleElem = document.getElementById("carTitle");
  const carInfoElem = document.getElementById("carInfo");
  const carTypeElem = document.getElementById("carType");  // Element to display the car type
  const bookBtn = document.getElementById("bookButton");

  // Define car descriptions and types
  const descriptions = {
    "Toyota Corolla": {
      type: "Economy",
      description: "A reliable and fuel-efficient compact sedan. Perfect for city driving and daily commutes.",
      rate: {
        offPeak: "$3/hr",
        normal: "$5/hr",
        peak: "$9/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Kia Cerato": {
      type: "Economy",
      description: "A well-rounded and affordable compact sedan offering good performance and fuel efficiency.",
      rate: {
        offPeak: "$3/hr",
        normal: "$5/hr",
        peak: "$9/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Nissan Sylphy": {
      type: "Economy",
      description: "A comfortable and efficient sedan with a smooth ride and excellent value.",
      rate: {
        offPeak: "$3/hr",
        normal: "$5/hr",
        peak: "$9/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Hyundai Elantra": {
      type: "Economy",
      description: "A stylish and efficient compact sedan, ideal for daily commutes.",
      rate: {
        offPeak: "$3/hr",
        normal: "$5/hr",
        peak: "$9/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Mazda 3": {
      type: "Economy",
      description: "A sporty and stylish compact car with a refined driving experience.",
      rate: {
        offPeak: "$3/hr",
        normal: "$5/hr",
        peak: "$9/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Toyota Camry": {
      type: "Economy",
      description: "A reliable midsize sedan known for its comfort, efficiency, and durability.",
      rate: {
        offPeak: "$3/hr",
        normal: "$5/hr",
        peak: "$9/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Toyota Harrier": {
      type: "SUV",
      description: "A premium SUV offering comfort, elegance, and advanced safety features.",
      rate: {
        offPeak: "$6/hr",
        normal: "$9/hr",
        peak: "$13/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Mazda CX-5": {
      type: "SUV",
      description: "A compact SUV with excellent handling, comfort, and a stylish design.",
      rate: {
        offPeak: "$6/hr",
        normal: "$9/hr",
        peak: "$13/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Toyota Highlander": {
      type: "SUV",
      description: "A versatile three-row midsize SUV known for its comfortable ride, ample passenger and cargo space, and available hybrid powertrain options. ",
      rate: {
        offPeak: "$6/hr",
        normal: "$9/hr",
        peak: "$13/hr",
        mileage: "$0.39/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Hyundai Kona EV": {
      type: "Electric",
      description: "A compact and stylish all-electric SUV with a long range and advanced tech features.",
      rate: {
        offPeak: "$4/hr",
        normal: "$7/hr",
        peak: "$11/hr",
        mileage: "$0.29/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Nissan Leaf": {
      type: "Electric",
      description: "Compact and eco-friendly, perfect for urban driving.",
      rate: {
        offPeak: "$4/hr",
        normal: "$7/hr",
        peak: "$11/hr",
        mileage: "$0.29/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Chevrolet Bolt EV": {
      type: "Electric",
      description: "Affordable electric car with impressive range and performance.",
      rate: {
        offPeak: "$4/hr",
        normal: "$7/hr",
        peak: "$11/hr",
        mileage: "$0.29/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "BMW 318i": {
      type: "Luxury",
      description: "Compact luxury sedan offering dynamic performance, elegant design, and premium features.",
      rate: {
        offPeak: "$15/hr",
        normal: "$18/hr",
        peak: "$21/hr",
        mileage: "$0.49/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    },
    "Audi A4": {
      type: "Luxury",
      description: "Premium sedan with a stylish design and top-tier performance.",
      rate: {
        offPeak: "$15/hr",
        normal: "$18/hr",
        peak: "$21/hr",
        mileage: "$0.49/km"
      },
      hours: {
      offPeak: "9 PM – 7 AM (Mon-Fri), 10 PM – 8 AM (Sat-Sun & PH)",
      normal: "7 AM – 5 PM (Mon-Fri), 8 AM – 4 PM (Sat-Sun & PH)",
      peak: "5 PM – 9 PM (Mon-Fri), 4 PM – 10 PM (Sat-Sun & PH)"
      }
    }
  };

  // Function to handle car selection and display details
  function goToDetails(car) {
    const carData = descriptions[car];

    if (carData) {
      // Update car title, type, and info section
      carTitleElem.textContent = car; // Update car name
      carInfoElem.textContent = carData.description; // Update car description
      carTypeElem.textContent = "Car Type: " + carData.type; // Update car type

      // Display rate information
      const rateInfoElem = document.getElementById("rateInfo");
      rateInfoElem.innerHTML = `
        <p><strong>Off-Peak Rate:</strong> ${carData.rate.offPeak}</p>
        <p><strong>Normal Rate:</strong> ${carData.rate.normal}</p>
        <p><strong>Peak Rate:</strong> ${carData.rate.peak}</p>
        <p><strong>Mileage Charge:</strong> ${carData.rate.mileage}</p>
      `;
      
      // Display the "Book Now" button and add the link to the car booking page
      if (bookBtn) {
        bookBtn.href = "CarBooking.html?car=" + encodeURIComponent(car);
        bookBtn.style.display = "inline-block";  // Show the booking button
      }
    } else {
      // Handle car not found scenario
      carTitleElem.textContent = "Car not found";
      carInfoElem.textContent = "Sorry, we couldn't find details for that car.";
      carTypeElem.textContent = "";  // Clear car type if not found
      if (bookBtn) {
        bookBtn.style.display = "none";  // Hide the booking button if car not found
      }
    }
  }

  // If on CarDescription.html, fetch the car name from URL and display details
  const params = new URLSearchParams(window.location.search);
  const car = params.get("car");

  if (car) {
    goToDetails(car);  // Call the function to display the details for the selected car
  }

  // Add event listeners to car names (inside .car-card in CarTypes.html)
  const carCards = document.querySelectorAll(".car-card h3");
  carCards.forEach(function (card) {
    card.addEventListener("click", function () {
      goToDetails(card.textContent);  // Call the function to show the details of the clicked car
    });
  });
});

// Back to Home Button Click Event
document.addEventListener("DOMContentLoaded", function () {
  const backToHomeBtn = document.getElementById("backToHomeBtn");

  // Check if the button exists on the page
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", function () {
      window.location.href = "index.html"; // Redirect to HomePage.html
    });
  }
});



// CarBooking.html pre-fill car model from URL
document.addEventListener("DOMContentLoaded", function () {
  const carModelSelect = document.getElementById("carModel");
  const params = new URLSearchParams(window.location.search);
  const car = params.get("car");

  if (car && carModelSelect) {
    for (const option of carModelSelect.options) {
      if (option.value === car) {
        option.selected = true;
        break;
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Function to generate rental start time options
  function generateRentalTimes() {
    const rentalStartTimeSelect = document.getElementById('rentalStartTime');
    
    // Generate times in 30-minute increments (00, 30) for a 24-hour period
    for (let hour = 0; hour < 24; hour++) {
      let hourFormatted = hour < 10 ? `0${hour}` : `${hour}`;
      
      // Add hour block (e.g., 10:00)
      let optionHour = document.createElement('option');
      optionHour.value = `${hourFormatted}:00`;
      optionHour.textContent = `${hourFormatted}:00`;
      rentalStartTimeSelect.appendChild(optionHour);
      
      // Add 30-minute block (e.g., 10:30)
      let optionHalfHour = document.createElement('option');
      optionHalfHour.value = `${hourFormatted}:30`;
      optionHalfHour.textContent = `${hourFormatted}:30`;
      rentalStartTimeSelect.appendChild(optionHalfHour);
    }
  }

  // Call the function to populate the time options on page load
  generateRentalTimes();

    // Function to calculate the rental end time based on start time and duration
  function calculateEndTime() {
    const startTime = document.getElementById("rentalStartTime").value;
    const duration = parseFloat(document.getElementById("rentalPeriod").value);

    if (startTime && !isNaN(duration)) {
      // Parse the start time (e.g., "10:00" or "10:30")
      let [startHour, startMinute] = startTime.split(":").map(Number);
      
      // Convert the start time to minutes
      let startTimeInMinutes = startHour * 60 + startMinute;
      
      // Calculate the end time in minutes
      let endTimeInMinutes = startTimeInMinutes + duration * 60;
      
      // Convert back to hours and minutes
      let endHour = Math.floor(endTimeInMinutes / 60);
      let endMinute = Math.round(endTimeInMinutes % 60);

      // Format the end time as a string (e.g., "11:30")
      if (endHour >= 24) endHour -= 24;  // Handle overflow (e.g., "23:30" + 2 hours = "01:30")
      let endHourFormatted = endHour < 10 ? `0${endHour}` : `${endHour}`;
      let endMinuteFormatted = endMinute < 10 ? `0${endMinute}` : `${endMinute}`;

      // Set the end time in the input field
      document.getElementById("rentalEndTime").value = `${endHourFormatted}:${endMinuteFormatted}`;
    }
  }

  // Event listener to recalculate the end time whenever the start time or duration changes
  document.getElementById("rentalStartTime").addEventListener("change", calculateEndTime);
  document.getElementById("rentalPeriod").addEventListener("input", calculateEndTime);
  
  // Form submission logic
  const form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      // Get the form input values
      const fullName = document.getElementById("fullName").value;
      const car = document.getElementById("carModel").value;
      const duration = document.getElementById("rentalPeriod").value;
      const date = document.getElementById("pickupDate").value;
      const rentalStartTime = document.getElementById("rentalStartTime").value;
      const rentalEndTime = document.getElementById("rentalEndTime").value;

      const msg = document.getElementById("bookingMessage");

      // Validate the form
      if (!fullName || !car || !duration || !date || !rentalStartTime || !rentalEndTime) {
        msg.style.color = "red";
        msg.innerText = "Please fill in all fields.";
      } else {
        // Get existing bookings from local storage
        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        
        // Add the new booking to the bookings array
        bookings.push({
          username: localStorage.getItem("loggedInUser"),
          car: car,
          date: date,
          duration: duration,
          rentalStartTime: rentalStartTime,
          rentalEndTime: rentalEndTime
        });

        // Save the updated bookings array back to local storage
        localStorage.setItem("bookings", JSON.stringify(bookings));
        
        // Reset the form
        form.reset();
        
        // Optional: Display success message (you can modify or remove this based on your preference)
        msg.style.color = "green";
        msg.innerText = "Booking successful!";
      }
    });
  }
});


// MyBookings.html: Show user's booking list from sessionStorage
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("bookingsContainer");
  const user = localStorage.getItem("loggedInUser");

  if (container && user) {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const userBookings = bookings.filter(b => b.username === user);

    if (userBookings.length === 0) {
      container.innerHTML = "<p>No bookings found.</p>";
    } else {
      container.innerHTML = userBookings.map((b, index) => `
        <div class="bookingSection">
          <h3>Booking ${index + 1}</h3>
          <div class="bookingItem">
            <div class="carDetails">
              <div class="carModel">${b.car}</div>
              <div class="rentalPeriod">${b.date}</div>
            </div>
            <div class="rentalTimes">
              <div class="startTime">Start: ${b.rentalStartTime}</div>
              <div class="endTime">End: ${b.rentalEndTime}</div>
            </div>
          </div>
          <a href="Payment.html" class="paymentBtn" data-booking-id="${index}">Make Payment</a>
        </div>
      `).join("");
    }

    // Attach click event to each "Make Payment" button
    const paymentButtons = container.querySelectorAll(".paymentBtn");
    paymentButtons.forEach(button => {
      button.addEventListener("click", function (e) {
        const bookingId = e.target.getAttribute("data-booking-id");
        const selectedBooking = userBookings[bookingId];
        
        // Store the selected booking data in localStorage for payment processing
        localStorage.setItem("selectedBooking", JSON.stringify(selectedBooking));
      });
    });

  }
});



document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("bookingDetails");
  const paymentMessage = document.getElementById("paymentMessage");

  // Retrieve the selected booking from localStorage
  const selectedBooking = JSON.parse(localStorage.getItem("selectedBooking"));

  if (selectedBooking) {
    // Render the booking information for review
    container.innerHTML = `
      <div><strong>Car:</strong> ${selectedBooking.car}</div>
      <div><strong>Date:</strong> ${selectedBooking.date}</div>
      <div><strong>Duration:</strong> ${selectedBooking.duration} hours</div>
      <div><strong>Rental Start Time:</strong> ${selectedBooking.rentalStartTime}</div>
      <div><strong>Rental End Time:</strong> ${selectedBooking.rentalEndTime}</div>
      <div><strong>Amount:</strong> $${selectedBooking.duration * 10}</div>
    `;
  } else {
    container.innerHTML = "<p>No booking data found.</p>";
  }

  // Handle form submission (mock payment process)
  const paymentForm = document.getElementById("paymentForm");

  paymentForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent actual form submission

    // Validate the form inputs (you can add more complex validation here if needed)
    const cardName = document.getElementById("cardName").value;
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      paymentMessage.style.display = "block";
      paymentMessage.textContent = "Please fill out all fields correctly.";
      paymentMessage.style.color = "red";
      return;
    }

    // Optionally, clear the selected booking data after payment
    localStorage.removeItem("selectedBooking");

    // Redirect to a thank you page (optional)
    setTimeout(function () {
      window.location.href = "ThankYou.html"; // Redirect to thank you page
    });
  });
});

// Toggle FAQ answers
function toggleAnswer(faqNumber) {
    const answer = document.getElementById(`faq-answer-${faqNumber}`);
    answer.style.display = answer.style.display === "block" ? "none" : "block";
}

// Search FAQ
function searchFAQ() {
    const query = document.getElementById("faqSearch").value.toLowerCase();
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question").textContent.toLowerCase();
        const answer = item.querySelector(".faq-answer");

        if (question.includes(query)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

document.getElementById("inspectionForm").addEventListener("submit", function(event) {
  event.preventDefault();

  // Get values from form fields
  let carModel = document.getElementById("carModel").value;
  let returnDate = document.getElementById("returnDate").value.trim();
  let damageParts = [];
  document.querySelectorAll("input[name='damage']:checked").forEach((checkbox) => {
    damageParts.push(checkbox.value);
  });
  let comments = document.getElementById("comments").value.trim();

  // Process data to create message
  let message = `Inspection for ${carModel} on ${returnDate} completed.<br>`;
  if (damageParts.length > 0) {
    message += `Damage found on: ${damageParts.join(", ")}.<br>`;
  } else {
    message += "No damage found.<br>";
  }
  message += `Comments: ${comments}<br>`;

  // Handle file uploads
  let files = document.getElementById("damagePhotos").files;
  if (files.length > 0) {
    message += `<p>Uploaded Image(s):</p>`;
    Array.from(files).forEach((file) => {
      let imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(file);
      imgElement.width = 100; // Resize for preview
      message += imgElement.outerHTML;
    });
  }

  // Display message in the modal
  document.getElementById("modalMessage").innerHTML = message;

  // Show the modal
  const modal = document.getElementById("confirmationModal");
  modal.style.display = "block";

  // Close the modal when the user clicks the close button
  const closeBtn = document.getElementsByClassName("close-btn")[0];
  closeBtn.onclick = function() {
    modal.style.display = "none";
  }

  // Close the modal when the user clicks anywhere outside of the modal content
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

function logout() {
  document.getElementById("greeting").innerText = "";
  updateLoginButton(null);
  alert("You have been logged out.");
}


function navClick(section) {
  console.log("Navigated to: " + section);
}

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
}

// Function to handle the 'Find Cars' button click
function findCars() {
    const location = document.getElementById("locationInput").value;
    const date = document.getElementById("dateInput").value;

    if (!location || !date) {
        alert("Please enter a location and select a date.");
    } else {
        alert(`Finding cars for location: ${location} and date: ${date}`);
        // Here you can add further logic to fetch available cars from a server or API
    }
}


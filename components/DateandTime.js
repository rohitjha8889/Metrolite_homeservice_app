// Create a module named dateTimeModule.js

// Function to get current date in IST
const getCurrentDateIST = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    return currentDate;
  };
  
  // Function to get current time in IST in 12-hour format
  const getCurrentTimeIST = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric' });
    return currentTime;
  };
  
  // Export the functions to make them available for other modules
  module.exports = { getCurrentDateIST, getCurrentTimeIST };
// Importing necessary modules for different routes
import { loadActivities } from "./modules/activities.js";
import { loadMyActivities } from "./modules/myActivities.js";
import { login } from "./modules/login.js";
import { register } from "./modules/register.js";
import { createAdminButton } from "./components/adminButton.js";

// Define the routes mapping with corresponding functions
const routes = {
  "/activities": loadActivities, // Route for viewing activities
  "/my-activities": loadMyActivities, // Route for viewing user's activities
  "/login": login, // Route for logging in
  "/register": register, // Route for registering
};

/**
 * Handles route changes and loads the corresponding content.
 */
export function handleRoute() {
  const path = window.location.pathname; // Get the current path

  let lastRoute = ""; // Variable to track the last visited route
  const route = routes[path]; // Get the function corresponding to the current route

  // If there is a route or the current route is different from the last one, execute the route
  if (route || lastRoute !== route) {
    lastRoute = route; // Update the last route

    // Check if the route is either for activities or my activities
    if (route == loadActivities || route == loadMyActivities) {
      const userRole = localStorage.getItem("userRole"); // Get the user role from localStorage

      // If the user is not a regular user (e.g., admin), add the admin button
      if (userRole !== "user") {
        document.body.appendChild(createAdminButton());
      }
    }

    const content = document.getElementById("content"); // Get the content element
    route(content); // Call the function for the corresponding route
  } else {
    // If no route is found, display a "Page Not Found" message
    document.getElementById("content").innerHTML = "<h2>Page Not Found</h2>";
  }
}

/**
 * Navigates to a new path and triggers the route handling.
 * @param {string} path - The path to navigate to.
 */
export function navigateTo(path) {
  // Only change the path if it is different from the current path
  if (window.location.pathname !== path) {
    // Use the History API to update the browser's URL without reloading the page
    window.history.pushState({}, path, window.location.origin + path);
    handleRoute(); // Call the route handler to update the content
  }
}

// Event listener to handle back and forward navigation (popstate event)
window.addEventListener("popstate", handleRoute);

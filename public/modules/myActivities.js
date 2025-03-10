let controllerCount = 0;

/**
 * Loads and displays the list of activities the user is participating in.
 * @param {HTMLElement} content - The HTML element where the activities list will be rendered.
 */
export function loadMyActivities(content) {
  // Prevents multiple simultaneous requests
  if (controllerCount !== 0) return;

  content.innerHTML = "<h2>My Activities List</h2>";

  const loadingMessage = document.createElement("p");
  content.appendChild(loadingMessage);

  const userId = localStorage.getItem("userId");

  // Check if the user is authenticated
  if (!userId) {
    loadingMessage.remove();
    const errorMessage = document.createElement("p");
    errorMessage.innerText = "User not authenticated.";
    content.appendChild(errorMessage);
    return;
  }

  controllerCount = 1;

  // Fetch activities list from the server
  fetch("http://localhost:3000/activities/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      return response.json();
    })
    .then((activities) => {
      loadingMessage.remove();

      if (activities && Array.isArray(activities)) {
        // Filter activities that the user is participating in
        const filteredActivities = activities.filter((activity) =>
          activity.participants.includes(parseInt(userId))
        );

        if (filteredActivities.length > 0) {
          const activitiesList = document.createElement("ul");

          filteredActivities.forEach((activity) => {
            const listItem = document.createElement("li");

            // Display activity details
            listItem.innerHTML = `
              <strong>${activity.title}</strong><br />
              <span><strong>Description:</strong> ${activity.description}</span><br />
              <span><strong>Date:</strong> ${activity.date}</span><br />
              <span><strong>Available Spots:</strong> ${activity.availableSpots}</span><br />
              <span><strong>Max Participants:</strong> ${activity.maxP}</span><br />
              <hr />
            `;

            // Create "Leave Activity" button
            const leaveButton = document.createElement("button");
            leaveButton.textContent = "Leave Activity";
            leaveButton.addEventListener("click", function () {
              leaveButton.parentElement.remove(); // Remove activity from UI
              leaveActivity(activity.id); // Call function to leave activity
            });

            listItem.appendChild(leaveButton);
            activitiesList.appendChild(listItem);
          });

          content.appendChild(activitiesList);
        } else {
          const noActivitiesMessage = document.createElement("p");
          noActivitiesMessage.innerText = "No activities found for the user.";
          content.appendChild(noActivitiesMessage);
        }
        controllerCount = 0;
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar as atividades:", error);
      loadingMessage.remove();

      const errorMessage = document.createElement("p");
      errorMessage.innerText =
        "Error loading activities. Please try again later.";
      content.appendChild(errorMessage);
    });
}

/**
 * Sends a request to remove the user from an activity.
 * @param {number} activityId - The ID of the activity to leave.
 */
function leaveActivity(activityId) {
  fetch(`http://localhost:3000/activities/leave/${activityId}`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to leave activity");
      }
      return response.json();
    })
    .then((data) => {
      alert("Successfully left the activity!");
      console.log("leave response:", data);
    })
    .catch((error) => {
      console.error("Error leaving activity:", error);
      alert("Error leaving activity. Please try again.");
    });
}

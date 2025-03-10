let controllerCount = 0;

export function loadActivities(content) {
  // Prevent multiple fetch calls
  if (controllerCount !== 0) return;
  content.innerHTML = "<h2>Activities List</h2>";

  const loadingMessage = document.createElement("p");
  loadingMessage.innerText = "Loading activities...";
  content.appendChild(loadingMessage);

  controllerCount = 1;

  // Fetch activities from the API
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

      // Check if activities data is an array
      if (activities && Array.isArray(activities)) {
        const activitiesList = document.createElement("ul");
        const userId = localStorage.getItem("userId");
        const userRole = localStorage.getItem("userRole");

        // Function to create and open the update modal
        function createUpdateModal(activityItem, activityId) {
          // Remove any existing modal before creating a new one
          const existingModal = document.getElementById("updateModal");
          if (existingModal) {
            existingModal.remove();
          }

          const modal = document.createElement("div");
          modal.id = "updateModal";
          modal.style.position = "fixed";
          modal.style.top = "50%";
          modal.style.left = "50%";
          modal.style.transform = "translate(-50%, -50%)";
          modal.style.background = "white";
          modal.style.padding = "20px";
          modal.style.border = "1px solid black";
          modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
          modal.style.zIndex = "1000";

          // Get the activity data using the `activityItem`
          let title = activityItem.querySelector("strong").textContent;
          let description = activityItem
            .querySelector("span:nth-of-type(1)")
            .textContent.replace("Description: ", "");
          let date = activityItem
            .querySelector("span:nth-of-type(2)")
            .textContent.replace("Date: ", "");
          let availableSpots = activityItem
            .querySelector("span:nth-of-type(5)")
            .textContent.replace("Max Participants: ", "");
          let local = activityItem
            .querySelector("span:nth-of-type(4)")
            .textContent.replace("Local: ", "");

          // Add the HTML content for the modal
          modal.innerHTML = `
            <h2>Update Activity</h2>
            <label>Title: <input type="text" id="modalTitle" value="${title}" /></label><br />
            <label>Description: <input type="text" id="modalDescription" value="${description}" /></label><br />
            <label>Date: <input type="date" id="modalDate" value="${date}" /></label><br />
            <label>Available Spots: <input type="number" id="modalSpots" value="${availableSpots}" /></label><br />
            <label>Local: <input type="text" id="modalLocal" value="${local}" /></label><br />
            <button id="saveChanges">Save</button>
            <button id="closeModal">Close</button>
          `;

          document.body.appendChild(modal);

          // Event to close the modal
          document
            .getElementById("closeModal")
            .addEventListener("click", () => {
              modal.remove();
            });

          // Event to save changes
          document
            .getElementById("saveChanges")
            .addEventListener("click", async () => {
              let Title = document.getElementById("modalTitle").value;
              let Description =
                document.getElementById("modalDescription").value;
              let Date = document.getElementById("modalDate").value;
              let Spots = document.getElementById("modalSpots").value;
              let Local = document.getElementById("modalLocal").value;

              // Validate the fields
              if (!Title || !Description || !Date || !Spots || !Local) {
                alert("Please fill all fields!");
                return;
              }

              const updatedData = {
                title: Title,
                description: Description,
                date: Date,
                maxP: Spots,
                local: Local,
              };

              try {
                // Send the update request to the API
                const response = await fetch(
                  `http://localhost:3000/activities/update/${activityId}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                    credentials: "include",
                  }
                );

                if (!response.ok) {
                  throw new Error("Error updating activity");
                }

                const result = await response.json();
                console.log("Activity updated successfully:", result);
                alert("Activity updated successfully!");

                // Remove the modal after success
                modal.remove();
              } catch (error) {
                console.error("Error updating activity:", error);
                alert("Error updating activity. Please try again.");
              }
            });
        }

        // Add activities to the list
        activities.forEach((activity) => {
          const listItem = document.createElement("li");

          listItem.innerHTML = `
            <strong>${activity.title}</strong><br />
            <span><strong>Description:</strong> ${activity.description}</span><br />
            <span><strong>Date:</strong> ${activity.date}</span><br />
            <span><strong>Available Spots:</strong> ${activity.availableSpots}</span><br />
            <span><strong>Local:</strong> ${activity.local}</span><br />
            <span><strong>Max Participants:</strong> ${activity.maxP}</span><br />
            <hr />
          `;

          // Join button for activities
          if (
            !activity.participants.includes(Number(userId)) && // User is not already a participant
            activity.availableSpots > 0 // Ensure that maxP is greater than 0 (not less than or equal to 0)
          ) {
            const joinButton = document.createElement("button");
            joinButton.textContent = "Join Activity";
            joinButton.addEventListener("click", () => {
              joinButton.remove();
              joinActivity(activity.id);
            });
            listItem.appendChild(joinButton);
          }

          // Update button for admins (non-user role)
          if (userRole !== "user") {
            const updateButton = document.createElement("button");
            updateButton.textContent = "Update Activity";
            updateButton.addEventListener("click", () =>
              createUpdateModal(listItem, activity.id)
            ); // Pass activityId
            listItem.appendChild(updateButton);

            // Delete button for admins (non-user role)
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete Event";
            deleteButton.addEventListener("click", async () => {
              try {
                const response = await fetch(
                  `http://localhost:3000/activities/delete`,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      activityId: activity.id,
                    }),
                    credentials: "include",
                  }
                );
                if (!response.ok) {
                  throw new Error("Error deleting activity");
                }
                alert("Activity deleted successfully");
                listItem.remove(); // Remove the activity from the list
              } catch (error) {
                console.error("Error deleting activity:", error);
                alert("Error deleting activity. Please try again.");
              }
            });
            listItem.appendChild(deleteButton);
          }

          activitiesList.appendChild(listItem);
        });

        controllerCount = 0;
        content.appendChild(activitiesList);
      } else {
        const noActivitiesMessage = document.createElement("p");
        noActivitiesMessage.innerText = "No activities found.";
        content.appendChild(noActivitiesMessage);
      }
    })
    .catch((error) => {
      console.error("Error loading activities:", error);
      loadingMessage.remove();

      const errorMessage = document.createElement("p");
      errorMessage.innerText =
        "Error loading activities. Please try again later.";
      content.appendChild(errorMessage);
    });
}

// Join activity function
function joinActivity(activityId) {
  fetch(`http://localhost:3000/activities/join/${activityId}`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to join activity");
      }
      return response.json();
    })
    .then((data) => {
      alert("Successfully joined the activity!");
      console.log("Join response:", data);
    })
    .catch((error) => {
      console.error("Error joining activity:", error);
      alert("Error joining activity. Please try again.");
    });
}

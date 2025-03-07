export function loadActivities(content) {
  content.innerHTML = "<h2>Activities List</h2>";

  const loadingMessage = document.createElement("p");
  loadingMessage.innerText = "Loading activities...";
  content.appendChild(loadingMessage);

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
        const activitiesList = document.createElement("ul");

        activities.forEach((activity) => {
          const listItem = document.createElement("li");

          listItem.innerHTML = `
  <strong>${activity.title}</strong><br />
  <span><strong>Description:</strong> ${activity.description}</span><br />
  <span><strong>Date:</strong> ${activity.date}</span><br />
  <span><strong>Available Spots:</strong> ${activity.availableSpots}</span><br />
  <span><strong>Max Participants:</strong> ${activity.maxP}</span><br />
  <button>Join Activity</button>
  <hr />
`;

          listItem.querySelector("button").addEventListener("click", () => {
            joinActivity(activity.id);
          });

          activitiesList.appendChild(listItem);
        });

        content.appendChild(activitiesList);
      } else {
        const noActivitiesMessage = document.createElement("p");
        noActivitiesMessage.innerText = "No activities found.";
        content.appendChild(noActivitiesMessage);
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

function joinActivity(activityId) {
  const userId = localStorage.getItem("userId");

  console.log(`Joining activity with ID: ${activityId} | ${userId}`);
  alert(`You have joined the activity with ID: ${activityId}`);
}

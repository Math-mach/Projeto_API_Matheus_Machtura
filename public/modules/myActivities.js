export function loadMyActivities(content) {
  content.innerHTML = "<h2>My Activities List</h2>";

  const loadingMessage = document.createElement("p");
  content.appendChild(loadingMessage);

  const userId = localStorage.getItem("userId");

  if (!userId) {
    loadingMessage.remove();
    const errorMessage = document.createElement("p");
    errorMessage.innerText = "User not authenticated.";
    content.appendChild(errorMessage);
    return;
  }

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
        // Filtrando atividades em que o usuário está participando
        const filteredActivities = activities.filter((activity) =>
          activity.participants.includes(parseInt(userId))
        );

        if (filteredActivities.length > 0) {
          const activitiesList = document.createElement("ul");

          filteredActivities.forEach((activity) => {
            const listItem = document.createElement("li");

            listItem.innerHTML = `
              <strong>${activity.title}</strong><br />
              <span><strong>Description:</strong> ${activity.description}</span><br />
              <span><strong>Date:</strong> ${activity.date}</span><br />
              <span><strong>Available Spots:</strong> ${activity.availableSpots}</span><br />
              <span><strong>Max Participants:</strong> ${activity.maxP}</span><br />
              <hr />
            `;

            activitiesList.appendChild(listItem);
          });

          content.appendChild(activitiesList);
        } else {
          const noActivitiesMessage = document.createElement("p");
          noActivitiesMessage.innerText = "No activities found for the user.";
          content.appendChild(noActivitiesMessage);
        }
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

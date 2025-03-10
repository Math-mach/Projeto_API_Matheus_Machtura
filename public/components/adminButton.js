export function createAdminButton() {
  const button = document.createElement("button");
  button.textContent = "Admin";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.backgroundColor = "blue";
  button.style.color = "white";
  button.style.padding = "10px 15px";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";

  button.addEventListener("click", openAdminModal);

  return button;
}

function openAdminModal() {
  if (document.getElementById("admin-modal")) return;

  const modal = document.createElement("div");
  modal.id = "admin-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.right = "0";
  modal.style.width = "300px";
  modal.style.height = "100vh";
  modal.style.backgroundColor = "white";
  modal.style.boxShadow = "-2px 0 5px rgba(0,0,0,0.3)";
  modal.style.padding = "20px";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.gap = "10px";

  const closeButton = document.createElement("button");
  closeButton.textContent = "✖";
  closeButton.style.alignSelf = "flex-end";
  closeButton.style.background = "black";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", () => modal.remove());

  const form = document.createElement("form");
  form.innerHTML = `
    <input type="text" id="event-name" placeholder="Nome do evento" required />
    <input type="text" id="event-desc" placeholder="Descrição" required />
    <input type="text" id="event-location" placeholder="Local" required />
    <input type="date" id="event-date" required />
    <input type="number" id="event-max" placeholder="Máx. participantes" required />
    <button type="submit">Criar Evento</button>
  `;
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.gap = "5px";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const event = {
      title: document.getElementById("event-name").value,
      description: document.getElementById("event-desc").value,
      local: document.getElementById("event-location").value,
      date: document.getElementById("event-date").value,
      maxP: parseInt(document.getElementById("event-max").value, 10),
    };

    if (
      !event.title ||
      !event.description ||
      !event.location ||
      !event.date ||
      event.maxP <= 0
    ) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/activities/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });

      if (!response.ok) throw new Error("Erro ao criar evento");
      alert("Evento criado com sucesso!");
      modal.remove();
    } catch (error) {
      alert(error.message);
    }
  });

  modal.appendChild(closeButton);
  modal.appendChild(form);
  document.body.appendChild(modal);
}

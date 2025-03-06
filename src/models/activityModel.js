const jwt = require("jsonwebtoken");
const Database = require("../config/db");

class ActivityModel {
  constructor() {
    this.db = new Database("Atividades");
  }

  async open() {
    await this.db.open();
  }

  async generateUniqueId() {
    let id;
    let exists = true;

    while (exists) {
      id = Math.floor(1000 + Math.random() * 9000);
      const activity = await this.db.get(id.toString());
      if (!activity) exists = false;
    }

    return id;
  }

  async newActivity(req, res) {
    try {
      const { title, description, date, maxP } = req.body;

      if (!title || !description || !date || maxP <= 0) {
        return res.status(400).json({
          error: "Todos os campos são obrigatórios e maxP deve ser maior que 0",
        });
      }

      const id = await this.generateUniqueId();

      await this.db.put(id.toString(), {
        title,
        description,
        date,
        participants: [],
        maxP,
      });

      return res
        .status(201)
        .json({ message: "Atividade registrada com sucesso" });
    } catch (error) {
      console.error("Erro no registro de atividades:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  async getAllActivities(req, res) {
    try {
      const activities = await this.db.getAll();

      const updatedActivities = activities.map((activity) => {
        const availableSpots =
          activity.value.maxP - activity.value.participants.length;
        return {
          ...activity.value,
          id: activity.key,
          availableSpots: availableSpots >= 0 ? availableSpots : 0,
        };
      });

      return res.status(200).json(updatedActivities);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  async joinActivity(req, res) {
    try {
      const userId = req.user.id;
      const activityId = req.params.id;

      const activity = await this.db.get(activityId);
      if (!activity) {
        return res.status(404).json({ error: "Atividade não encontrada" });
      }

      if (activity.participants.includes(userId)) {
        return res
          .status(400)
          .json({ error: "Usuário já está inscrito nesta atividade" });
      }

      if (activity.participants.length >= activity.maxP) {
        return res.status(400).json({ error: "Atividade lotada" });
      }

      activity.participants.push(userId);
      await this.db.put(activityId, activity);

      return res
        .status(200)
        .json({ message: "Inscrição realizada com sucesso" });
    } catch (error) {
      console.error("Erro ao inscrever usuário:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  async leaveActivity(req, res) {
    try {
      const userId = req.user.id;
      const activityId = req.params.id;

      const activity = await this.db.get(activityId);
      if (!activity) {
        return res.status(404).json({ error: "Atividade não encontrada" });
      }

      if (!activity.participants.includes(userId)) {
        return res
          .status(400)
          .json({ error: "Usuário não está inscrito nesta atividade" });
      }

      activity.participants = activity.participants.filter(
        (id) => id !== userId
      );
      await this.db.put(activityId, activity);

      return res
        .status(200)
        .json({ message: "Inscrição cancelada com sucesso" });
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  async deleteActivity(req, res) {
    try {
      const { activityId } = req.body;

      const activity = await this.db.get(activityId);
      if (!activity) {
        return res.status(404).json({ error: "Atividade não encontrada" });
      }

      await this.db.del(activityId);
      return res
        .status(200)
        .json({ message: "Atividade removida com sucesso" });
    } catch (error) {
      console.error("Erro ao remover atividade:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
}

module.exports = ActivityModel;

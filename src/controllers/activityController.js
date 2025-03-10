const ActivityModel = require("../models/ActivityModel");

const activityModel = new ActivityModel();

activityModel
  .open()
  .then(() => {
    console.log("Banco de dados de Atividades aberto!");
  })
  .catch((err) => {
    console.error("Erro ao abrir banco de dados:", err);
  });

const createActivity = async (req, res) => {
  try {
    await activityModel.newActivity(req, res);
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const listActivities = async (req, res) => {
  try {
    await activityModel.getAllActivities(req, res);
  } catch (error) {
    console.error("Erro ao listar atividades:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};
const updateActivity = async (req, res) => {
  try {
    await activityModel.updateActivity(req, res);
  } catch (error) {
    console.error("Erro ao listar atividades:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const joinActivity = async (req, res) => {
  try {
    await activityModel.joinActivity(req, res);
  } catch (error) {
    console.error("Erro ao entrar na atividade:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const leaveActivity = async (req, res) => {
  try {
    await activityModel.leaveActivity(req, res);
  } catch (error) {
    console.error("Erro ao sair da atividade:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const deleteActivity = async (req, res) => {
  try {
    await activityModel.deleteActivity(req, res);
  } catch (error) {
    console.error("Erro ao deletar atividade:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

module.exports = {
  createActivity,
  listActivities,
  joinActivity,
  updateActivity,
  leaveActivity,
  deleteActivity,
};

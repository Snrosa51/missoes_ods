const seedMissoes = require("../seed/seedMissoes");
const seedAcoes = require("../seed/seedAcoes");

module.exports.executarSeeds = async (req, res) => {
  try {
    const adminToken = process.env.ADMIN_SEED_TOKEN;

    if (adminToken) {
      const receivedToken = req.headers["x-seed-token"];
      if (receivedToken !== adminToken) {
        return res.status(401).json({
          error: "Não autorizado para executar seeds.",
        });
      }
    }

    console.log("🌱 Executando seeds via /api/admin/seed ...");
    await seedMissoes();
    await seedAcoes();

    return res.json({
      ok: true,
      message: "Seeds executados com sucesso.",
    });
  } catch (err) {
    console.error("❌ Erro ao executar seeds:", err);
    return res.status(500).json({
      ok: false,
      error: "Erro ao executar seeds.",
    });
  }
};

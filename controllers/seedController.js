const seedMissoes = require("../seed/seedMissoes");
const seedAcoes = require("../seed/seedAcoes");

async function executarSeeds(req, res) {
  try {
    const adminToken = process.env.ADMIN_SEED_TOKEN;

    if (adminToken) {
      const receivedToken = req.header("x-seed-token"); // mais limpo
      if (receivedToken !== adminToken) {
        return res.status(401).json({ ok: false, error: "Não autorizado para executar seeds." });
      }
    }

    console.log("🌱 Executando seeds via /api/admin/seed ...");

    // Se você quiser garantir atomicidade, você pode usar transaction (opcional)
    await seedMissoes();
    await seedAcoes();

    return res.json({ ok: true, message: "Seeds executados com sucesso." });
  } catch (err) {
    console.error("❌ Erro ao executar seeds:", err);
    return res.status(500).json({
      ok: false,
      error: err?.message || "Erro ao executar seeds.",
    });
  }
}

module.exports = { executarSeeds };
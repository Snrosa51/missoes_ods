const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    console.log('Testando conexão com o banco...');
    await sequelize.authenticate();
    console.log('Conexão OK. Sincronizando modelos...');
    await sequelize.sync();
    console.log('DB sincronizado. Fazendo seed das missões...');

    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Servidor rodando na porta ${PORT}`)
    );
  } catch (err) {
    console.error('ERRO FATAL AO INICIAR O SERVIDOR:', err);
    process.exit(1);
  }
};

start();

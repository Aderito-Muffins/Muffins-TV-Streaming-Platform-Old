const express = require('express');
const app = express();
const path = require('path');

// Define a pasta public como raiz
app.use(express.static(path.join(__dirname, 'public')));

// Rota padrão para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

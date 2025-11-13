import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import "reflect-metadata";
import AppDataSource from "./utils/database";
import authRoutes from "./routes/auth.routes";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações do app
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Inicializar banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Banco de dados conectado com sucesso");
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar no banco de dados:", error);
  });

// Rotas principais
app.use("/auth", authRoutes);

// Rota de saúde (teste rápido)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Adopet API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    message: "Rota não encontrada",
    path: req.path,
    method: req.method,
  });
});

// Tratamento de erros genéricos
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Algo deu errado no servidor",
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
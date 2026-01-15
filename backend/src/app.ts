import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import "reflect-metadata";
import AppDataSource from "./utils/database";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import organizationRoutes from "./routes/organization.routes";
import addressRoutes from './routes/address.routes';
import animalRoutes from "./routes/animal.routes";
import adoptionRoutes from "./routes/adoption.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Inicializar banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao conectar no banco de dados:", error);
  });

// Rotas principais
app.use("/auth", authRoutes);
app.use('/users', userRoutes);
app.use('/organizations', organizationRoutes);
app.use('/address', addressRoutes);
app.use('/animals', animalRoutes);
app.use('/adoptions', adoptionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Adopet API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Rota não encontrada",
    path: req.path,
    method: req.method,
  });
});

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
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
import { DataSource } from "typeorm";
import path from "path";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DATABASE_PATH || "./database/adopet.sqlite",
  entities: [path.join(__dirname, "../entities/*.ts")],
  synchronize: true, // Only development
  logging: false,
});

export default AppDataSource;

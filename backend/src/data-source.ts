import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Transaction } from "./entities/Transaction";
import { Category } from "./entities/Category";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "fintrack",
  synchronize: true,
  logging: false,
  entities: [User, Transaction, Category],
  migrations: [],
  subscribers: [],
}); 
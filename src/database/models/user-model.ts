import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../index";

interface IUserAttributes {
  id: number;
  name: string;
  username: string;
  password: string;
}

type UserCreationAttributes = Optional<IUserAttributes, "id">;

class User extends Model implements IUserAttributes {
  public id: number;
  public name: string;
  public username: string;
  public password: string;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
    username: {
      type: DataTypes.STRING(100),
    },
    password: {
      type: DataTypes.STRING(100),
    },
  },
  { sequelize, modelName: "User", tableName: "user", timestamps: true }
);

if (process.env.NODE_ENV == "development") {
  User.sync();
}

export { User, IUserAttributes, UserCreationAttributes };

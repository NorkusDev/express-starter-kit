import {
  IUserAttributes,
  User,
  UserCreationAttributes,
} from "../../database/models/user-model";
import logger from "../../lib/winston-logger";

export class UserService {
  async getAll(): Promise<IUserAttributes[]> {
    try {
      const user = await User.findAll();
      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async create(payload: UserCreationAttributes): Promise<IUserAttributes> {
    try {
      const user = await User.create(payload);
      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<IUserAttributes> {
    try {
      const findUsername = await User.findOne({
        where: { username: username },
      });
      return findUsername;
    } catch (error) {
      throw error;
    }
  }
}

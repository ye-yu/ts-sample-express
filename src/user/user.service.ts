import { DatabaseService } from "../database/database.service.js";
import { UserModel } from "../database/models/user.model.js";
import { RepoGetterType } from "../database/types/repo-getter.type.js";

export class UserServiceImpl {
	async getOrCreateUser(
		email: string,
		useDbService: RepoGetterType = DatabaseService
	): Promise<UserModel> {
		const userModel = useDbService.repo(UserModel);
		let userByEmail = await userModel.findOne({
			where: {
				email,
			},
		});
		if (!userByEmail) {
			userByEmail = userModel.create({
				email,
				displayName: email,
			});
			userByEmail = await userModel.save(userByEmail, {
				reload: true,
			});
		}

		return userByEmail;
	}
}

export const UserService = new UserServiceImpl();
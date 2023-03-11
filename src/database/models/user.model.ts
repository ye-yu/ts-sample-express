import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UseDataSourceRepo } from "../decorators/use-data-source-repo.decorator.js";
import { getTableName } from "../utils/get-table-name.util.js";
import { OtpLogModel } from "./otp-log.model.js";

@Entity({ name: getTableName(UserModel) })
@UseDataSourceRepo()
export class UserModel {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({
		length: 100,
	})
	email: string;

	@Column()
	displayName: string;

	@OneToMany(() => OtpLogModel, (otp) => otp.user)
	otpLogs: OtpLogModel[];
}

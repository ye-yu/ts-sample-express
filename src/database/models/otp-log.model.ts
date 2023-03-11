import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { UseDataSourceRepo } from "../decorators/use-data-source-repo.decorator.js";
import { getTableName } from "../utils/get-table-name.util.js";
import { UserModel } from "./user.model.js";

@Entity({ name: getTableName(OtpLogModel) })
@UseDataSourceRepo()
export class OtpLogModel {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({
		type: "bigint",
	})
	userId: number;

	@Column({
		length: 100,
	})
	password: string;

	@Column({
		type: "datetime",
		nullable: true,
	})
	loggedInAt?: Date;

	@Column({
		type: "datetime",
	})
	@CreateDateColumn()
	createdAt: Date;

	@Column({
		type: "datetime",
	})
	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => UserModel, (user) => user.otpLogs, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({
		name: "userId",
	})
	user: UserModel;
}

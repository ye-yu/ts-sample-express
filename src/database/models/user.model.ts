import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UseDataSourceRepo } from "../decorators/use-data-source-repo.decorator.js";

@Entity()
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
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UseDataSourceRepo } from "../decorators/use-data-source-repo.decorator.js";

@Entity()
@UseDataSourceRepo()
export class UserModel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	displayName: string;
}

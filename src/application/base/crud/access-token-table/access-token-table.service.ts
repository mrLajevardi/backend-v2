
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from 'src/infrastructure/database/entities/AccessToken';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { UpdateAccessTokenDto } from './dto/update-access-token.dto';
import { FindManyOptions, FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AccessTokenTableService {
	constructor(
	@InjectRepository(AccessToken)
	private readonly repository: Repository<AccessToken>,
	) {}

	// Find One Item by its ID
	async findById(id: string ) : Promise<AccessToken> {
	const serviceType = await this.repository.findOne({ where: { id: id } });
	return serviceType;
	}

	// Find Items using search criteria
	async find(options?: FindManyOptions): Promise<AccessToken[]> {
	const result = await this.repository.find(options);
	return result;
	}

	// Count the items
	async count(options?: FindManyOptions): Promise<number> {
	const result = await this.repository.count(options);
	return result;
	}

	// Find one item
	async findOne(options?: FindOneOptions): Promise<AccessToken> {
	const result = await this.repository.findOne(options);
	return result;
	}

	// Create an Item using createDTO
	async create(dto: CreateAccessTokenDto) : Promise<AccessToken> {
	const newItem = plainToClass(AccessToken, dto);
	const createdItem = this.repository.create(newItem);
	return await this.repository.save(createdItem);
	}

	// Update an Item using updateDTO
	async update(id: string , dto: UpdateAccessTokenDto) {
	const item = await this.findById(id);
	const updateItem: Partial<AccessToken> = Object.assign(item, dto);
	await this.repository.save(updateItem);
	}

	// update many items
	async updateAll(
	where: FindOptionsWhere<AccessToken>,
	dto: UpdateAccessTokenDto,
	) {
	await this.repository.update(where, dto);
	}


	// delete an Item
	async delete(id: string ) {
		await this.repository.delete(id);
	}

	// delete all items
	async deleteAll() {
		await this.repository.delete({});
		}
	}
				
				
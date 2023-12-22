// export class BaseService<T extends BaseEntity> implements IBaseService {
//   constructor(private readonly repository: Repository<T>) {}
//   async findById(guid: string): Promise<T> {
//     const findOptions: FindOneOptions<T> = {
//       where: {
//         guid: guid,
//       } as FindOptionsWhere<T>,
//     };
//     return this.repository.findOne(findOptions);
//   }

//   async find(options?: FindManyOptions<T>): Promise<T[]> {
//     return await this.repository.find(options);
//   }


//   async count(options?: FindManyOptions<T>): Promise<number> {
//     return await this.repository.count(options);
//   }

//   async create(dto: CreateCompanyDto): Promise<Company> {
//     const newItem = plainToClass(Company, dto);
//     const createdItem = this.repository.create(newItem);

//     return await this.repository.save(createdItem);
//   }

//   async updateAll(
//     where: FindOptionsWhere<Company>,
//     dto: UpdateCompanyDto,
//   ): Promise<UpdateResult> {
//     return await this.repository.update(where, dto);
//   }

//   async update(id: number, dto: UpdateCompanyDto): Promise<Company> {
//     const item = await this.findById(id);
//     const updateItem: Partial<Company> = Object.assign(item, dto);

//     return await this.repository.save(updateItem);
//   }

//   async delete(id: number): Promise<DeleteResult> {
//     return await this.repository.delete(id);
//   }

//   async deleteAll(
//     where: FindOptionsWhere<Company> = {},
//   ): Promise<DeleteResult> {
//     return await this.repository.delete(where);
//   }

//   async findOne(options?: FindOneOptions<Company>): Promise<Company> {
//     return await this.repository.findOne(options);
//   }
// }

export class BaseService {}

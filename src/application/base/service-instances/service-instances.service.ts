import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { ServiceProperties } from 'src/infrastructure/database/entities/ServiceProperties';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceInstancesService {

    constructor(
        @InjectRepository(ServiceInstances)
        private readonly serviceInstanceRepository : Repository<ServiceInstances>,
        @InjectRepository(ServiceProperties)
        private readonly servicePropertiesRepository : Repository<ServiceProperties>,
    ){}
    

    async findByID(id : string) : Promise<ServiceInstances>{
        const serviceInstance = await this.serviceInstanceRepository.findOne({
            where : {
                id : id
            }
        })
        return serviceInstance;
    }

    async create(serviceInstance : ServiceInstances ) : Promise<ServiceInstances> {
        const instance = this.serviceInstanceRepository.create(serviceInstance);
        const saved = this.serviceInstanceRepository.save(instance);
        return saved;
    }

    async getUserInstances(userID : number) : Promise<ServiceInstances[] | undefined>{
        const instances = await this.serviceInstanceRepository.find({
            where: {
                userId : userID 
            }
        })
        return instances
    }


    async setInstanceAsDeleted(instanceID : string , deletedDate : Date) : Promise<boolean> {
        const instance = await this.findByID(instanceID);

        if (instance){
            instance.isDeleted = true 
            instance.deletedDate = deletedDate
            await this.serviceInstanceRepository.save(instance)
            return true 
        }else{
            return false 
        }
    }


    


}

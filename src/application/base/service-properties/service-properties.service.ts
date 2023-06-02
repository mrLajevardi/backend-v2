import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { ServiceProperties } from 'src/infrastructure/database/entities/ServiceProperties';
import { Repository } from 'typeorm';

@Injectable()
export class ServicePropertiesService {

    constructor(
        @InjectRepository(ServiceProperties)
        private readonly servicePropertiesRepository : Repository<ServiceProperties>,
    ){}

    
    // find properties 
    async findAll() : Promise<ServiceProperties[] | undefined> {
        const result = this.servicePropertiesRepository.find();
        return result; 
    }

    // get all the properties of the service 
    async getServiceProperties(serviceInstance) : Promise<ServiceProperties[] | undefined> {
        const result = this.servicePropertiesRepository.find({
            where: {
                serviceInstance: serviceInstance
            }
        })
        return result;
    }

    // get's service property 
    async getServiceProperty(serviceInstance,propertyKey) : Promise<string> {
        const prop = await this.servicePropertiesRepository.findOne({
            where: {
              serviceInstance: serviceInstance, 
              propertyKey: propertyKey
            }})
        return prop.value
    }

    // creating or updating service propery for user 
    async setServiceProperty(serviceInstance : ServiceInstances  , propertyKey : string, value : string)
    : Promise<ServiceProperties>{
        const filter = { 
            where : {
                serviceInstance  : serviceInstance ,
                propertyKey : propertyKey
            }
        }

        const serviceProperty  = await this.servicePropertiesRepository.findOne(filter)
        if (serviceProperty){
            serviceProperty.value = value 
            const savedProperty = await this.servicePropertiesRepository.save(serviceProperty)
            return savedProperty
        }else{
            let newProperty = new ServiceProperties
            newProperty.serviceInstance = serviceInstance 
            newProperty.propertyKey = propertyKey 
            newProperty.value = value
            const createdProperty = await this.servicePropertiesRepository.save(newProperty)
            return createdProperty
        }
    }    

}

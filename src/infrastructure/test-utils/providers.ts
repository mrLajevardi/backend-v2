import { InvoiceProperties } from "../entities/InvoiceProperties";
import { ServiceInstances } from '../entities/ServiceInstances';
import { ServiceTypes } from '../entities/ServiceTypes';
import { ServiceProperties } from '../entities/ServiceProperties';
import { AccessToken } from '../entities/AccessToken';
import { Invoices } from "../entities/Invoices";
import { Configs } from "../entities/Configs";
import { User } from "../entities/User";
import { Acl } from "../entities/Acl";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mockData } from "./mock-data";
import { FindOneOptions } from "typeorm";


export const TestDBFunctions = {
    findOne : <T>(items : string[] , where : {}, mockArray : any[]) : T  => {
        let returnValue: T = null ; 
        items.forEach(condition => {
            mockArray.forEach(obj => {
                if (obj[condition] === where[condition]){
                    returnValue = obj
                }
            });
        });
        return returnValue; 
    },
    find : <T>(items : string[] , where : {}, mockArray : any[]) : T[]  => {
        let returnValue = [] ; 
        items.forEach(condition => {
            mockArray.forEach(obj => {
                if (obj[condition] == where[condition]){
                    returnValue.push(obj)
                }
            });
        });
        return returnValue; 
    }
}
export const TestDBProviders = {
    aclProvider: {
        provide: getRepositoryToken(Acl),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(mockData.acl),
            findOne: jest.fn().mockImplementation((arg : FindOneOptions<User> ) => {
                return TestDBFunctions.findOne<User>(["id"],arg.where, mockData.acl);
            })
        }
    },
    userProvider: {
        provide: getRepositoryToken(User),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(mockData.users),
            findOne: jest.fn().mockImplementation((arg : FindOneOptions<User> ) => {
                return TestDBFunctions.findOne<User>(["id","phoneNumber","username"],arg.where, mockData.users);
            })
        }
    },
    serviceInstancesProvider: {
        provide: getRepositoryToken((ServiceInstances)),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn().mockImplementation((arg : FindOneOptions<ServiceInstances>) => {
                return TestDBFunctions.findOne<ServiceInstances>(["id","userId"],arg.where, mockData.serviceInstances);
            }),
            find: jest.fn().mockImplementation((arg : FindOneOptions<ServiceInstances>) => {
                return TestDBFunctions.find<ServiceInstances>(["id","userId"],arg.where, mockData.serviceInstances);
            }),
        }
    },
    servicePropertiesProvider: {
        provide: getRepositoryToken((ServiceProperties)),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn().mockImplementation((arg : FindOneOptions<ServiceProperties>) => {
                let returnValue = null ; 
                    mockData.serviceProperties.forEach(obj => {
                        if ((obj["ServiceInstanceID"] === arg.where["serviceInstance"].id )
                        && (obj["PropertyKey"] === arg.where["propertyKey"]))
                        {
                            returnValue = obj
                        }
                    });
                return returnValue; 
            })
        }
    },
    accessTokenProvider: {
        provide: getRepositoryToken((AccessToken)),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn().mockImplementation((arg : FindOneOptions<AccessToken> )=>{
                return TestDBFunctions.findOne<AccessToken>(["id"],arg.where, mockData.accessToken);
            }),
            findOneBy: jest.fn(),
        }
    },

    InvoicePropertiesProvider: {
        provide: getRepositoryToken((InvoiceProperties)),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn()
        }
    },
    InvoicesProvider : {
        provide: getRepositoryToken((Invoices)),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn().mockImplementation((args) : Invoices[] =>{
                return TestDBFunctions.find(["userID"],args.where,mockData.invoices);
            })
        }
    },
    configsProvider: {
        provide: getRepositoryToken((Configs)),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn()
        }
    },
    serviceTypesProvider : {
        provide: getRepositoryToken((ServiceTypes)),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findeOne: jest.fn()
        }
    },
}
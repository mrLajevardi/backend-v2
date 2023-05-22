import { InvoiceProperties } from "../database/entities/InvoiceProperties";
import { ServiceInstances } from '../database/entities/ServiceInstances';
import { ServiceTypes } from '../database/entities/ServiceTypes';
import { ServiceProperties } from '../database/entities/ServiceProperties';
import { AccessToken } from '../database/entities/AccessToken';
import { Invoices } from "../database/entities/Invoices";
import { Configs } from "../database/entities/Configs";
import { User } from "../database/entities/User";
import { Acl } from "../database/entities/Acl";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { aclMocData } from "./mockdata/acl.moc";
import { usersMocData } from "./mockdata/users.moc";
import { serviceInstancesMocData } from "./mockdata/service-instances.moc";
import { servicePropertiesMocData } from "./mockdata/service-properties.moc";
import { accessTokenMocData } from "./mockdata/access-token.moc";
import { invoicesMocData } from "./mockdata/invoices.moc";


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
            find: jest.fn().mockResolvedValue(aclMocData),
            findOne: jest.fn().mockImplementation((arg : FindOneOptions<User> ) => {
                return TestDBFunctions.findOne<User>(["id"],arg.where, aclMocData);
            })
        }
    },
    userProvider: {
        provide: getRepositoryToken(User),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(usersMocData),
            findOne: jest.fn().mockImplementation((arg : FindOneOptions<User> ) => {
                return TestDBFunctions.findOne<User>(["id","phoneNumber","username"],arg.where, usersMocData);
            })
        }
    },
    serviceInstancesProvider: {
        provide: getRepositoryToken((ServiceInstances)),
        useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn().mockImplementation((arg : FindOneOptions<ServiceInstances>) => {
                return TestDBFunctions.findOne<ServiceInstances>(["id","userId"],arg.where, serviceInstancesMocData);
            }),
            find: jest.fn().mockImplementation((arg : FindOneOptions<ServiceInstances>) => {
                return TestDBFunctions.find<ServiceInstances>(["id","userId"],arg.where, serviceInstancesMocData);
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
                    servicePropertiesMocData.forEach(obj => {
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
                return TestDBFunctions.findOne<AccessToken>(["id"],arg.where, accessTokenMocData);
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
                return TestDBFunctions.find(["userID"],args.where,invoicesMocData);
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
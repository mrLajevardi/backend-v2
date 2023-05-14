import { User } from "../../entities/User"
import { ServiceInstances } from "../../entities/ServiceInstances"

export const aclMocData =  [
    {
      model :'Invoices',
      accessType : 'create',
      principalType :'userId',
      principalId :'597',
      property :'index',
      permission :'can',
    },
    {
      model :'Invoices',
      accessType : 'create',
      principalType :'userId',
      principalId :'589',
      property :'index',
      permission :'cannot',
    }
]
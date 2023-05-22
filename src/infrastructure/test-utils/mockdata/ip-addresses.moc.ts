import { User } from "../../database/entities/User"
import { ServiceInstances } from "../../database/entities/ServiceInstances"

export const ipAddressesMocData =  {
    success: true,
    results: [
      {
        id: 531036,
        ip: '193.70.1.203',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        first_location: 'https://console.vast.ai/api/v0/users/current/',
        user_id: 61302,
        first_seen: 1682926744.8117812
      },
      {
        id: 523266,
        ip: '104.234.18.194',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.48',
        first_location: 'https://console.vast.ai/api/v0/instances/',
        user_id: 61302,
        first_seen: 1682344776.2748885
      },
    ]
  }
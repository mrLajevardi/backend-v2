import { User } from "../../entities/User"
import { ServiceInstances } from "../../entities/ServiceInstances"


export const invoicesMocData = [
    {
      id: 5671,
      serviceTypeId: 'vdc',
      rawAmount: 270000,
      planAmount: 0,
      planRatio: 1,
      finalAmount: 256500,
      description: 'description',
      dateTime: Date.parse("2023-03-25T03:07:53.430Z"),
      payed: true,
      voided: false,
      endDateTime: Date.parse("2023-06-23T03:07:53.430Z"),
      type: 0,
      name: 'test'
    },
    {
      id: 5919,
      serviceTypeId: 'aradAi',
      rawAmount: 0,
      planAmount: 0,
      planRatio: 1,
      finalAmount: 0,
      description: 'description',
      dateTime: Date.parse("2023-04-17T10:20:52.680Z"),
      payed: true,
      voided: false,
      endDateTime: Date.parse("2023-05-17T10:20:52.680Z"),
      type: 0,
      name: 'majid'
    },
    {
      id: 5920,
      serviceTypeId: 'vdc',
      rawAmount: 22000,
      planAmount: 0,
      planRatio: 1,
      finalAmount: 22000,
      description: 'description',
      dateTime: Date.parse("2023-04-17T10:24:23.953Z"),
      payed: true,
      voided: false,
      endDateTime: Date.parse("2023-05-17T10:24:23.953Z"),
      type: 0,
      name: 'ss'
    }
  ]
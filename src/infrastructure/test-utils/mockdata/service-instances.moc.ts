import { User } from "../../db/entities/User"
import { ServiceInstances } from "../../db/entities/ServiceInstances"

export const serviceInstancesMocData = [
    {
      id: '1A20E61D-21D9-414F-B5D9-814BB5C220CE',
      userId: 551,
      status: 3,
     createDate: Date.parse("2023-04-17T10:25:02.007Z"),
      lastUpdateDate: Date.parse("2023-04-17T10:25:02.007Z"),
      expireDate: Date.parse("2023-05-17T10:24:23.953Z"),
      deletedDate: Date.parse("2023-04-18T01:44:58.787Z"),
      isDeleted: true,
      index: 3,
      warningSent: 0,
      isDisabled: 0,
      name: 'ss',
      planRatio: null,
      lastPayg: null,
      nextPayg: null
    },
    {
      id: 'D1E47C43-3900-4F2F-B709-ACDE93F2D280',
      userId: 551,
      status: 3,
     createDate: Date.parse("2023-03-25T03:08:48.513Z"),
      lastUpdateDate: Date.parse("2023-03-25T03:08:48.513Z"),
      expireDate: Date.parse("2023-06-23T03:07:53.430Z"),
      deletedDate: Date.parse("2023-04-27T01:23:00.527Z"),
      isDeleted: true,
      index: 1,
      warningSent: 0,
      isDisabled: 0,
      name: 'test',
      planRatio: null,
      lastPayg: null,
      nextPayg: null
    },
    {
      id: 'C764E643-D28F-4013-8E6C-B929D4C64B85',
      userId: 551,
      status: 3,
     createDate: Date.parse("2023-04-17T10:20:53.023Z"),
      lastUpdateDate: Date.parse("2023-04-17T10:20:53.023Z"),
      expireDate: Date.parse("2023-05-17T10:20:52.680Z"),
      deletedDate: Date.parse("2023-04-18T02:26:54.367Z"),
      isDeleted: true,
      index: 2,
      warningSent: 0,
      isDisabled: 0,
      name: 'majid',
      planRatio: null,
      lastPayg: null,
      nextPayg: null
    },
    {
      id: '4061EC86-35E5-40EB-BA18-D780060800F3',
      userId: 551,
      status: 1,
     createDate: Date.parse("2023-03-25T03:07:05.130Z"),
      lastUpdateDate: Date.parse("2023-03-25T03:07:05.130Z"),
      expireDate: Date.parse("2024-03-25T03:07:05.117Z"),
      deletedDate: Date.parse("null"),
      isDeleted: false,
      index: 0,
      warningSent: 0,
      isDisabled: 0,
      name: null,
      planRatio: null,
      lastPayg: null,
      nextPayg: null
    }
  ]
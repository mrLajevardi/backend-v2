import { ApiResponseProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiResponseProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlUtMDkxMjg1MjQwNjUiLCJ1c2VySWQiOjEwNjAsImd1aWQiOiJBMzdDQjhFRi0zNUI5LTRDNTYtODgyQi0xOTg5RTdGOTNCRUUiLCJwZXJzb25hbFZlcmlmaWNhdGlvbiI6dHJ1ZSwiaW1wZXJzb25hdGVBcyI6bnVsbCwiaWF0IjoxNzA2MzQ5NDA1LCJleHAiOjE3MDYzNzgyMDV9.RSEI-qX4zrNxt2tYX1DI6_QE5QbQJeByDF5T6G6J-7Y',
  })
  access_token: string;

  @ApiResponseProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlUtMDkxMjg1MjQwNjUiLCJ1c2VySWQiOjEwNjAsImd1aWQiOiJBMzdDQjhFRi0zNUI5LTRDNTYtODgyQi0xOTg5RTdGOTNCRUUiLCJwZXJzb25hbFZlcmlmaWNhdGlvbiI6dHJ1ZSwiaW1wZXJzb25hdGVBcyI6bnVsbCwiaWF0IjoxNzA2MzQ5NDA1LCJleHAiOjE3MDYzNzgyMDV9.RSEI-qX4zrNxt2tYX1DI6_QE5QbQJeByDF5T6G6J-7Y',
  })
  ai_token?: string | null;
}

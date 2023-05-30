import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AiTransactionsLogs } from 'src/infrastructure/database/entities/AiTransactionsLogs';

@Controller('ai')
//@UseGuards(PoliciesGuard)
export class AiController {
//     @ApiOperation({ summary: 'for testing auth' })
//     @Get('test')
//     test() : string {
//         return 'hello';
//     }
    

//   @Get('CheckAradAiToken')
//   checkAradAiToken(
//     @Param('token') token: string,
//   ): { tokenValidity: boolean } {
//     return { tokenValidity: true };
//   }



//   @Post('/aiTransactionsLogs')
//   createAITransactionsLogs(
//     @Body() data: AiTransactionsLogs,
//   ): void {
//   }



//   @Post('/aradAi')
//   createAradAi(
//     @Body() data: Arad,
//   ): { token: string } {
//     return { token: 'xyz' };
//   }



//   @Get('/createOrGetDemoToken')
//   createOrGetDemoToken(): { demoToken: string } {
//     return { demoToken: 'abc' };
//   }



//   @Get('/aiTransactionsLogs/:serviceInstanceId')
//   getAITransactionsLogs(
//     @Param('serviceInstanceId') serviceInstanceId: string,
//     @Query('filter') filter: string,
//     @Query('page') page: string,
//     @Query('pageSize') pageSize: string,
//   ): { aiTransactionsLogs: any[] } {
//     return { aiTransactionsLogs: [] };
//   }



//   @Get('/aradAiDashoard/:serviceInstanceId')
//   getAradAiaDshboard(
//     @Param('serviceInstanceId') serviceInstanceId: string,
//   ): { aradAiDashoard: object } {
//     return { aradAiDashoard: {} };
//   }



//   @Get('/aradAiType')
//   getAradAiType(@Query('filter') filter: string): { aradAi: any[] } {
//     return { aradAi: [] };
//   }



//   @Get('/aradAiDashoardChart/:serviceInstanceId/:startDate/:endDate')
//   getDashboardChart(
//     @Param('serviceInstanceId') serviceInstanceId: string,
//     @Param('startDate') startDate: string,
//     @Param('endDate') endDate: string,
//   ): { aradAiDashoardChart: any[] } {
//     return { aradAiDashoardChart: [] };
//   }


}
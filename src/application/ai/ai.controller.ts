import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@Controller('ai')
//@UseGuards(PoliciesGuard)
export class AiController {
  constructor(private readonly service: AiService) {}

  // @ApiOperation({ summary: 'Check a Validation Token' })
  // @Get('/CheckAradAiToken/:token')
  // checkAradAiToken(
  //   @Param('token') token: string,
  //   @Query() options: object,
  // ): { tokenValidity: boolean } {
  //   // Your implementation here
  //   return { tokenValidity: true };
  // }

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

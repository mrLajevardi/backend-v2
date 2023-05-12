import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('vast')
@ApiTags('vast')
@ApiBearerAuth() // Requires authentication with a JWT token

export class VastController {

    @ApiOperation({ summary: 'for testing auth' })
    @Get('test')
    test() : string {
        return 'hello';
    }
    
}

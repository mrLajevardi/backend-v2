import { ApiProperty } from "@nestjs/swagger";

export class GithubLoginDto {
    @ApiProperty()
    code: string;
}
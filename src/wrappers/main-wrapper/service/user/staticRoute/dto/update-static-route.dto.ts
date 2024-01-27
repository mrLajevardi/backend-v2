import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStaticRouteDto {
  @IsString()
  gatewayId: string;

  @IsString()
  routeId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  networkCidr: string;

  @IsBoolean()
  systemOwned = false;

  nextHops: StaticRouteNextHops[];
}

export class StaticRouteNextHops {
  @IsString()
  ipAddress: string;

  @IsNumber()
  adminDistance: number;

  scope?: StaticRouteNextHopsScope;
}

export class StaticRouteNextHopsScope {
  @IsString()
  name: string;

  @IsString()
  scopeType: string;

  @IsString()
  id: string;
}

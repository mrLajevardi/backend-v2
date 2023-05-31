import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUsernameException extends HttpException {
  constructor() {
    super('Unauthorized request', HttpStatus.UNAUTHORIZED);
  }
}

export class NotEnoughCreditException extends HttpException {
  constructor() {
    super('Not enough credit', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidVdcParamsException extends HttpException {
  constructor() {
    super('Invalid VDC params', HttpStatus.BAD_REQUEST);
  }
}

export class ConflictException extends HttpException {
  constructor() {
    super('The request could not be processed because of conflict in the request', HttpStatus.CONFLICT);
  }
}

export class NotFoundException extends HttpException {
  constructor() {
    super('Not found', HttpStatus.NOT_FOUND);
  }
}

export class NoIpIsAssignedException extends HttpException {
  constructor() {
    super('No IP is assigned to this virtual data center', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class PaymentRequiredException extends HttpException {
  constructor() {
    super('Payment Required', HttpStatus.PAYMENT_REQUIRED);
  }
}

export class BadRequestException extends HttpException {
  constructor() {
    super('Bad request', HttpStatus.BAD_REQUEST);
  }
}

export class DisabledUserException extends HttpException {
  constructor() {
    super('User is disabled', HttpStatus.FORBIDDEN);
  }
}

export class NotVerifiedEmailException extends HttpException {
  constructor() {
    super('User email is not verified', HttpStatus.UNAUTHORIZED);
  }
}

export class MaxPerRequestException extends HttpException {
  constructor() {
    super('Requested data is more than maximum per request limit', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidEmailTokenException extends HttpException {
  constructor() {
    super('Token is invalid', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidPhoneTokenException extends HttpException {
  constructor() {
    super('Phone token is invalid', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidPhoneNumberException extends HttpException {
  constructor() {
    super('Phone is invalid', HttpStatus.BAD_REQUEST);
  }
}

export class UserAlreadyExistException extends HttpException {
  constructor() {
    super('User Already Exist', HttpStatus.BAD_REQUEST);
  }
}

export class SmsPanelErrorException extends HttpException {
  constructor() {
    super('SMS not send', HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super('Unauthorized request', HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden Access', HttpStatus.FORBIDDEN);
  }
}

export class UnavailableResourceException extends HttpException {
  constructor() {
    super('Resource is unavailable', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class InvalidServiceIdException extends HttpException {
  constructor() {
    super('Invalid service ID', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class InvalidDiscountIdException extends HttpException {
  constructor() {
    super('Invalid discount ID', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class InvalidServiceParamsException extends HttpException {
  constructor() {
    super('Invalid service param', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class InvalidQualityPlanIdException extends HttpException {
  constructor() {
    super('Invalid plan', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class MaxServiceException extends HttpException {
  constructor() {
    super('You hit your max available service', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor() {
    super('Unprocessable entity', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class InvalidAradAIConfigException extends HttpException {
  constructor() {
    super('Invalid Arad AI config', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class InvalidServiceInstanceIdException extends HttpException {
  constructor() {
    super('Invalid service instance ID', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Invalid Token', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class InvalidUseRequestPerDayException extends HttpException {
  constructor() {
    super('Use more than RequestPerDay', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidUseRequestPerMonthException extends HttpException {
  constructor() {
    super('Use more than RequestPerMonth', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidExpirationCreditException extends HttpException {
  constructor() {
    super('Expiration of credit', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidItemTypesException extends HttpException {
  constructor() {
    super('Invalid item types', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class ServiceIsDeployException extends HttpException {
  constructor() {
    super('Service is power on', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class VgpuPcNamePassRequiredException extends HttpException {
  constructor() {
    super('pcName and pcPassword is required', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

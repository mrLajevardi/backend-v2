import {Injectable, MiddlewareConsumer, Module, NestMiddleware, RequestMethod} from "@nestjs/common";
import {NextFunction} from "express";
import {CheckUserProfileMiddleware} from "./check-user-profile.middleware";

@Module({
    providers : [CheckUserProfileMiddleware],
    exports: [CheckUserProfileMiddleware]
})
export class CheckUserProfileModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckUserProfileMiddleware).forRoutes({path: '*' , method: RequestMethod.ALL})
    }
}
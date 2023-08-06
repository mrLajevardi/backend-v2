import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/application/base/security/auth/decorators/ispublic.decorator";

export class guardHelper {
  static checkValidModes(reflector: Reflector, context , user? ) {
    const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    let validMode = false; 
    if (isPublic) {
      validMode = true;
    }

    const superAdmins = process.env.SUPER_ADMINS;
    //console.log(superAdmins);
    if (
      user &&
      user.username &&
      user.username.length > 4 &&
      superAdmins && 
      superAdmins.includes(user.username)
    ) {
      //console.log('is superadmin');
      validMode = true;
    }

    //console.log('always valid mode:' , validMode, 'for user:', user );
    return validMode;
  }
}

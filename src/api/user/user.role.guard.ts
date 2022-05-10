import { Injectable, CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from '@nestjs/common';
import { ROLES_KEY } from "./user.roles.decorator"
import { Role } from './user.role.enum';
import RequestWithUser from './user.request';
import { UserAuthGuard } from './user.guard';

const RolesGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends UserAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
 
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      console.log("user....", user)
 
      return user?.roles.includes(role);
    }
  }
 
  return mixin(RoleGuardMixin);
}
// const RolesGuard = (role: Role): Type<CanActivate> => {
//     class RoleGuardMixin implements CanActivate {
//       canActivate(context: ExecutionContext) {
//         const request = context.switchToHttp().getRequest<RequestWithUser>();
//         const user = request.user;
//         console.log(user.roles)
   
//         return user?.roles.includes(role);
//       }
//     }
   
//     return mixin(RoleGuardMixin);
//   }

export default RolesGuard;

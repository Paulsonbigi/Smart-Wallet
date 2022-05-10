import { Request } from "@nestjs/common";
import { User } from "./user.entity";

interface RequestWithUser extends Request {
    user: User;
}

export default RequestWithUser;
import { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Expression {
    interface Request {
      user: JwtPayload;
    }
  }
}

import { TokenTypeEnum } from "../Utils/enums/user.enum.js";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../Utils/response/error.js";
import { getsignature, verifyToken } from "../utils/token/token.js";
import User from "../DB/Models/user.model.js";
import Token from "../DB/Models/token.model.js";

export const authentication =
  ({ tokenType = TokenTypeEnum.Access } = {}) =>
  async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw BadRequestException({
        message: "Authorization header is required",
      });
    }

    const [prefix, token] = authHeader.split(" ");

    if (!prefix || !token) {
      throw BadRequestException({ message: "Invalid token format" });
    }

    const signature = await getsignature({ signatureLevel: prefix });

    const decoded = verifyToken({
      token,
      secretKey:
        tokenType === TokenTypeEnum.Access
          ? signature.accessSignature
          : signature.refreshSignature,
    });

    const jti = decoded.jti;

    if (jti) {
      const isRevoked = await Token.findOne({ jti });
      if (isRevoked) {
        throw UnauthorizedException({
          message: "Token revoked, please login again",
        });
      }
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      throw NotFoundException({ message: "User not found" });
    }

    if (user.changeCredientialsTime) {
      const changeTime = Math.floor(
        user.changeCredientialsTime.getTime() / 1000
      );

      if (changeTime > decoded.iat) {
        throw UnauthorizedException({
          message: "Token expired due to credential change",
        });
      }
    }

    req.user = user;
    req.decoded = decoded;

    next();
  };

export const authorization =
  ({ role = [] }) =>
  (req, res, next) => {
    if (!req.user) {
      throw UnauthorizedException({ message: "Unauthorized" });
    }

    const userRole = Number(req.user.role);

    if (!role.includes(userRole)) {
      throw UnauthorizedException({ message: "User not authorized" });
    }

    next();
  };
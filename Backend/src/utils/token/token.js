import jwt from "jsonwebtoken";
import { RoleEnum, SignatureEnum } from "../enums/user.enum.js";
import {
  ACCESS_EXPIRES,
  TOKEN_ACCESS_ADMIN_SECRET_KEY,
  TOKEN_ACCESS_USER_SECRET_KEY,
  TOKEN_REFRESH_ADMIN_SECRET_KEY,
  TOKEN_REFRESH_USER_SECRET_KEY,
  REFRESH_EXPIRES,
} from "../../../Config/config.service.js";
import { v4 as uuidv4 } from 'uuid';

export const generateToken = (
  payload,
  secretKey = TOKEN_ACCESS_USER_SECRET_KEY,
  options = {
    expiresIn: ACCESS_EXPIRES,
    issuer: "http://localhost:3000",
    audience: "http://localhost:4500",
  },
) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey = TOKEN_ACCESS_USER_SECRET_KEY }) => {
  return jwt.verify(token, secretKey);
};

export const getsignature = async ({ signatureLevel = SignatureEnum.User }) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined };
  const level = String(signatureLevel).toLowerCase(); 
  switch (level) {
    case "admin":
    case String(SignatureEnum.Admin).toLowerCase():
      signature.accessSignature = TOKEN_ACCESS_ADMIN_SECRET_KEY;
      signature.refreshSignature = TOKEN_REFRESH_ADMIN_SECRET_KEY;
      break;

    case "user":
    case "bearer": 
    case String(SignatureEnum.User).toLowerCase():
    default:
      signature.accessSignature = TOKEN_ACCESS_USER_SECRET_KEY;
      signature.refreshSignature = TOKEN_REFRESH_USER_SECRET_KEY;
      break;
  }
  return signature;
};

export const getNewLoginCredientials = async (user, signatureLevel) => {
  let signature = await getsignature({
    signatureLevel:
      user.role != RoleEnum.Admin ? SignatureEnum.User : SignatureEnum.Admin,
  });
  console.log(signature);
 const jwtid = uuidv4();

const accessToken = generateToken(
  { _id: user._id, role: user.role },
  signature.accessSignature,
  {
    expiresIn:   ACCESS_EXPIRES,
    jwtid: jwtid,
  }
);

const refreshToken = generateToken(
  { _id: user._id, role: user.role },
  signature.refreshSignature,
  {
    expiresIn: REFRESH_EXPIRES,
    jwtid: jwtid,
  }
  );
  return { accessToken, refreshToken };
};

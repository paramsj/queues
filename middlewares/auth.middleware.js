import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { supabase } from "../db/supabase.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.query?.token;

  if (!token) {
    throw new ApiError(401, "Access token is required");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, role")
    .eq("id", decodedToken.id)
    .single();

  if (error || !user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  next();
});
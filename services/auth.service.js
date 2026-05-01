import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../db/supabase.js";
import { ApiError } from "../utils/ApiError.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

export const registerUserService = async ({ name, email, password, role = 'USER' }) => {
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        email,
        password_hash: passwordHash,
        role,
      },
    ])
    .select("id, name, email, role, created_at")
    .single();

  if (error) {
    throw new ApiError(500, error.message);
  }

  return user;
};

export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, role, password_hash")
    .eq("email", email)
    .single();

  if (error || !user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);

  delete user.password_hash;

  return {
    user,
    accessToken,
  };
};
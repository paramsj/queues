import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserService, loginUserService } from "../services/auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken } = await loginUserService(req.body);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json({
      success: true,
      message: "User logged in successfully",
      data: {
        user,
        accessToken,
      },
    });
});
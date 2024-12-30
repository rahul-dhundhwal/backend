import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message:"ok"
  // })

  const { fullName, email, username, password } = req.body;
  // console.log(email)

  if (
    [fullName, password, username, email].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "Account Already Exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // req.files?.avatar[0]?.path
  if (!avatar) {
    throw ApiError(400, "Avatar file is required");
  }
  const user= await  new User.create({
    fullName,
    email,
    password,
    username:username.toLowerCase(),
    avatar:avatar.url,
    coverImage:coverImage?.url||""
  })
  const createdUser= await User.findById(user._id).select(
    "-password -refreshTOken"
  )

  if(!createdUser){
    throw new ApiError(500,"Error while registering the user!!")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Created Successfully")
  )

});

export { registerUser };

/*
    1. details lenge
    2. submit option hoga submit krenge
       Validation  :- already exit ,bank,avatar image ,userbname unique 
    3. alag route p jaake data base m save krenge 
    4. save krne k liye jb bheja tb middleware m se jaake password ko encrypt krenge 
    5. succees ko return krenge 
    6  agar login rkhna h register k baad to cookies m store krenge 

*/

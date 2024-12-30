import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDIANRY_CLOUDNAME,
    api_key: process.env.CLOUDIANRY_API_KEY,
    api_secret: process.env.CLOUDIANRY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });

//file upload 
const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null
       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("File Uploaded",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }

}
export {uploadOnCloudinary}
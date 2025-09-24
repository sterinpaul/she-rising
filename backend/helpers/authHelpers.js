import AdminModel from "../models/admin.js";

const authHelpers = {
    signUp:async(email,password)=>{
        const newUser = new AdminModel({
            email,
            password
        })
        return await newUser.save()
    },
    getAdminByEmail:async(email)=>{
        return await AdminModel.findOne({email},{__v:0})
    },
    getUserByEmail:async(email)=>{
        return await AdminModel.findOne({email},{__v:0})
    },
    checkAdminExistance:async(email)=>{
        return await AdminModel.exists({email})
    }
}

export default authHelpers;
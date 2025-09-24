import { model, Schema } from "mongoose";

const AdminSchema = new Schema (
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profilePic:{
            type: String
        },
    },
    {
        timestamps: true
    }
)


const AdminModel = model('admin', AdminSchema);
export default AdminModel;


import Joi from "joi";
import configKeys from "../config/configKeys.js";
import authHelpers from "../helpers/authHelpers.js";
import authService from "./authService.js";

export const seedInitialData = async () => {
  try {
    const adminSchema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().min(6).max(12).required(),
    });
    const { error, value } = adminSchema.validate({
      email: configKeys.ADMIN_EMAIL,
      password: configKeys.ADMIN_PASSWORD,
    });

    if (error) {
      return res
        .status(200)
        .json({ status: false, message: error.details[0].message });
    }
    const isExists = await authHelpers.checkAdminExistance(value.email);
    if (isExists) {
      console.log("initial seeding already done");
    } else {
      const hashedPassword = await authService.encryptPassword(value.password);
      const response = authHelpers.signUp(value.email, hashedPassword);
      if(response){
            console.log("Seeding completed");
        }else{
            console.log("Seeding not done");
      }
    }
  } catch (error) {
    console.error(`Error seeding initial data: ${error}`);
  }
};

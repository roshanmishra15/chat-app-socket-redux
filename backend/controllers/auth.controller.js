import User from "../models/User.js";
import { registerSchema } from "../validators/auth.validator.js";
import { LoginSchema } from "../validators/login.validator.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
export const register = async (req, res) => {
    try {


        const { error } = registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            })
        }
        const { fullname, email, mobile, password } = req.body;

        // checking user is already exist or not 
        let isExistUser = await User.findOne({ email })
        if (isExistUser) {
            return res.status(400).json({
                message: "User is already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // last step save user in db
        const resp = await User.create({
            fullname,
            email,
            mobile,
            password: hashedPassword,
        })
        if (resp) {
            return res.status(201).json({
                message: "User Register Successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }

}
export const login = async (req, res) => {
    try {
        // validation check
        const { error } = LoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: "invalid by joi"
            })
        }

        // find user in db
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid Creditendals"
            })
        }

        // now password  check 
        let isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        // JWT Applied here 
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "1d"
            }

        )

        return res.status(200).json({
            message: "Login Successfuly",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            },
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong"
        })
    }
}
export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Get me Error:", error.message);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

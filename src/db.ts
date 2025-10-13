import mongoose,{Schema,model} from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
let uri = process.env.MONGODB_URI
console.log("uri type : ",typeof(uri))
//@ts-ignore
mongoose.connect(uri)

const userSchema = new Schema({
    userName: {
        type: String,
        required:true,
        unique: true,
        minLength: 3,
        maxLength: 8,
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
    }
})

export const userModel = model("Users", userSchema);

const contentSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    link:{
        type: String,
        required: true,
    },
    notes:{
        type: String,
        timestamp: true
    },
    userId:{
        type: Object,
        ref: 'Users',
        required: true
    },
    tags:[{
        type: String,
        trim:true,
        lowercase:true,
    }],
    isPublic:{
        type: Boolean,
        default: false,
    },
    shareableId: {
        type: String,
        default: null,
    },
}, {timestamps:true})

export const contentModel = model('Contents', contentSchema)
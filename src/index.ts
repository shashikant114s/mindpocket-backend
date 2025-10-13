import express from "express";
import { contentModel, userModel } from "./db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { middleware } from "./middleware.js";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

export const app = express();
const JWT_Secret = process.env.JWT_SECRET;
const PORT = process.env.PORT;
const BaseURL = process.env.BaseURL

console.log("✅ Loaded ENV:", {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
});
app.use(express.json());
// signUp-Endpoint
app.post('/api/v1/signup', async (req, res) => {
    const { userName, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 2);
    const newUser = await userModel.create({
        userName,
        password: hashedPassword,
    })
    res.status(200).json({
        message: "Registered Successfully"
    })
})

// signIn-Endpoint
app.post('/api/v1/signin', async (req, res) => {
    const { userName, password } = req.body;
    const userExists = await userModel.findOne({ userName })

    if (userExists) {
        const passwordCheck = await bcrypt.compare(password, userExists.password)
        if (passwordCheck) {
            const token = jwt.sign(userExists.userName, JWT_Secret!) //here ! tells TypeScript: “I’m sure this value is not undefined.”
            return res.json({
                message: `Welcome ${userName}`,
                jwt_token: token
            })
        }
    }
    if (!userExists) {
        return res.status(401).json({
            message: "User Not Found"
        })
    }
})

// get-content-endpoint
app.get('/api/v1/content', middleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId
        ; const content = await contentModel.find({ userId: userId })
    if (!content) return res.status(404).json({ message: "No Content Found" })
    res.status(200).json({ content })
})
// postNew-content-endpoint
app.post('/api/v1/content', middleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    //@ts-ignore
    const userName = req.userName;
    const { title, link, notes, tags, isPublic } = req.body;
    const newContentEntry = await contentModel.create({
        title,
        link,
        notes,
        userId,
        tags,
        isPublic,
    })
    res.status(200).json({
        message: "Saved"
    })
})

// update-content-endpoint
app.put('/api/v1/content/:id', middleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const contentId = req.params.id;
    const { title, link, notes, tags, isPublic } = req.body;

    try {
        const updatedContent = await contentModel.findOneAndUpdate(
            { _id: contentId, userId },
            { title, link, notes, tags, isPublic },
            { new: true }
        )
        if (!updatedContent) {
            return res.status(404).json({
                message: "Content not found or unauthorized"
            });
        }

        res.status(200).json({
            message: "Updated"
        })
    } catch (error) {
        console.log("catched Error at PUT req: ", error)
    }
})
// delete-content-endpoint
app.delete('/api/v1/content/:id', middleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const contentId = req.params.id;
    try {
        const deleteContent = await contentModel.findOneAndDelete(
            {
                _id: contentId,
                userId
            });

        if (!deleteContent) {
            return res.status(404).json({
                message: "Content not found or UnAuthorised",
            })
        }

        res.status(200).json({
            message: "Content Deleted Successfully",
            data: deleteContent
        })
    } catch (error) {
        console.log('Error while deleting: ', error)
    }
})

// isPublic-toggle-endpoint
app.post('/api/v1/content/:id/isPublic', middleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const contentId = req.params.id;
    const { isPublic } = req.body;

    try {
        const content = await contentModel.findOne({ _id: contentId, userId });
        if (!content) return res.status(404).json({ message: "Content not found" })

        if (isPublic && content.shareableId === null) {
            content.shareableId = uuidv4();
        }
        content.isPublic = isPublic;
        await content.save();

        res.status(200).json({
            message: isPublic ? "Your Note is now Public" : "Your Note is now Private",
            shareableLink: isPublic ? `${BaseURL + content.shareableId}` : null,
            // shareableLink: isPublic ? `http://localhost:3000/share/${content.shareableId}` : null,
        });
    } catch (error) {
        console.log(error)
    }
})

// content-shareable 
app.get('/share/:shareableId', async (req, res) => {
    const shareableId = req.params.shareableId;
    console.log("shareID:", shareableId)

    const sharedContent = await contentModel.findOne({ shareableId: shareableId, isPublic: true })

    if (!sharedContent) {
        res.status(404).json({
            message: "Either link has been moved to Private or Your link is broken. after confirmation try again."
        })
    }

    res.status(200).json({
        content: sharedContent
    })
})

app.listen(PORT)
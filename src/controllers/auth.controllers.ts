import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import prisma from "../Prisma";
import { error } from "console";

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const registerUser = async (req: Request, res: Response) => {
    const { email, Password } = req.body;

    if (!email || !Password) {
        return res.status(401).json({ message: 'Email and Password Required !' });
    }

    try {
        const exsistingUser = await prisma.user.findUnique({ where: { email } });
        if (exsistingUser) {
            return res.status(404).json({ message: 'User already exsist' });
        }
        const hashedPassword = await bcrypt.hash(Password, 11);
        const newuser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        const token = Jwt.sign({ id: newuser.id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: 'User registered successfully', token });

    }
    catch (e) {
        res.status(409).json({ message: 'Registration Failed', error: e });
    }
}
export const loginUser = async (req: Request, res: Response) => {
    const { email, Password } = req.body;

    if (!email || !Password) {
        return res.status(401).json({ message: 'Email and Password Required !' });
    }

    try {
        const User = await prisma.user.findUnique({ where: { email } });
        if (!User) {
            return res.status(404).json({ message: 'Invalid Credentials!' });
        }
        const ismatch = await bcrypt.compare(Password, User.password);
        if (!ismatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = Jwt.sign({ id: User.id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({message: 'Login successful',token});

    }
    catch (e) {
        res.status(409).json({ message: 'Something went wrong please try again later!', error: e });
    }
}

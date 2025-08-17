import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password } = body;

        // Validate input
        if (!username || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const existedEmailQuery = `
            SELECT user_id FROM user
            WHERE email = ?
        `;

        const [existedEmail] = await pool.query(existedEmailQuery, [email]) as any[];

        if (existedEmail.length > 0) {
            return NextResponse.json({ message: "Email has been used" }, { status: 409 });
        }

        const userId = Math.random().toString(36).substr(2, 10).toUpperCase();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserQuery = `
            INSERT INTO user (user_id, username, email, hash_password, role)
            VALUES (?, ?, ?, ?, ?)
        `;

        await pool.query(newUserQuery, [userId, username, email, hashedPassword, "Employee"]);

        return NextResponse.json({ 
            message: "User created successfully",
        }, { status: 201 });
        
    } catch (error) {
        console.error('Sign-up error:', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
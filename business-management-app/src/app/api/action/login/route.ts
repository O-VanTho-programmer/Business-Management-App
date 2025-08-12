import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    try {
        const query = `
            SELECT * FROM user
            WHERE email = ?
            LIMIT 1
        `;

        const [users] = await pool.query(query, [email]) as any[];
        
        if (users.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.hash_password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        const token = await signToken({ userId: user.user_id, email: user.email });

        const res = NextResponse.json({ 
            message: "Login successfully!", 
            user: { id: user.user_id, email: user.email, username: user.username, role: user.role }
        }, {status: 200});
        
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return res;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
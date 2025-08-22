import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = NextResponse.json({
            message: "Logout successfully!",
        }, { status: 200 });

        res.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires: new Date(0) //Make it expire now
        });

        return res;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: "Internal server error", error },
            { status: 500 }
        );
    }
}
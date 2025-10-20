import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent" }, { status: 200 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountType, theme, language, currency, dateFormat } = body;

    // Update user preferences
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(accountType && { accountType }),
        ...(theme && { theme }),
        ...(language && { language }),
        ...(currency && { currency }),
        ...(dateFormat && { dateFormat }),
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        accountType: user.accountType,
        theme: user.theme,
        language: user.language,
        currency: user.currency,
        dateFormat: user.dateFormat,
      },
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        accountType: true,
        theme: true,
        language: true,
        currency: true,
        dateFormat: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

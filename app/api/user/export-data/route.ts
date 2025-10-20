import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        transactions: true,
        monthlyBudgets: true,
        subscriptions: true,
        goals: true,
        bankAccounts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data
    const { password, resetToken, verificationToken, ...userData } = user;

    // Create export data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: userData,
      summary: {
        totalTransactions: user.transactions.length,
        totalBudgets: user.monthlyBudgets.length,
        totalSubscriptions: user.subscriptions.length,
        totalGoals: user.goals.length,
        totalBankAccounts: user.bankAccounts.length,
      },
    };

    return NextResponse.json(exportData, { status: 200 });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}

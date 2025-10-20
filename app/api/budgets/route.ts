import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET budget for a specific month
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json({ error: "Month parameter required" }, { status: 400 });
    }

    let budget = await prisma.monthlyBudget.findUnique({
      where: {
        userId_month: {
          userId: user.id,
          month,
        },
      },
    });

    if (!budget) {
      return NextResponse.json(null);
    }

    // Calculate actual income and expenses from transactions for this month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const actualIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const actualExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    // Update the budget with actual values
    budget = await prisma.monthlyBudget.update({
      where: { id: budget.id },
      data: {
        actualIncome,
        actualExpenses,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}

// POST create a new monthly budget
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { month, plannedIncome, plannedExpenses } = body;

    if (!month || plannedIncome === undefined || plannedExpenses === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const budget = await prisma.monthlyBudget.create({
      data: {
        userId: user.id,
        month,
        plannedIncome: parseFloat(plannedIncome),
        plannedExpenses: parseFloat(plannedExpenses),
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}

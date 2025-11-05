import { connectDB } from "@/lib/db";
import Transaction from "@/models/TransactionModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const transaction = await Transaction.create(body);
    return NextResponse.json(transaction);
  } catch (err) {
    console.error("Transaction error:", err);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();
  const transactions = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(transactions);
}

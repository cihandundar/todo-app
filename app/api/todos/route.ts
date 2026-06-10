import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const todos = await prisma.todo.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
}

export async function POST(req: Request) {
    try {
        const { title } = await req.json();
        console.log("Creating todo:", title);

        const todo = await prisma.todo.create({
            data: { title },
        });

        console.log("Created:", todo);
        return NextResponse.json(todo, { status: 201 });
    } catch (error) {
        console.error("ERROR creating todo:", error);
        return NextResponse.json(
            { error: "Failed to create todo", details: error },
            { status: 500 }
        );
    }
}
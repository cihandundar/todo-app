import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { completed } = await req.json();
    const todo = await prisma.todo.update({
        where: { id },
        data: { completed },
    });
    return NextResponse.json(todo);
}

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
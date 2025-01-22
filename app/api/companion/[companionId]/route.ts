// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(
    req: Request,
    { params }: { params: { companionId: string } }

) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;


    if(!params.companionId){
        return new NextResponse("CompanionId is required",{status:400});
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    };

    const companion = await prismadb.companion.update({
        where:{
            id: params.companionId,
            userId: user.id,
        },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      }
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_PATCH]", error);
    return new NextResponse("Internal Error !!", { status: 500 });
  }
};



export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.companionId) {
      return new NextResponse("CompanionId is required", { status: 400 });
    }

    const existingCompanion = await prismadb.companion.findUnique({
      where: { id: params.companionId },
    });

    if (!existingCompanion || existingCompanion.userId !== user.id) {
      return new NextResponse("Companion not found or access denied", { status: 404 });
    }

    await prismadb.companion.delete({
      where: { id: params.companionId },
    });

    return new NextResponse("Companion deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[COMPANION_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

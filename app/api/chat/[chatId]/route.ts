import dotenv from "dotenv";
import { Readable } from "stream";
import { StreamingTextResponse } from "ai";
import { currentUser } from "@clerk/nextjs";
import OpenAI from "openai";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

dotenv.config({ path: `.env` });

export async function POST(
    request: Request,
    { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    const companionKey = {
      companionName: companion.id,
      userId: user.id,
      modelName: "gpt-4o",
    };
    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(companionKey);
    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }
    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

    const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

    const similarDocs = await memoryManager.vectorSearch(
        recentChatHistory,
        `${companion.id}.txt`
    );

    let relevantHistory = "";
    if (similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    const client = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env["GITHUB_TOKEN"],
    });

    const stream = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: companion.instructions || "You are a helpful assistant." },
        { role: "system", content: `Relevant details about ${companion.name}'s past:\n${relevantHistory}` },
        { role: "user", content: `${recentChatHistory}\n${prompt}` },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        (async () => {
          for await (const part of stream) {
            const content = part.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(content));
            await memoryManager.writeToHistory(content, companionKey);
          }
          controller.close();
        })();
      },
    });

    await prismadb.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    return new StreamingTextResponse(readableStream);
  } catch (error) {
    console.error("Error in POST request:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

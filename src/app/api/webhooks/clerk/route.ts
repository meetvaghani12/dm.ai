import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { client } from "@/lib/prisma";

type Event = {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  object: string;
  type: string;
};

async function handler(request: Request) {
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // Handle user creation events
  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    try {
      // Check if user already exists
      const existingUser = await client.user.findUnique({
        where: { clerkId: id }
      });

      if (!existingUser && email && first_name && last_name) {
        // Create new user
        await client.user.create({
          data: {
            clerkId: id,
            email,
            firstname: first_name,
            lastname: last_name,
            subscription: {
              create: {}, // Create default subscription
            }
          }
        });
        console.log(`User created/updated in database: ${id}`);
      } else if (existingUser) {
        // Update existing user if needed
        await client.user.update({
          where: { clerkId: id },
          data: {
            email,
            firstname: first_name,
            lastname: last_name,
          }
        });
      }
      
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error saving user to database:", error);
      return NextResponse.json({ error: "Error saving user" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export const POST = handler; 
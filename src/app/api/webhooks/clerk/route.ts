import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET não está definido");
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Headers do webhook ausentes", { status: 400 });
  }

  const payload = await req.text();

  const wh = new Webhook(webhookSecret);

  let event: WebhookEvent;

  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Assinatura inválida", { status: 400 });
  }

  switch (event.type) {
    case "user.created": {
			const { id, email_addresses, first_name, last_name } = event.data;

			await prisma.user.create({
				data: {
					clerkUserId: id,
					email: email_addresses[0]?.email_address ?? "",
					name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
				},
			});
			break;
		}

		case "user.updated": {
			const { id, email_addresses, first_name, last_name } = event.data;

			await prisma.user.update({
				where: { clerkUserId: id },
				data: {
					email: email_addresses[0]?.email_address ?? "",
					name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
				},
			});
			break;
		}

		case "user.deleted": {
			const { id } = event.data;

			await prisma.user.delete({
				where: { clerkUserId: id! },
			});
			break;
		}
  }

  return new Response("OK", { status: 200 });
}
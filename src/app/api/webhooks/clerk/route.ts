import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

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
  } catch {
    return new Response("Assinatura inválida", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses[0]?.email_address ?? "";
      const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();

      // getUser() may have already created the user on first access,
      // and webhooks can arrive out of order, so both events upsert.
      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: { email, name },
        create: { clerkUserId: id, email, name },
      });
      break;
    }

    case "user.deleted": {
      const { id } = event.data;

      if (!id) break;

      const user = await prisma.user.findUnique({
        where: { clerkUserId: id },
        select: { id: true },
      });

      if (!user) break;

      // Foreign keys are RESTRICT, so dependent rows are removed first.
      await prisma.$transaction([
        prisma.appointmentService.deleteMany({
          where: { appointment: { userId: user.id } },
        }),
        prisma.appointment.deleteMany({ where: { userId: user.id } }),
        prisma.client.deleteMany({ where: { userId: user.id } }),
        prisma.barber.deleteMany({ where: { userId: user.id } }),
        prisma.service.deleteMany({ where: { userId: user.id } }),
        prisma.user.delete({ where: { id: user.id } }),
      ]);
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
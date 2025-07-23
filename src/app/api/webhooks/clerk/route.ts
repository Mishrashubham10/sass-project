import { createUserSubscription } from '@/server/db/subscription';
import { deleteUser } from '@/server/db/user';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  const headerPayload = headers();
  const svixId = (await headerPayload).get('svix-id');
  const svixTimestamp = (await headerPayload).get('svix-timestamp');
  const svixSignature = (await headerPayload).get('svix-signature');

  // If there is no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verfying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  switch (event.type) {
    case 'user.created': {
      // USER CREATED
      await createUserSubscription({
        clerkUserId: event.data.id,
        tier: 'Free',
      });
      break;
    }
    case 'user.deleted': {
      if (event.data.id != null) {
        await deleteUser(event.data.id);
        // TODO remove stripe subscription
      }
    }
  }

  console.log(event);

  return new Response('', { status: 200 });
}
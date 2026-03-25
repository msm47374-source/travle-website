import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { z } from 'zod';

const payloadSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  location: z.string().optional().default('Not supplied'),
  service: z.string().optional().default('Not supplied'),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().min(20),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const parsed = payloadSchema.safeParse(JSON.parse(event.body ?? '{}'));

  if (!parsed.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid review payload' }),
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.REVIEW_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? 'msm47374@gmail.com';

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing RESEND_API_KEY' }),
    };
  }

  const resend = new Resend(apiKey);
  const data = parsed.data;

  await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? 'Darwin Cleaning <onboarding@resend.dev>',
    to: [toEmail],
    replyTo: data.email,
    subject: `New website review from ${data.name} (${data.rating}/5)`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Location: ${data.location}`,
      `Service: ${data.service}`,
      `Rating: ${data.rating}/5`,
      '',
      'Review:',
      data.message,
    ].join('\n'),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};

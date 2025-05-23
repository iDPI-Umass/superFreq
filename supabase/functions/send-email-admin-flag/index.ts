// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import nodemailer from 'npm:nodemailer@6.9.10'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const transport = nodemailer.createTransport({
  host: Deno.env.get('SMTP_HOSTNAME')!,
  port: Number(Deno.env.get('SMTP_PORT')!),
  auth: {
    user: Deno.env.get('SMTP_USERNAME')!,
    pass: Deno.env.get('SMTP_PASSWORD')!
  }
})

console.log(`Function "send-email-admin-flag" up and running!`)


Deno.serve(async (req) => {
  try {
    const { record } = await req.json()
    const { id, updated_at, user_id, target_post_id, type, active, target_post_slug } = record
    const updatedAtDate = new Date(updated_at).toLocaleString("en-US", { timeZone: 'America/New_York' })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data, error } = await supabase.from('profiles').select(`username, display_name`).eq('id', user_id)

    if ( error ) {
      console.log('supabase data error')
      return reject(error)
    }

    const { username, display_name } = data[0]

    await new Promise<void>((resolve, reject) => {
      if ( target_post_id && active && type == 'flag' ) {
        transport.sendMail({
          from: Deno.env.get('SMTP_FROM')!,
          to: `hello@freq.social`,
          subject: `New flag: ${id}`,
          text: `New flag (${id}) by ${display_name} (${username}) at ${updatedAtDate}.\r\n\r\n Post:\r\n https://freq.social/posts/${target_post_slug}\r\n\r\n Moderation dashboard:\r\n https://freq.social/admin/moderation`,
          html: `<h2>New flag: ${id}</h2><p>By <a href=\"https://freq.social/user/${username}\">${display_name} (${username})</a> at ${updatedAtDate}</p><p><b>Post</b><br /> <a href=\"https://freq.social/posts/${target_post_slug}\">https://freq.social/posts/${target_post_slug}</a></p><p>Moderation dashboard: <br /> <a href=\"https://freq.social/admin/moderation\">https://freq.social/admin/moderation</a></p>`
        }, error => {
          if (error) {
            console.log('smtp error:', error)
            return reject(error)
          }
    
          console.log(`flag ${id} notification sent to hello@freq.social`)
          resolve()
        })
      }
      else {
        console.log('flag notification not sent')
        return new Response("notification not sent", { status: 200 })
      }
    })
  } catch (error) {
    console.log('error sending')
    return new Response(error.message, { status: 500 })
  }

  return new Response(
    JSON.stringify({
      done: true,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-email-admin-flag' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"collectionTitle":"Freq beta test listening club March 2025","collectionLink":"https://www.freq.social/collection/193","bugReportLink":"https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform"}'

*/

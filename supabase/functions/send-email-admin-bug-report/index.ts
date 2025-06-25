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

console.log(`Function "send-email-admin-bug-report" up and running!`)


Deno.serve(async (req) => {
  try {
    const { record } = await req.json()
    const { id, created_at, user_id, type, path, description, email } = record
    const createdAtDate = new Date(created_at).toLocaleString("en-US", { timeZone: 'America/New_York' })

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
      if ( id ) {
        console.log('attempting to send')
        transport.sendMail({
          from: Deno.env.get('SMTP_FROM')!,
          to: `hello@freq.social`,
          // subject: 'bug report',
          subject: `New bug report: ${id}`,
          // text: 'test',
          // text: `New bug report ${id}.`,
          text: `New bug report (${id}) by ${display_name} (${username}) ${email} at ${createdAtDate}.\r\n\r\n Type:\r\n ${type}\r\n\r\n Path:\r\n ${path} \r\n\r\n Description: \r\n ${description} \r\n\r\n Bug report dashboard:\r\n https://freq.social/admin/bug-reports`,
          html: `<h2>New bug report: ${id}</h2><p>By <a href=\"https://freq.social/user/${username}\">${display_name} (${username})</a> <a href=\"mailto:${email}\">${email}</a> at ${createdAtDate}</p><p><b>Type</b><br /> ${type}</p><p><b>Path</b><br />${path}</p><p><b>Description</b><br /> ${description}</p><p>Bug report dashboard: <br /> <a href=\"https://freq.social/admin/bug-reports\">https://freq.social/admin/bug-reports</a></p>`
        }, error => {
          if (error) {
            console.log('smtp error:', error)
            return reject(error)
          }
    
          console.log(`bug report ${id} notification sent to hello@freq.social`)
          resolve()
        })
      }
      else {
        console.log('bug report notification not sent')
        return new Response("notification not sent", { status: 200 })
      }
    })
  } catch (error) {
    console.log(error)
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-email-admin-bug-report' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"id":"000","username":"username", "display_name": "display_name", "email": "email", "createdAtDate": "date", "type": "type", "path": "path", "description": "description"}'

*/

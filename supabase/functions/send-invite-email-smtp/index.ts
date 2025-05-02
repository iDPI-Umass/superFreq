// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import nodemailer from 'npm:nodemailer@6.9.10'

const transport = nodemailer.createTransport({
  host: Deno.env.get('SMTP_HOSTNAME')!,
  port: Number(Deno.env.get('SMTP_PORT')!),
  auth: {
    user: Deno.env.get('SMTP_USERNAME')!,
    pass: Deno.env.get('SMTP_PASSWORD')!
  }
})

console.log(`Function "send-email-smtp" up and running!`)


Deno.serve(async (req) => {
  try {
    const { record } = await req.json()
    const { email, approved, approved_at, user_id, group } = record
    await new Promise<void>((resolve, reject) => {
      if ( approved && approved_at && group && !user_id) {
        transport.sendMail({
          from: Deno.env.get('SMTP_FROM')!,
          to: email,
          subject: `Welcome to the Freq beta test!`,
          text: `Hello, you requested an invite to Freq, and I'm excited to say that as of today you can join the project's beta test.\r\n\r\n You're approved to log in using the email address you're receiving this at https://freq.social\r\n\r\n If you're having trouble logging in, just email hello@freq.social\r\n\r\n After you've created an account and gotten familiar with the place, go ahead and add something to this collection: https://www.freq.social/collection/217\r\n\r\nabout this beta test\r\n\r\n If you've never taken part in a beta test before, it's basically a process for testing the pre-release version of a piece of software. So that means you use it however you use it, play around, have fun, all that good stuff. It also means that you're supposed to report bugs and give feedback on the software. Any bug you report will get addressed pretty quickly, so reporting that stuff is really helpful for making everyone's experience on this software better. https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform\r\n\r\n I'm hoping you'll be candid with your feedback, optimistic about how this could be better, and patient as I take some time to fix or update stuff. It's really just me and me alone doing the software development right now, and by nature of doing this as part of my job at an academic lab, I have other things to do as well. Plus I like doing stuff outside of work and chilling out, so it might take a few days (or longer) to fix bugs.\r\n\r\n  If something is totally broken in a way that prevents you from using the site or using a key feature, please just email hello@freq.soocial\r\n\r\n And if you know anyone else who wants to be part of this beta test, just tell folks to fill out this invite request form: https://freq.social/welcome/invite-request. The more of your friends who use this thing, the more fun it will be for you—I imagine!\r\n\r\n about iDPI\r\n\r\n This is a project from the Initiative for Digital Public Infrastructure at UMass Amherst. We have a lot of good stuff you can check out. The BBC just published two pieces about our research into YouTube. We have other software projects. We've got a really good podcast that I produce called “Reimagining the Internet.” We published a manifesto about making the Internet a better, more publicly-minded place.\r\n https://publicinfrastructure.org/ \r\n https://www.bbc.com/future/article/20250306-inside-youtubes-hidden-world-of-forgotten-videos \r\n https://www.bbc.com/future/article/20250213-youtube-at-20-a-computer-that-drunk-dials-online-videos-reveals-statistics-that-google-doesnt-want-you-to-know \r\n https://publicinfrastructure.org/software/ \r\n https://podcasts.apple.com/us/podcast/reimagining-the-internet/id1536438908 \r\n https://publicinfrastructure.org/2023/03/29/the-three-legged-stool /\r\n\r\n Thank you!!!!!!! \r\n sug`,
          html: `<p>Hello, you requested an invite to Freq, and I'm excited to say that as of today you can join the project's beta test.<p><p>You/re approved to log in using the email address you're receiving this at. <a href=\"https://freq.social\">https://freq.social</a></p><p>If you're having trouble logging in, just email <a href=\"mailto:hello@freq.social\">hello@freq.social</a>.</p><p>After you’ve created an account and gotten familiar with the place, go ahead and add something to this collection: <a href=\"https://www.freq.social/collection/217\">\"Freq beta test listening club April 2025\"</a></p><h2>about this beta test</h2><p>If you've never taken part in a beta test before, it's basically a process for testing the pre-release version of a piece of software. So that means you use it however you use it, play around, have fun, all that good stuff. It also means that you're supposed to report bugs and give feedback on the software. Any bug you report will get addressed pretty quickly, so reporting that stuff is really helpful for making everyone's experience on this software better. <a href=\"https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform\">https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform</a></p><p>I'm hoping you'll be candid with your feedback, optimistic about how this could be better, and patient as I take some time to fix or update stuff. It's really just me and me alone doing the software development right now, and by nature of doing this as part of my job at an academic lab, I have other things to do as well. Plus I like doing stuff outside of work and chilling out, so it might take a few days (or longer) to fix bugs.</p><p>If something is totally broken in a way that prevents you from using the site or using a key feature, please just email <a href=\"mailto:hello@freq.social\">hello@freq.social</a>.</p><p>You can keep track of bug fixes, new features, and other updates on the <a href=\"https://freq.social/about/updates\">updates page</a>.</p><p>And if you know anyone else who wants to be part of this beta test, just tell folks to fill out this <a href=\"https://freq.social/welcome/invite-request\">invite request form</a>. The more of your friends who use this thing, the more fun it will be for you—I imagine!</p><h2>about iDPI</h2><p>This is a project from the <a href=\"publicinfrastructure.org\">Initiative for Digital Public Infrastructure</a> at UMass Amherst. We have a lot of good stuff you can check out. The BBC just published <a href=\"https://www.bbc.com/future/article/20250306-inside-youtubes-hidden-world-of-forgotten-videos\">two</a> <a href=\"https://www.bbc.com/future/article/20250213-youtube-at-20-a-computer-that-drunk-dials-online-videos-reveals-statistics-that-google-doesnt-want-you-to-know\">pieces</a> about our research into YouTube. We have other <a href=\"https://publicinfrastructure.org/software/\">software projects</a>. We've got a really good podcast that I produce called <a href=\"https://podcasts.apple.com/us/podcast/reimagining-the-internet/id1536438908\">“Reimagining the Internet.”</a> We published a <a href=\"https://publicinfrastructure.org/2023/03/29/the-three-legged-stool/\">manifesto</a> about making the Internet a better, more publicly-minded place.<p/><p>Thank you!!!!!!!<br />sug</p>`
        }, error => {
          if (error) {
            return reject(error)
          }
    
          console.log('invite to sent to ', email)
          resolve()
        })
      }
      else {
        console.log('invites table updated but invite email not sent')
        return new Response("invite not sent", { status: 200 })
      }
    })
  } catch (error) {
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-invite-email-smtp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"collectionTitle":"Freq beta test listening club March 2025","collectionLink":"https://www.freq.social/collection/193","bugReportLink":"https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform"}'

*/

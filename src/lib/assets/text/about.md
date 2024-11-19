---
title: Freq, short for "Frequency"
layout: about
---

<script lang="ts">
    import Guidelines from '$lib/assets/text/community-guidelines.md'
    import Consent from '$lib/assets/text/data-consent.md'
</script>


<div class="section-link-box">
    <ul>
        <li>
            <a href="#features">
                How Freq works
            </a>
        </li>
        <li>
            <a href="#guidelines">
                Community guidelines
            </a>
        </li>
        <li>
            <a href="#goals">
                Our intentions
            </a>
        </li>
        <li>
            <a href="#team">
                Our team
            </a>
        </li>
        <li>
            <a href="#roadmap">
                Roadmap
            </a>
        </li>
        <li>
            <a href="#bugs">
                Known bugs
            </a>
        </li>
        <li>
            <a href="#data">
                Our data
            </a>
        </li>
        <li>
            <a href="#consent">
                Data consent
            </a>
        </li>
    </ul>
</div>

When a music listener wants to hear new music, how do they discover it? Some rely on algorithmic recommendations built into music streaming services or social media platforms. Some listeners find small corners of the internet, where they talk about their favorite genres or artists, like subreddits, Facebook groups, or Discord servers. Listeners can find music this way, but it’s not organic. Others have developed highly specialized skill sets to navigate vast marketplaces like Discogs and Bandcamp.

What’s missing is a purpose-built place to talk about, listen to, and spread knowledge about music with the people you would already call your community. Those might be your fellow DJs at your college radio station, your group of friends who goes to dance parties together, or the people in your town you run into at shows all the time.

A lot of natural and incredible music discovery comes from the sharing of music within small communities and social groups, and Freq works to provide that small community structure on a platform-wide scale. Music communities are among the most vibrant groups across the world, and we provide a community-focused structure on our platform. 
<hr />

<h2 id="features">
How Freq works
</h2>

Right now, there are three things you can do on Freq.  

<div class="list">
1. You can post about what you’re currently listening to, and people can like that post or comment on it.
<br />
<br />
2. You can create and read collections of albums, organized by some guiding theme. For example, you can make a public collection of all of the metal bands that have come from your hometown, or you can make a private collection of albums you want to listen to.
<br />
<br />
3. You can follow other users and you can follow collections to get updates about them.
</div>

<hr />

<h2 id="guidelines">
Community guidelines

</h2>


<Guidelines></Guidelines>

<hr />

<h2 id="goals">
Our intentions
</h2>

There are two primary goals for Freq. The first is to invigorate grassroots music culture. The second, per the imperatives of the Initiative for Digital Public Infrastructure, where this is being developed, is to model small social media built for the civic good.

Freq offers the chance to find music you love through a community of people you enjoy.. We want passionate listeners to be able to archive their collections and share them with a larger community, which promotes organic music discovery. 

One reason this moment in the Internet is so strange is because there are not any communities that exist online for the sake of music enjoyment alone, whereas the history of the Internet can easily be told as a history of the ways people gathered around music virtually. So we believe that finding music on the Internet should be separated from buying, selling, or collecting residuals off of that music. 

And while it’s wonderful that there are many social spaces online that cater to a community of their users, we believe that social media has a rich, unmet potential to cater to already existing communities offline. The nice thing about music is there are music communities all over the place, and Freq hopes to provide a toolset that’s relevant to their needs and, hopefully in some ways, their thriving.

<hr />
<h2 id="team">
Our team
</h2>

Freq is being developed as an open source project at the [Initiative for Digital Public Infrastructure](https://publicinfrastructure.org) at UMass Amherst. Michael Sugarman designed the site based on ongoing ethographic and historical research and is developing the software. Lucas Ruud wrote this documentation. [Bocoup](https://bocoup.com) provided visual design for the site. The development has been guided by ethnographic research such as historical interviews and user testing with the student DJs from the UMass Amherst student-run radio station, WMUA. Gil Cuevas and Noah Pring have worked as research assistants on this project.

<hr />
<h2 id="roadmap">
Roadmap
</h2>

The following features are intended for this software. Some will come after the release of the 1.0. These are listed in rough order of priority:

- Improved metadata mapping for Now Playing posts, including richer interaction with radio show archives and DJ mixes
- A spotlight page for high quality Collections
- Search
- Granular filtering for the Feed and Collections
- [GOBO](https://gobo.social/) compatibility
- Groups and relevant moderation tools
- Local scene pages that will display flyers for upcoming events
- Various fun [ListenBrainz](https://listenbrainz.org/) integrations

Since the point of this software is music community, we will be working in the coming months to conduct experiments with offline music communuities, such as college and community radio stations. The goal of these experiments is to co-design features that are relevant them and the communities they serve.

Should Freq prove relevant to enough users, and should the project continue past the summer of 2025, we will be implementing a responsible, transparent revenue model intended to pay fairly for the labor it takes to build and operate this website and improve the user experience.

<hr />
<h2 id="bugs">
Known Bugs
</h2>

- Layout/design weirdness
    - Elements in profile headers are misaligned
- For a few reasons, cover art doesn’t always load
- It is not always possible to change the order items in a collection
- There are probably typos. Please report those.

Notice other bugs? [Fill out this easy Google Form.](https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform?usp=sf_link)

<hr />

<h2 id="data">
Our Data
</h2>

Freq is powered by [MusicBrainz](https://musicbrainz.org/), an open source music encyclopedia. This database is the most comprehensive open source music library, containing music data that may not be present on major streaming services. 

We use their [MusicBrainz Identifiers](https://musicbrainz.org/doc/MusicBrainz_Identifier) (MBIDs) to populate our platform with music data. Every song, artist, album, or other piece of music data has a unique identifier that acts as a bookmark in MusicBrainz’s encyclopedia. 

While extensive, there may be music that isn’t currently tagged in MusicBrainz’s database. Please follow [this guide](https://musicbrainz.org/doc/How_to_Add_a_Release) to upload new music data to MusicBrainz. 

Our cover art is obtained from the [Cover Art Archive](https://coverartarchive.org/), a collaboration between the Internet Archive and MusicBrainz, as well as Last.fm. 

Please consider donating some [time](https://musicbrainz.org/doc/How_to_Contribute) or [money](https://metabrainz.org/donate) to MusicBrainz and checking out [ListenBrainz](https://listenbrainz.org/?redirect=false), a public listen history and music recommendation platform.

<hr />

<h2 id="consent">
Data Consent
</h2>

<Consent></Consent>

<style>
    .list {
        margin-left: var(--freq-width-spacer);
        margin-right: var(--freq-width-spacer);
    }
    br {
        height: var(--freq-line-height-dense);
    }
</style>
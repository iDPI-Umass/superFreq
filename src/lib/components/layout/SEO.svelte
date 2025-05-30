<script lang="ts">
    let { 
		title = 'Welcome to Freq!', 
		description = 'A place to find music with friends.'
	}: {
		title?: string
		description?: string
	} = $props()
    const logoUrl = "/images/logo/freq-logo-dark.png"
    const logoSocialCard = "/images/logo/freq-logo-dark-social-card.png"

</script>

<svelte:head>
	<meta property="title" content="{title} | Freq">
	<meta property="image" content={logoSocialCard}>
	<meta property="description" content={description}>


	<meta property="og_site_name" content=“freq.social”>
	<meta property="og:url" content="https://freq.social">
	<meta property="og:type" content="website">
	<meta property="og:title" content="{title} | Freq">
	<meta property="og:image" content={logoSocialCard}>
    <meta property="og:description" content={description}>
  
	<meta name="twitter:card" content={logoSocialCard}>
	<meta property="twitter:domain" content="freq.social">
	<meta property="twitter:url" content="https://freq.social">
	<meta name="twitter:title" content="{title} | Freq">
    <meta name="twitter:description" content={description}>
	<meta name="twitter:image" content={logoSocialCard}>

    <title>
        {title} | Freq
    </title>
</svelte:head>
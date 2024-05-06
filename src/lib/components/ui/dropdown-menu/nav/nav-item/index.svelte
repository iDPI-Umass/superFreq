<script>
    export let url;
    export let text;
</script>

<li>
    <a href={url}>
        {text}
    </a>
</li>

<style>
	li {
		padding: 5px 0;
		text-decoration: underline;
	}
	a {
		color: white;
	}	
	a:hover, :focus{
		color: var(--freq-purple);
	}
</style>
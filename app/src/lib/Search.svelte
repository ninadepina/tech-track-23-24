<script>
    import { onMount } from 'svelte';
    import { autocomplete, fetchData } from './autocomplete.js';

    let input;
    let suggestions = [];

    onMount(async () => {
        suggestions = await fetchData();
        autocomplete(input, suggestions);
    });
</script>

<div>
    <input
        type="search"
        name="search"
        id="search"
        autocomplete="off"
        placeholder="Search for destinations.."
        bind:this={input}
    />
</div>

<style>
    div {
        position: relative;
    }

    input[type='search'] {
        width: 290px;
        height: 2em;
        margin-left: var(--standard-margin);
        font-family: var(--font-family);
        text-indent: 1.2em;
        border: none;
        border-radius: var(--border-radius);
    }

    input[type='search']:not(:placeholder-shown) {
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }
</style>

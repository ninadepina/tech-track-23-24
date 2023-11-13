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
        class="border-radius"
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
        width: var(--searchbar-width);
        height: 2em;
        margin-left: var(--standard-margin);
        font-family: var(--font-family);
        text-indent: 0.8em;
        border: none;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }
    input[type='search']:not(:placeholder-shown) {
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }
    input[type='search'].border-radius {
        border-radius: var(--border-radius);
    }
</style>

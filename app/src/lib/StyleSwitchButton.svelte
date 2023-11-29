<script>
    let mapStyles = [
        { id: 'streets-v12', value: 'streets' },
        { id: 'satellite-streets-v12', value: 'satellite' },
        { id: 'light-v11', value: 'light' },
        { id: 'dark-v11', value: 'dark' }
    ];

    let selectedStyle = 'streets';
</script>

<div id="menu" class="switch">
    {#each mapStyles as { id, value }}
        <input
            type="radio"
            {id}
            name="rtoggle"
            bind:group={selectedStyle}
            {value}
        />
        <label for={id}>{value}</label>
    {/each}
</div>

<style>
    .switch {
        position: relative;
        display: flex;
        padding-right: 1px;
        overflow: hidden;
        z-index: 1;
    }

    .switch input {
        position: absolute !important;
        clip: rect(0, 0, 0, 0);
        width: 1px;
        height: 1px;
        border: 0;
        overflow: hidden;
    }

    .switch label {
        margin-right: -1px;
        padding: 0.5em 1em;
        font-size: 14px;
        line-height: 1;
        text-align: center;
        text-transform: capitalize;
        color: rgba(0, 0, 0, 0.6);
        background-color: var(--color-light);
        border: 1px solid var(--color-dark);
        transition: all 0.1s ease-in-out;
        cursor: pointer;
    }
    .switch label:first-of-type {
        border-radius: var(--border-radius) 0 0 var(--border-radius);
    }
    .switch label:last-of-type {
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
    }

    .switch input:checked + label {
        color: var(--color-light);
        background-color: var(--color-dark);
        box-shadow: none;
    }
</style>

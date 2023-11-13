<script>
    export let labelsLayer = [];
    export let toggleLayer;
    let activeLayer = labelsLayer[0];

    const handleSwitch = (e) => {
        const newLayer = e.target.value;
        toggleLayer(activeLayer, newLayer);
        activeLayer = newLayer;
    };
</script>

<div class="switch">
    {#each labelsLayer as label (label)}
        <input
            type="radio"
            id={`radio-${label}`}
            name="switch"
            value={label}
            checked={activeLayer === label}
            on:change={handleSwitch}
        />
        <label for={`radio-${label}`}>{label}</label>
    {/each}
</div>

<style>
    .switch {
        position: relative;
        display: flex;
        margin-left: var(--standard-margin);
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
        font-weight: var(--font-weight-text);
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

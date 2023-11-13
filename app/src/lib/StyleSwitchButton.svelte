<script>
</script>

<div id="menu" class="switch">
    <input id="streets-v12" type="radio" name="rtoggle" value="streets" checked="checked" />
    <label for="streets-v12">streets</label>

    <input id="satellite-streets-v12" type="radio" name="rtoggle" value="satellite" />
    <label for="satellite-streets-v12">satellite</label>

    <input id="light-v11" type="radio" name="rtoggle" value="light" />
    <label for="light-v11">light</label>

    <input id="dark-v11" type="radio" name="rtoggle" value="dark" />
    <label for="dark-v11">dark</label>
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

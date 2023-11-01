<script>
    export let label1 = 'Label 1';
    export let label2 = 'Label 2';
</script>

<div class="switch">
    <input type="radio" id="radio-one" name="switch" value="{label1}" checked />
    <label for="radio-one">{label1}</label>

    <input type="radio" id="radio-two" name="switch" value="{label2}" />
    <label for="radio-two">{label2}</label>
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
        color: rgba(0, 0, 0, 0.6);
        background-color: var(--color-light);
        border: 1px solid var(--color-dark);
        text-align: center;
        transition: all 0.1s ease-in-out;
    }
    .switch label:first-of-type {
        border-radius: var(--border-radius) 0 0 var(--border-radius);
    }
    .switch label:last-of-type {
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
    }

    .switch label:hover {
        cursor: pointer;
    }

    .switch input:checked + label {
        color: var(--color-light);
        background-color: var(--color-dark);
        box-shadow: none;
    }
</style>

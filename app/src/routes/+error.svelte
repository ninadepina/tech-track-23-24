<svelte:head>
    <title>Schiphol: 404 Error</title>
</svelte:head>

<div class="error">
    <h1>Error page</h1>
    <div>
        <span>4</span>
        <img src="3d-globe.jpg" alt="" />
        <span>4</span>
    </div>
</div>

<style>
    .error {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        height: 100vh;
        background-color: #a9fafe;
    }

    .error > div {
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    /* h1 only for semantic value and screenreaders */
    h1 {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
    }

    span {
        margin-top: 0.025em;
        font-size: 16rem;
        font-weight: var(--font-weight-title);
        color: #3db640;
        z-index: 2;
    }
    span:first-of-type {
        margin-right: -0.4em;
    }
    span:last-of-type {
        margin-left: -0.4em;
    }

    img {
        width: 30%;
    }
</style>

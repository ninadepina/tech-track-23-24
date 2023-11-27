const observe = (faders) => {
    const appearOptions = {
        rootMargin: '0px 0px -105px 0px'
    };

    const appearOnScroll = new IntersectionObserver(
        (entries, appearOnScroll) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('appear');
                    appearOnScroll.unobserve(entry.target);
                }
            });
        },
        appearOptions
    );

    faders.forEach((fader) => {
        appearOnScroll.observe(fader);
    });
};

export { observe };

// intersection observer
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

// change opacity chevron on scroll
const changeOpacityChevron = (chevronDown) => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    switch (true) {
        case scrollPosition >= 50 && scrollPosition <= 150:
            const opacity = 1 - (scrollPosition - 50) / 100;
            chevronDown.style.opacity = opacity;
            break;
        case scrollPosition > 150:
            chevronDown.style.opacity = 0;
            break;
        default:
            chevronDown.style.opacity = 1;
            break;
    }
};

export { observe, changeOpacityChevron };

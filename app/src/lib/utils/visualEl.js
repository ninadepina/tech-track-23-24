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

// move scale control (l to r)
const moveScaleControl = () => {
    const scaleControl = document.querySelector('.mapboxgl-ctrl.mapboxgl-ctrl-scale');

    document.querySelector('.mapboxgl-ctrl-bottom-left').removeChild(scaleControl);
    document.querySelector('.mapboxgl-ctrl-bottom-right').appendChild(scaleControl);
};

// line path animation on scroll
const linePathAnimation = () => {
    const introContainer = document.querySelector('#intro');
    const button = document.querySelector('section.seven button');

    sessionStorage.getItem('seenIntro') === 'true'
        ? introContainer.classList.remove('show')
        : introContainer.classList.add('show');

    button.addEventListener('click', () => {
        sessionStorage.setItem("seenIntro", "true");
        introContainer.classList.remove('show');
    });

    const path = document.querySelector('path');
    let pathLength = path.getTotalLength();

    path.style.strokeDasharray = pathLength + ' ' + pathLength;
    path.style.strokeDashoffset = pathLength;

    window.addEventListener('scroll', () => {
        const chevronDown = document.querySelector('.chevron');
        changeOpacityChevron(chevronDown);

        const scrollPercentage = 
            (document.documentElement.scrollTop + document.body.scrollTop) /
            (document.documentElement.scrollHeight - document.documentElement.clientHeight);

        const drawLength = pathLength * scrollPercentage;

        path.style.strokeDashoffset = pathLength - drawLength;
    });
};

export { observe, moveScaleControl, linePathAnimation };

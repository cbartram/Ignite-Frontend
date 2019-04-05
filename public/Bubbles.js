$(function() {
    /**
     * Logo Bubbles shown on the App.js page
     * @param config Configuration object for the LogoBubbles including things
     * like x,y position, noise, the container element among others.
     * @constructor
     */
    function LogoBubbles(config) {
        // Initialize the logoBubbles object
        let logoBubbles = {
            ...config,
            noiseT: 0,
            scrollX: 0,
            vertShrink: 0,
            playing: false,
            logosLoaded: false,
            firstTick: null,
            lastTick: 0,
            container: document.querySelector(config.containerSelector),
            tick, // Function called tick()
        };


        /**
         * Calls the first tick and initializes the animation.
         */
        function initialize() {
            let e = logoBubbles.container.getBoundingClientRect();
            if((e.bottom < 0 || e.top > window.innerHeight) && logoBubbles.playing) {
                logoBubbles.playing = false;
            } else if(e.bottom > 0 && e.top < window.innerHeight && !logoBubbles.playing) {
                logoBubbles.playing = true;
                requestAnimationFrame(function(e) {
                    loadImages();
                    logoBubbles.tick(e)
                });
            }
        }

        /**
         * Main tick loop which updates the x/y style of each of the bubbles
         * letting them move across the page.
         * @param bubble Object bubble object
         */
        function updatePosition(bubble) {
            let n = bubble.x + bubble.noiseX + logoBubbles.scrollX;
            let yTranslate = translateY((bubble.y + bubble.noiseY), logoBubbles.containerHeight, logoBubbles.vertShrink * logoBubbles.maxShrink);
            n < -200 && (bubble.x += logoBubbles.containerWidth);
            let scale = ((bubble.introProgress / 20) + .95) * bubble.scale;
            bubble.el.style.opacity = bubble.introProgress;
            bubble.el.style.transform = `translate(${n}px, ${yTranslate}px) scale(${scale})`;
        }

        /**
         * Computes how the bubbles show translate in the y position.
         * This function determines where the bubbles are placed within the container.
         * @param noise
         * @param containerHeight Integer the height of the container element
         * @param shrink Integer the shrink (which affects the logo bubbles scale)
         * @returns {number}
         */
        function translateY(noise, containerHeight, shrink) {
            return noise * (1 - shrink) + (containerHeight / 2) * shrink
        }

        /**
         * Loads the sprite sheet into a Javascript Image object and makes use
         * of the onload callback function to determine when the image is ready to be processed.
         * @param url String url of the image.
         */
        function loadImages(url = 'https://stripe.com/img/v3/customers/logos/header-logos@2x.png') {
            const image = new Image;
            image.src = url;
            image.onload = () => logoBubbles.logosLoaded = true;
        }

        /**
         * Computes the next tick for re-drawing the Bubbles in their next frame.
         * @param time Integer tick event time
         */
        function tick(time) {
            // Ensures the bubbles fade in at "random" times
            logoBubbles.firstTick || (logoBubbles.firstTick = time);
            time -= logoBubbles.firstTick;
            let timeDelta = time - logoBubbles.lastTick;

            logoBubbles.lastTick = time;
            logoBubbles.noiseT += timeDelta * logoBubbles.noiseSpeed;
            logoBubbles.scrollX -= timeDelta * logoBubbles.scrollSpeed;

            // Main loop which updates
            logoBubbles.bubbles.map(bubble => {
                if(logoBubbles.logosLoaded && bubble.introProgress < 1 && time > bubble.introDelay)
                    bubble.introProgress = Math.min(1, bubble.introProgress + timeDelta / logoBubbles.introDuration);
                updatePosition(bubble);
            });

            logoBubbles.playing && requestAnimationFrame(logoBubbles.tick)
        }

        // Set the container element
        logoBubbles.logos = logoBubbles.logos.map((title, index) => ({ index, title }));

        // Initialize the first frame of the animation
        initialize();

        // Sets up each of the DOM nodes for the bubbles
        logoBubbles.bubbles.map((bubble, index) => {
            bubble.scale = bubble.s || 1; // Default the scale to 1 if its not set
            bubble.seedX = 10000 * Math.random();
            bubble.seedY = 10000 * Math.random();
            bubble.noiseX = bubble.noiseY = 0;
            bubble.introDelay = Math.random() * logoBubbles.introDelay;
            bubble.introProgress = 0;
            bubble.el = document.createElement("div");
            bubble.el.className = logoBubbles.classPrefix + logoBubbles.logos[index].title;
            bubble.tagEl = document.createElement("span");
            bubble.tagEl.innerHTML = logoBubbles.logos[index].title;
            bubble.el.appendChild(bubble.tagEl);
            logoBubbles.container.appendChild(bubble.el);
            updatePosition(bubble);
        });
    }
    let bubbles = [{
        s: .6,
        x: 1134,
        y: 45
    }, {
        s: .6,
        x: 1620,
        y: 271
    }, {
        s: .6,
        x: 1761,
        y: 372
    }, {
        s: .6,
        x: 2499,
        y: 79
    }, {
        s: .6,
        x: 2704,
        y: 334
    }, {
        s: .6,
        x: 2271,
        y: 356
    }, {
        s: .6,
        x: 795,
        y: 226
    }, {
        s: .6,
        x: 276,
        y: 256
    }, {
        s: .6,
        x: 1210,
        y: 365
    }, {
        s: .6,
        x: 444,
        y: 193
    }, {
        s: .6,
        x: 2545,
        y: 387
    }, {
        s: .8,
        x: 1303,
        y: 193
    }, {
        s: .8,
        x: 907,
        y: 88
    }, {
        s: .8,
        x: 633,
        y: 320
    }, {
        s: .8,
        x: 323,
        y: 60
    }, {
        s: .8,
        x: 129,
        y: 357
    }, {
        s: .8,
        x: 1440,
        y: 342
    }, {
        s: .8,
        x: 1929,
        y: 293
    }, {
        s: .8,
        x: 2135,
        y: 198
    }, {
        s: .8,
        x: 2276,
        y: 82
    }, {
        s: .8,
        x: 2654,
        y: 182
    }, {
        s: .8,
        x: 2783,
        y: 60
    }, {
        x: 1519,
        y: 118
    }, {
        x: 1071,
        y: 233
    }, {
        x: 1773,
        y: 148
    }, {
        x: 2098,
        y: 385
    }, {
        x: 2423,
        y: 244
    }, {
        x: 901,
        y: 385
    }, {
        x: 624,
        y: 111
    }, {
        x: 75,
        y: 103
    }, {
        x: 413,
        y: 367
    }, {
        x: 2895,
        y: 271
    }, {
        x: 1990,
        y: 75
    }];

    // These are placed in the <span /> node and
    let logos = ["Affirm", "Amazon", "Asana", "BOOK A TIGER",
        "Blue Apron", "Catawiki", "Deliveroo", "Doordash",
        "Dribbble", "Facebook", "Fancy", "Fitbit", "Indiegogo",
        "Instacart", "Kickstarter", "Lyft", "OpenTable", "Panic",
        "Pinterest", "Postmates", "Rackspace", "Reddit", "SAP", "Salesforce",
        "Shopify", "Slack", "Spring", "Squarespace", "Target",
        "TaskRabbit", "Ted", "Teespring", "The Guardian",
        "TicketSwap", "WeTransfer", "Wish", "Wolfram Alpha",
        "Xero", "Yelp"];


    if(document.querySelector('.icon-container') !== null) {
        window.logoBubbles = new LogoBubbles({
            bubbles,
            logos,
            classPrefix: "Icon Icon-img",
            containerSelector: ".icon-container",
            containerWidth: 3e3,
            containerHeight: 460,
            maxShrink: .2,
            noiseSpeed: 55e-6,
            noiseScale: 80,
            scrollSpeed: .0175,
            introDelay: 1500,
            introDuration: 1500
        });
    }
});

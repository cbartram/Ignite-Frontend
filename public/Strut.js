/**
 * Strut helper functions which are like JQuery
 * @type {{rangePosition: (function(*, *, *): number), random: (function(*, *): *), debounce: (function(*=, *=): Function), throttle: (function(*, *=, *=): Function), queryArray: (function(*=, *=)), ready: Window.Strut.ready, interpolate: (function(*, *, *): number), arrayRandom: (function(*): *), clamp: (function(*=, *=, *=): number)}}
 */
window.Strut = {
    random: function(t, e) {
        return Math.random() * (e - t) + t
    },
    arrayRandom: function(t) {
        return t[Math.floor(Math.random() * t.length)]
    },
    interpolate: function(t, e, n) {
        return t * (1 - n) + e * n
    },
    rangePosition: function(t, e, n) {
        return (n - t) / (e - t)
    },
    clamp: function(t, e, n) {
        return Math.max(Math.min(t, n), e)
    },
    queryArray: function(t, e) {
        return e || (e = document.body), Array.prototype.slice.call(e.querySelectorAll(t))
    },
    ready: function(t) {
        "loading" !== document.readyState ? t() : document.addEventListener("DOMContentLoaded", t)
    },
    debounce: function(t, e) {
        let n;
        return function() {
            clearTimeout(n);
            n = setTimeout(function() {
                return t.apply(this, arguments)
            }, e)
        }
    },
    isMobileViewport: false,
    isRetina: true,
    throttle: function(t, e, n) {
        let i = n || this,
            o = null,
            a = null,
            r = function() {
                t.apply(i, a), o = null
            };
        return function() {
            o || (a = arguments, o = setTimeout(r, e))
        }
    }
};

Strut.isRetina = window.devicePixelRatio > 1.3;
Strut.mobileViewportWidth = 670;
Strut.isMobileViewport = window.innerWidth < Strut.mobileViewportWidth;
window.addEventListener("resize", function() {
    Strut.isMobileViewport = window.innerWidth < Strut.mobileViewportWidth
});

Strut.load = {
    images: function(t, e) {
        "string" == typeof t && (t = [t]);
        let n = -t.length;
        t.forEach(function(t) {
            let i = new Image;
            i.src = t;
            i.onload = function() {
                0 === ++n && e && e()
            }
        })
    }
};
Strut.supports = {
    es6: !!window.Symbol && !!window.Symbol.species,
    pointerEvents: function() {
        let t = document.createElement("a").style;
        return t.cssText = "pointer-events:auto",
        "auto" === t.pointerEvents
    }(),
    positionSticky: Boolean(window.CSS && CSS.supports("(position: -webkit-sticky) or (position: sticky)")),
    masks: !/MSIE|Trident|Edge/i.test(navigator.userAgent)
};

/**
 * Logo Bubbles shown on the App.js page
 * @param e Config object
 * @constructor
 */
function LogoBubbles(e) {
    function n() {
        c.vertShrink = s(1e3, 800, window.innerHeight), c.vertShrink = l(c.vertShrink, 0, 1)
    }

    function t() {
        let e = c.container.getBoundingClientRect();
        (e.bottom < 0 || e.top > window.innerHeight) && 1 === c.playing ? c.playing = !1 : e.bottom > 0 && e.top < window.innerHeight && 0 == c.playing && (c.playing = !0, requestAnimationFrame(function(e) {
            c.tick(e)
        }))
    }

    function o(e) {
        let n = e.x + e.noiseX + c.scrollX,
            t = e.y + e.noiseY;
        t = a(t, c.containerHeight / 2, c.vertShrink * c.maxShrink); n < -200 && (e.x += c.containerWidth);
        let o = r(e.introProgress) / 20 + .95;
        o *= e.scale;
        e.el.style.opacity = r(e.introProgress);
        let yTransform = a(t, c.containerHeight / 2, c.vertShrink * c.maxShrink);
        e.el.style.transform = `translate(${n}px, ${t}px) scale(${o})`;
    }

    function i(e) {
        let n = 0,
            t = 0,
            o = null;
        for (n = e.length - 1; n > 0; n -= 1) t = Math.floor(Math.random() * (n + 1)), o = e[n], e[n] = e[t], e[t] = o
    }

    function r(e) {
        return e < .5 ? 2 * e * e : (4 - 2 * e) * e - 1
    }

    function a(e, n, t) {
        return e * (1 - t) + n * t
    }

    function s(e, n, t) {
        return (t - e) / (n - e)
    }

    function l(e, n, t) {
        return Math.max(Math.min(e, t), n)
    }
    let c = this;
    for (let u in e) c[u] = e[u];
    c.container = document.querySelector(c.containerSelector), c.noiseT = 0, c.scrollX = 0, c.logos.forEach(function(e, n) {
        c.logos[n] = {
            index: n,
            title: e
        }
    }),
        i(c.logos),
        c.vertShrink = 0,
        n(),
        window.addEventListener("resize", n),
        c.playing = !1,
        t(),
        window.addEventListener("scroll", t),
        c.logosLoaded = !1;
    let d = "https://stripe.com/img/v3/customers/logos/header-logos" + (Strut.isRetina ? "@2x.png?2" : ".png?2");
    Strut.load.images(d, function() {
        c.logosLoaded = !0
    });
    for (let u = 0; u < c.bubbles.length; u++) {
        let f = c.bubbles[u],
            y = u % c.logos.length;
        f.scale = f.s || 1,
            f.seedX = 1e4 * Math.random(),
            f.seedY = 1e4 * Math.random(),
            f.noiseX = f.noiseY = 0,
            f.introDelay = Math.random() * c.introDelay,
            f.introProgress = 0,
            f.el = document.createElement("div"),
            f.el.className = c.classPrefix + c.logos[y].title,
            f.tagEl = document.createElement("span"),
            f.tagEl.innerHTML = c.logos[y].title,
            f.el.appendChild(f.tagEl), o(f),
            c.container.appendChild(f.el)
    }
    c.firstTick = null, c.lastTick = 0, c.tick = function(e) {
        c.firstTick || (c.firstTick = e),
            e -= c.firstTick;
        let n = e - c.lastTick;
        c.lastTick = e, c.noiseT += n * c.noiseSpeed, c.scrollX -= n * c.scrollSpeed;
        for (let t = 0; t < c.bubbles.length; t++) {
            let i = c.bubbles[t];
            i.noiseX = noise(i.seedX + c.noiseT) * c.noiseScale - c.noiseScale / 2,
            i.noiseY = noise(i.seedY + c.noiseT) * c.noiseScale - c.noiseScale / 2,
            c.logosLoaded && i.introProgress < 1 && e > i.introDelay && (i.introProgress = Math.min(1, i.introProgress + n / c.introDuration)),
            o(i)
        }
        c.playing && requestAnimationFrame(c.tick)
    }
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
    }],
    logos = ["Affirm", "Amazon", "Asana", "BOOK A TIGER", "Blue Apron", "Catawiki", "Deliveroo", "Doordash", "Dribbble", "Facebook", "Fancy", "Fitbit", "Indiegogo", "Instacart", "Kickstarter", "Lyft", "OpenTable", "Panic", "Pinterest", "Postmates", "Rackspace", "Reddit", "SAP", "Salesforce", "Shopify", "Slack", "Spring", "Squarespace", "Target", "TaskRabbit", "Ted", "Teespring", "The Guardian", "TicketSwap", "WeTransfer", "Wish", "Wolfram Alpha", "Xero", "Yelp"];

/**
 * Additional functions
 */
let perlin,
    PERLIN_SIZE = 4095,
    perlin_octaves = 4,
    perlin_amp_falloff = .5,
    a = 0;
    scaled_cosine = function(e) {
        return .5 * (1 - Math.cos(e * Math.PI))
    };
    noise = function(e) {
        if (null == perlin) {
            perlin = new Array(PERLIN_SIZE + 1);
            for (let n = 0; n < PERLIN_SIZE + 1; n++) perlin[n] = Math.random()
        }
        e < 0 && (e = -e);
        for (let t, o, i = Math.floor(e), r = e - i, a = 0, s = .5, l = 0; l < perlin_octaves; l++) t = scaled_cosine(r), o = perlin[i & PERLIN_SIZE], o += t * (perlin[i + 1 & PERLIN_SIZE] - o), a += o * s, s *= perlin_amp_falloff, i <<= 1, (r *= 2) >= 1 && (i++, r--);
        return a
    };


Strut.ready(()=> {
   console.log('Ready');
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
    })
});

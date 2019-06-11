function LogoBubbles(s) {

    /**
     * Loads the sprite sheet into a Javascript Image object and makes use
     * of the onload callback function to determine when the image is ready to be processed.
     * @param url String url of the image.
     */
    function loadImages(url = 'https://stripe.com/img/v3/customers/logos/header-logos@2x.png') {
        const image = new Image;
        image.src = url;
        image.onload = () =>  e.logosLoaded = true;
    }

    var e = this;
    for (a in s)
        e[a] = s[a];
    e.container = document.querySelector(e.containerSelector),
        e.noiseT = 0,
        e.scrollX = 0,
        function(s) {
            var e = 0
                , n = 0
                , a = null;
            for (e = s.length - 1; e > 0; e -= 1)
                n = Math.floor(Math.random() * (e + 1)),
                    a = s[e],
                    s[e] = s[n],
                    s[n] = a
        }(e.logos),
        e.vertShrink = 0,
        i(),
        window.addEventListener("resize", i),
        e.playing = !1,
        r(),
        window.addEventListener("scroll", r),
        e.logosLoaded = !1;
    loadImages();
    for (var a = 0; a < e.bubbles.length; a++) {
        var o = e.bubbles[a]
            , t = a % e.logos.length;
        o.scale = o.s || 1,
            o.seedX = 1e4 * Math.random(),
            o.seedY = 1e4 * Math.random(),
            o.noiseX = o.noiseY = 0,
            o.introDelay = Math.random() * e.introDelay,
            o.introProgress = 0,
            o.el = document.createElement("div"),
            o.el.className = e.classPrefix + e.logos[t].cssClass,
            o.tagEl = document.createElement("span"),
            o.tagEl.innerHTML = e.logos[t].name,
            o.el.appendChild(o.tagEl),
            l(o),
            e.container.appendChild(o.el)
    }
    function i() {
        var s, n, a, o, t;
        e.vertShrink = (s = 1e3,
            n = 800,
        (window.innerHeight - s) / (n - s)),
            e.vertShrink = (a = e.vertShrink,
                o = 0,
                t = 1,
                Math.max(Math.min(a, t), o))
    }
    function r() {
        var s = e.container.getBoundingClientRect();
        (s.bottom < 0 || s.top > window.innerHeight) && 1 == e.playing ? e.playing = !1 : s.bottom > 0 && s.top < window.innerHeight && 0 == e.playing && (e.playing = !0,
            requestAnimationFrame(function(s) {
                e.tick(s)
            }))
    }
    function l(s) {
        var n = s.x + s.noiseX + e.scrollX
            , a = s.y + s.noiseY;
        a = function(s, e, n) {
            return s * (1 - n) + e * n
        }(a, e.containerHeight / 2, e.vertShrink * e.maxShrink),
        n < -200 && (s.x += e.containerWidth);
        var o = c(s.introProgress) / 20 + .95;
        o *= s.scale,
            s.el.style.opacity = c(s.introProgress),
            s.el.style.transform = "translate(" + n + "px, " + a + "px) scale(" + o + ")"
    }
    function c(s) {
        return s < .5 ? 2 * s * s : (4 - 2 * s) * s - 1
    }
    e.firstTick = null,
        e.lastTick = 0,
        e.tick = function(s) {
            e.firstTick || (e.firstTick = s);
            var n = (s -= e.firstTick) - e.lastTick;
            e.lastTick = s,
                e.noiseT += n * e.noiseSpeed,
                e.scrollX -= n * e.scrollSpeed;
            for (var a = 0; a < e.bubbles.length; a++) {
                var o = e.bubbles[a];
                o.noiseX = noise(o.seedX + e.noiseT) * e.noiseScale - e.noiseScale / 2,
                    o.noiseY = noise(o.seedY + e.noiseT) * e.noiseScale - e.noiseScale / 2,
                e.logosLoaded && o.introProgress < 1 && s > o.introDelay && (o.introProgress = Math.min(1, o.introProgress + n / e.introDuration)),
                    l(o)
            }
            e.playing && requestAnimationFrame(e.tick)
        }
}
var bubbles = [{
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
    s: .8,
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
}]
    , logos = [{
    name: "Affirm",
    cssClass: "Affirm"
}, {
    name: "Allianz",
    cssClass: "Allianz"
}, {
    name: "Amazon",
    cssClass: "Amazon"
}, {
    name: "Blue Apron",
    cssClass: "BlueApron"
}, {
    name: "Booking.com",
    cssClass: "BookingCom"
}, {
    name: "Catawiki",
    cssClass: "Catawiki"
}, {
    name: "City of Boston",
    cssClass: "CityofBoston"
}, {
    name: "Deliveroo",
    cssClass: "Deliveroo"
}, {
    name: "DiDi",
    cssClass: "DiDi"
}, {
    name: "Doordash",
    cssClass: "Doordash"
}, {
    name: "Expedia",
    cssClass: "Expedia"
}, {
    name: "Fender Guitars",
    cssClass: "Fender"
}, {
    name: "Fitbit",
    cssClass: "Fitbit"
}, {
    name: "Google",
    cssClass: "Google"
}, {
    name: "Indiegogo",
    cssClass: "Indiegogo"
}, {
    name: "Instacart",
    cssClass: "Instacart"
}, {
    name: "Kickstarter",
    cssClass: "Kickstarter"
}, {
    name: "Lyft",
    cssClass: "Lyft"
}, {
    name: "Nasdaq",
    cssClass: "Nasdaq"
}, {
    name: "Nat Geo",
    cssClass: "Nat-Geo"
}, {
    name: "OpenTable",
    cssClass: "OpenTable"
}, {
    name: "Panic",
    cssClass: "Panic"
}, {
    name: "Postmates",
    cssClass: "Postmates"
}, {
    name: "Rackspace",
    cssClass: "Rackspace"
}, {
    name: "Reddit",
    cssClass: "Reddit"
}, {
    name: "Salesforce",
    cssClass: "Salesforce"
}, {
    name: "Shopify",
    cssClass: "Shopify"
}, {
    name: "Slack",
    cssClass: "Slack"
}, {
    name: "Spotify",
    cssClass: "Spotify"
}, {
    name: "Squarespace",
    cssClass: "Squarespace"
}, {
    name: "Target",
    cssClass: "Target"
}, {
    name: "TaskRabbit",
    cssClass: "TaskRabbit"
}, {
    name: "Ted",
    cssClass: "Ted"
}, {
    name: "The Guardian",
    cssClass: "TheGuardian"
}, {
    name: "TicketSwap",
    cssClass: "TicketSwap"
}, {
    name: "Twitch",
    cssClass: "Twitch"
}, {
    name: "Uber",
    cssClass: "Uber"
}, {
    name: "WeTransfer",
    cssClass: "WeTransfer"
}, {
    name: "Wish",
    cssClass: "Wish"
}, {
    name: "Xero",
    cssClass: "Xero"
}, {
    name: "Yelp",
    cssClass: "Yelp"
}, {
    name: "Zillow",
    cssClass: "Zillow"
}];
$(function() {
    window.logoBubbles = new LogoBubbles({
        bubbles: bubbles,
        logos: logos,
        classPrefix: "Icon Icon-img",
        containerSelector: ".IconsContainer",
        containerWidth: 3e3,
        containerHeight: 460,
        maxShrink: .2,
        noiseSpeed: 55e-6,
        noiseScale: 80,
        scrollSpeed: .0175,
        introDelay: 1500,
        introDuration: 1500
    });

    // Performs the animations for the shooting programming languages
    const t = (...t)=>e=>t.reduce((t,e)=>e(t), e);
    const n = (t,e)=>Math.floor(Math.random() * (e - t)) + t;
    const e = (t,e,r)=>Object.defineProperty(t, e, {
        value: r,
        writable: !0,
        configurable: !0,
        enumerable: !0
    });
    const o = (t,e)=>{
        const r = n=>{
                n - a >= e && (a = n, t()),
                    requestAnimationFrame(r)
            }
        ;
        let a = performance.now();
        requestAnimationFrame(r)
    };
    const lll = (t,e,r,a)=>-r * ((t = t / a - 1) * Math.pow(t, 3) - 1) + e

    const r = document.getElementById("programming-languages")
        , a = ["clojure", "erlang", "fsharp", "go", "haskell", "javascript", "php", "python", "r", "ruby", "rust", "scala", "scheme", "swift"]
        , s = (t,e,r)=>{
            if (Math.abs(t) > e)
                return n(-r, r);
            const a = Math.sqrt(Math.pow(e, 2) - Math.pow(t, 2));
            return (2 * Math.round(Math.random()) - 1) * n(a, r)
        }
    ;
    o(t(()=>a[n(0, a.length)], t=>{
            const e = document.createElement("img");
            return e.alt = t,
                e.src = `https://stripe.com/img/v3/home/programming-languages/${t}.svg`,
                r.appendChild(e),
                e.setAttribute("aria-hidden", !0),
                e
        }
        , t=>{
            const a = {
                total: 12e3
            }
                , o = {};
            e(o, "translateX", n(-120, 120)),
                e(o, "translateY", s(o.translateX, 60, 120)),
                e(o, "rotate", n(-800, 800));
            const i = n=>{
                    null == a.start && e(a, "start", n),
                        e(a, "elapsed", n - a.start);
                    const s = lll(a.elapsed, 0, 1, a.total);
                    t.style.opacity = Math.abs(1 - s),
                        t.style.transform = Object.keys(o).map(t=>{
                                return `${t}(${o[t] * s}${/rotate/.test(t) ? "deg" : "px"})`
                            }
                        ).join(" "),
                        a.elapsed < a.total ? requestAnimationFrame(i) : r.removeChild(t)
                }
            ;
            requestAnimationFrame(i)
        }
    ), 500)
});
var perlin, PERLIN_ZWRAPB = 8, PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB, PERLIN_SIZE = 4095, perlin_octaves = 4, perlin_amp_falloff = .5, scaled_cosine = function(s) {
    return .5 * (1 - Math.cos(s * Math.PI))
}, noise = function(s) {
    if (null == perlin) {
        perlin = new Array(PERLIN_SIZE + 1);
        for (var e = 0; e < PERLIN_SIZE + 1; e++)
            perlin[e] = Math.random()
    }
    s < 0 && (s = -s);
    for (var n, a, o = Math.floor(s), t = s - o, i = 0, r = .5, l = 0; l < perlin_octaves; l++)
        n = scaled_cosine(t),
            a = perlin[o & PERLIN_SIZE],
            i += (a += n * (perlin[o + 1 & PERLIN_SIZE] - a)) * r,
            r *= perlin_amp_falloff,
            o <<= 1,
        (t *= 2) >= 1 && (o++,
            t--);
    return i
};




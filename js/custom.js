var app = new Vue({
    el: '#app',
    data: {
        txt: [{title: "Input Here", value: "", count: 0},
            {title: "Base64 to Base32", value: "", count: 0}, {title: "Base32 to Base64", value: "", count: 0},
            {title: "Base64 to Base16", value: "", count: 0}, {title: "Base16 to Base64", value: "", count: 0},
            {title: "Base32 to Base16", value: "", count: 0}, {title: "Base16 to Base32", value: "", count: 0}
        ]
    },
    methods: {
        update: function () {
            this.txt[1].value = Base64.toBase32(this.txt[0].value);
            // this.txt[2].value = Base32.toBase64(this.txt[0].value);
            this.txt[3].value = Base64.toBase16(this.txt[0].value);
            // this.txt[4].value = Base16.toBase64(this.txt[0].value);
            // this.txt[5].value = Base32.toBase16(this.txt[0].value);
            // this.txt[6].value = Base16.toBase32(this.txt[0].value);
            CharCounter.updateCounter();
        }
    }
});

var CharCounter = {
    updateCounter: function () {
        app.txt.forEach(function (e) {
            e.count = e.value.length;
        });
    }
};

var Base64 = {
    // 000000 - 111111
    list: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    toBase32: function (b64) {
        var b2 = Base64.toBase2(b64);
        var arr = b2.match(/.{1,5}/g) || [];
        var b32 = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length !== 5) {
                arr[i] += Array(5 - arr[i].length).fill("0").join("");
            }
            b32 += Base32.list[parseInt(arr[i], 2)];
        }
        if (b2.length % 40 !== 0) {
            var lack = 8 - Math.ceil((b2.length % 40) / 5);
            b32 += Array(lack).fill("=").join("");
        }
        return b32;
    },
    toBase16: function (b64) {
        var b2 = Base64.toBase2(b64);
        var arr = b2.match(/.{4}/g) || []; // always length % 4 -> 0
        var b16 = "";
        for (var i = 0; i < arr.length; i++) {
            b16 += Base16.list[parseInt(arr[i], 2)];
        }
        return b16;
    },
    toBase2: function (b64) {
        b64 = Base64.sanitize(b64);
        if (!b64) {
            return "";
        }
        var b2 = "";
        for (var i = 0; i < b64.length; i++) {
            if (b64[i] === "=") {
                b2 = b2.slice(0, -2);
                continue;
            }
            var tmp = Base64.list.indexOf(b64[i]).toString(2);
            b2 += ("00000" + tmp).slice(-6);
        }
        return b2;
    },
    sanitize: function (b64) {
        b64 = b64.replace(/[-]/g, "");
        return b64.match(/^[A-Za-z0-9+\/=]+$/) !== null ? b64 : false;
    }
};

var Base32 = {
    // 00000 - 11111
    list: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",

    toBase64: function (str) {
    },
    toBase16: function (str) {
    },
    toBase2: function (str) {
    }
};

var Base16 = {
    // 0000 - 1111
    list: "0123456789abcdef",

    toBase64: function (r16) {
    },
    toBase32: function (r16) {
    },
    toBase2: function (r16) {
    }
};

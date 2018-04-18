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

/**
 * https://tools.ietf.org/html/rfc4648
 */

var Base64 = {
    // 000000 - 111111
    list: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

    toBase32: function (b64) {
        var b2 = Base64.toBase2(b64);
        var arr = b2.match(/.{1,40}/g) || []; // b2 length always 8 * n.
        var b32 = "";
        var chars = 8;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length !== 40) {
                if (arr[i].length % 5 !== 0) {
                    arr[i] += Array(5 - arr[i].length % 5).fill("0").join("");
                }
                chars = arr[i].length / 5;
            }
            for (var j = 0; j < chars; j++) {
                b32 += Base32.list[parseInt(arr[i].slice(5 * j, 5 * (j + 1)), 2)];
            }
        }
        b32 += Array(8 - chars).fill("=").join("");
        return b32;
    },
    toBase16: function (b64) {
        var b2 = Base64.toBase2(b64);
        var arr = b2.match(/.{8}/g) || []; // b2 length always 8 * n.
        var b16 = "";
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < 2; j++) {
                b16 += Base16.list[parseInt(arr[i].slice(4 * j, 4 * (j + 1)), 2)];
            }
        }
        return b16;
    },
    toBase2: function (b64) {
        b64 = Base64.sanitize(b64);
        var b2 = "";
        for (var i = 0; i < b64.replace(/=/g, "").length; i++) {
            var tmp = Base64.list.indexOf(b64[i]).toString(2);
            b2 += ("00000" + tmp).slice(-6);
        }
        b2 = b2.slice(0, b2.length - b2.length % 8); // fix length to 8 * n.
        return b2;
    },
    sanitize: function (b64) {
        return b64.length % 4 === 0
               && b64.match(/^[A-Za-z0-9+\/]+={0,2}$/) !== null ? b64 : "";
    }
};

var Base32 = {
    // 00000 - 11111
    list: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",

    toBase64: function (b32) {
    },
    toBase16: function (b32) {
    },
    toBase2: function (b32) {
    }
};

var Base16 = {
    // 0000 - 1111
    list: "0123456789abcdef",

    toBase64: function (b16) {
    },
    toBase32: function (b16) {
    },
    toBase2: function (b16) {
    },
    sanitize: function (b16) {
        b16 = b16.replace(/[-:]/g, "").toLowerCase();
        return b16.match(/^[0-9a-f]+$/) !== null ? b16 : "";
    }
};

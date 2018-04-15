var app = new Vue({
    el: '#app',
    data: {
        txt: [{title: "Input Here", value: "", count: 0},
            {title: "URL Encode", value: "", count: 0}, {title: "URL Decode", value: "", count: 0},
            {title: "Base64 Encode", value: "", count: 0}, {title: "Base64 Decode", value: "", count: 0},
            {title: "Base64 to UUID", value: "", count: 0}, {title: "UUID to Base64", value: "", count: 0}]
    },
    methods: {
        update: function () {
            this.txt[1].value = encodeURI(this.txt[0].value);
            this.txt[2].value = decodeURI(this.txt[0].value);
            this.txt[3].value = Base64.encode(this.txt[0].value);
            this.txt[4].value = Base64.decode(this.txt[0].value);
            this.txt[5].value = Uuid.expand(this.txt[0].value);
            this.txt[6].value = Uuid.compress(this.txt[0].value);
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
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
 */
var Base64 = {
    encode: function (str) {
        return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    },
    decode: function (str) {
        try {
            return decodeURIComponent(window.atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            return "";
        }
    }
};

var Uuid = {
    /**
     * https://stackoverflow.com/a/9998010/6642042
     */
    hexlist: '0123456789abcdef',
    b64list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    compress: function (str) {
        var s = str.replace(/-/g, "").toLowerCase();
        if (s.match(/[0-9a-f]{32}/) === null) {
            return "";
        }

        var a, p, q;
        var r = "";
        var i = 0;
        while (i < s.length) {
            a = (Uuid.hexlist.indexOf(s.charAt(i++)) << 8) |
                (Uuid.hexlist.indexOf(s.charAt(i++)) << 4) |
                (Uuid.hexlist.indexOf(s.charAt(i++)));

            p = a >> 6;
            q = a & 63;

            r += Uuid.b64list.charAt(p) + Uuid.b64list.charAt(q);
        }
        r += "==";
        return r;
    },
    expand: function (str) {
        var s = str.replace(/=/g, "");
        if (s.length !== 22) {
            return "";
        }

        return "not yet implemented";
    }
};
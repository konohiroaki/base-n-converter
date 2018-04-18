var app = new Vue({
    el: '#app',
    data: {
        input: {title: "Input Here", value: "", count: 0},
        output: [{
            title: "As Base64",
            to: [{title: "to Base32", value: "", count: 0}, {title: "to Base16", value: "", count: 0}]
        }, {
            title: "As Base32",
            to: [{title: "to Base64", value: "", count: 0}, {title: "to Base16", value: "", count: 0}]
        }, {
            title: "As Base16",
            to: [{title: "to Base64", value: "", count: 0}, {title: "to Base32", value: "", count: 0}]
        }]
    },
    methods: {
        update: function () {
            this.output[0].to[0].value = BaseN.toBaseN(this.input.value, BaseN.b64, BaseN.b32);
            this.output[0].to[1].value = BaseN.toBaseN(this.input.value, BaseN.b64, BaseN.b16);
            this.output[1].to[0].value = BaseN.toBaseN(this.input.value, BaseN.b32, BaseN.b64);
            this.output[1].to[1].value = BaseN.toBaseN(this.input.value, BaseN.b32, BaseN.b16);
            this.output[2].to[0].value = BaseN.toBaseN(this.input.value, BaseN.b16, BaseN.b64);
            this.output[2].to[1].value = BaseN.toBaseN(this.input.value, BaseN.b16, BaseN.b32);
            CharCounter.updateCounter();
        }
    }
});

var CharCounter = {
    updateCounter: function () {
        app.input.count = app.input.value.length;
        app.output.forEach(function (e) {
            e.to.forEach(function (ee) {
                ee.count = ee.value.length;
            });
        });
    }
};

/**
 * https://tools.ietf.org/html/rfc4648
 */

var BaseN = {
    b64: {
        list: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        chars: 4, bits: 6,
        toBin: function (b64) {
            b64 = b64.length % BaseN.b64.chars === 0
                  && b64.match(/^[A-Za-z0-9+\/]+={0,2}$/) !== null ? b64 : "";
            return BaseN.toBin(b64.replace(/=/g, ""), BaseN.b64);
        }
    },
    b32: {
        list: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        chars: 8, bits: 5,
        toBin: function (b32) {
            b32 = b32.toUpperCase();
            b32 = b32.length % BaseN.b32.chars === 0
                  && b32.match(/^[A-Z2-7]+={0,6}$/) !== null ? b32 : "";
            return BaseN.toBin(b32.replace(/=/g, ""), BaseN.b32);
        }
    },
    b16: {
        list: "0123456789abcdef",
        chars: 2, bits: 4,
        toBin: function (b16) {
            b16 = b16.replace(/[-:]/g, "").toLowerCase();
            b16 = b16.length % BaseN.b16.chars === 0
                  && b16.match(/^[0-9a-f]+$/) !== null ? b16 : "";
            return BaseN.toBin(b16, BaseN.b16);
        }
    },
    toBin: function (code, n) {
        var b2 = "";
        for (var i = 0; i < code.length; i++) {
            var tmp = n.list.indexOf(code[i]).toString(2);
            b2 += (Array(n.bits - 1).fill("0").join("") + tmp).slice(-n.bits);
        }
        b2 = b2.slice(0, b2.length - b2.length % 8); // fix length to 8 * n.
        return b2;
    },
    toBaseN: function (code, fromN, toN) {
        var binary = fromN.toBin(code);
        var groupBits = toN.chars * toN.bits;
        var arr = binary.match(new RegExp(".{1," + groupBits + "}", "g")) || [];
        var baseN = "";
        var chr = toN.chars;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length !== groupBits) {
                if (arr[i].length % toN.bits !== 0) {
                    arr[i] += Array(toN.bits - arr[i].length % toN.bits).fill("0").join("");
                }
                chr = arr[i].length / toN.bits;
            }
            for (var j = 0; j < chr; j++) {
                baseN += toN.list[parseInt(arr[i].slice(toN.bits * j, toN.bits * (j + 1)), 2)];
            }
        }
        baseN += Array(toN.chars - chr).fill("=").join("");
        return baseN;
    }
};

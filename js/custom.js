/**
 * https://tools.ietf.org/html/rfc4648
 */

var BaseN = {
    b64: {
        list: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        chars: 4, bits: 6,
        regex: /^[A-Za-z0-9+\/]+={0,2}$/,
        toBin: function (b64) {
            b64 = b64.replace(/[-:]/g, "");
            b64 = b64.length % BaseN.b64.chars === 0
                  && b64.match(BaseN.b64.regex) !== null ? b64 : "";
            return BaseN.toBin(b64.replace(/=/g, ""), BaseN.b64);
        }
    },
    b32: {
        list: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        chars: 8, bits: 5,
        regex: /^[A-Z2-7]+={0,6}$/,
        toBin: function (b32) {
            b32 = b32.replace(/[-:]/g, "").toUpperCase();
            b32 = b32.length % BaseN.b32.chars === 0
                  && b32.match(BaseN.b32.regex) !== null ? b32 : "";
            return BaseN.toBin(b32.replace(/=/g, ""), BaseN.b32);
        }
    },
    b16: {
        list: "0123456789abcdef",
        chars: 2, bits: 4,
        regex: /^[0-9a-f]+$/,
        toBin: function (b16) {
            b16 = b16.replace(/[-:]/g, "").toLowerCase();
            b16 = b16.length % BaseN.b16.chars === 0
                  && b16.match(BaseN.b16.regex) !== null ? b16 : "";
            return BaseN.toBin(b16, BaseN.b16);
        }
    },
    bin: {
        list: "01",
        chars: 8, bits: 1,
        regex: /^[01]+$/,
        toBin: function (bin) {
            bin = bin.replace(/[-:]/g, "");
            bin = bin.length % BaseN.bin.chars === 0
                  && bin.match(BaseN.bin.regex) !== null ? bin : "";
            return bin;
        }
    },
    toBin: function (code, n) {
        var bin = "";
        for (var i = 0; i < code.length; i++) {
            var tmp = n.list.indexOf(code[i]).toString(2);
            bin += (Array(n.bits - 1).fill("0").join("") + tmp).slice(-n.bits);
        }
        return bin.slice(0, bin.length - bin.length % 8);
    },
    toBaseN: function (code, fromN, toN) {
        var binary = fromN.toBin(code);
        if (toN === BaseN.bin) {
            return binary;
        }
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

var app = new Vue({
    el: '#app',
    data: {
        input: {title: "Input Here", value: "", count: 0},
        output: [{
            title: "As Base64",
            in_length: BaseN.b64.chars,
            in_regex: BaseN.b64.regex,
            to: [{title: "to Base32", value: "", count: 0}, {title: "to Base16", value: "", count: 0},
                {title: "to Binary", value: "", count: 0}]
        }, {
            title: "As Base32",
            in_length: BaseN.b32.chars,
            in_regex: BaseN.b32.regex,
            to: [{title: "to Base64", value: "", count: 0}, {title: "to Base16", value: "", count: 0},
                {title: "to Binary", value: "", count: 0}]
        }, {
            title: "As Base16",
            in_length: BaseN.b16.chars,
            in_regex: BaseN.b16.regex,
            to: [{title: "to Base64", value: "", count: 0}, {title: "to Base32", value: "", count: 0},
                {title: "to Binary", value: "", count: 0}]
        }, {
            title: "As Binary",
            in_length: BaseN.bin.chars,
            in_regex: BaseN.bin.regex,
            to: [{title: "to Base64", value: "", count: 0}, {title: "to Base32", value: "", count: 0},
                {title: "to Base16", value: "", count: 0}]
        }]
    },
    methods: {
        update: function () {
            this.output[0].to[0].value = BaseN.toBaseN(this.input.value, BaseN.b64, BaseN.b32);
            this.output[0].to[1].value = BaseN.toBaseN(this.input.value, BaseN.b64, BaseN.b16);
            this.output[0].to[2].value = BaseN.toBaseN(this.input.value, BaseN.b64, BaseN.bin);
            this.output[1].to[0].value = BaseN.toBaseN(this.input.value, BaseN.b32, BaseN.b64);
            this.output[1].to[1].value = BaseN.toBaseN(this.input.value, BaseN.b32, BaseN.b16);
            this.output[1].to[2].value = BaseN.toBaseN(this.input.value, BaseN.b32, BaseN.bin);
            this.output[2].to[0].value = BaseN.toBaseN(this.input.value, BaseN.b16, BaseN.b64);
            this.output[2].to[1].value = BaseN.toBaseN(this.input.value, BaseN.b16, BaseN.b32);
            this.output[2].to[2].value = BaseN.toBaseN(this.input.value, BaseN.b16, BaseN.bin);
            this.output[3].to[0].value = BaseN.toBaseN(this.input.value, BaseN.bin, BaseN.b64);
            this.output[3].to[1].value = BaseN.toBaseN(this.input.value, BaseN.bin, BaseN.b32);
            this.output[3].to[2].value = BaseN.toBaseN(this.input.value, BaseN.bin, BaseN.b16);
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

var ToolTip = M.Tooltip.init($(".tooltipped"), {
    position: "bottom"
});

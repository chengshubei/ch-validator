'use strict';

const assert = require('assert');

module.exports = {
    required: function(v) {
        if (v === undefined || v === null) return [false, null];
        let str = String(v).replace(/\s/g, '');
        if (str.length > 0) return [true, v];
        return [false, null];
    },

    string: function(v) {
        return [true, String(v).trim()];
    },

    numeric: function(v) {
        if (isNaN(v)) return [false, null];
        return [true, Number(v)];
    },

    integer: function(v) {
        if (isNaN(v) || (v % 1 !== 0)) return [false, null];
        return [true, Number(v)];
    },

    mobile: function(v, param, attributes) {
        if (isNaN(v)) return [false, null];
        if (! attributes['area'] || ['86', '+86'].includes(String(attributes['area']))) {
            let pattern = /^1(3|4|5|6|7|8|9)\d{9}$/;
            return [pattern.test(String(v)), String(v)];
        }
        return [String(v).length > 3, String(v)];
    },

    uuid: function(v) {
        let pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        return [pattern.test(String(v)), v];
    },

    email: function(v) {
        let pattern = /^[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
        return [pattern.test(String(v)), v];
    },

    url: function(v) {
        let pattern = /^(http|https):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(?::\d{1,5})?(?:$|[?\/#])/i;
        return [pattern.test(String(v)), v];
    },

    array: function(v) {
        return [Array.isArray(v), v];
    },
    
    date: function(v) {
        if (isNaN(v)) return [String(new Date(v)) !== 'Invalid Date', v];
        return [true, Number(v)];
    },

    max: function(v, param) {
        assert(! isNaN(param), 'max检测器参数必须是数字: ' + String(param));
        if (typeof v === 'string') return [v.length <= param, v];
        if (typeof v === 'number') return [v <= param, v];
        return [false, null];
    },

    min: function(v, param) {
        assert(! isNaN(param), 'min检测器参数必须是数字: ' + String(param));
        if (typeof v === 'string') return [v.length >= param, v];
        if (typeof v === 'number') return [v >= param, v];
        return [false, null];
    },

    before: function(v, param) {
        assert(this.date(param)[0], 'before检测器参数必须是日期字符串或时间戳: ' + String(param));
        if (! this.date(v)[0]) return [false, null];
        return [new Date(param).getTime() > new Date(v).getTime(), v];
    },
    
    after: function(v, param) {
        assert(this.date(param)[0], 'after检测器参数必须是日期字符串或时间戳: ' + String(param));
        if (! this.date(v)[0]) return [false, null];
        return [new Date(param).getTime() < new Date(v).getTime(), v];
    },

    decimal: function(v, param) {
        assert(Number(param) > 0, 'decimal检测器参数必须是正数: ' + String(param));
        if (isNaN(v)) return [false, null];
        let tmp = String(v).split('.');
        if (tmp.length === 2 && tmp[1].length > param) return [false, null];
        return [true, Number(v)];
    },

    in: function(v, param) {
        assert(Array.isArray(param), 'in验证器参数必须是数组: ' + typeof param);
        for (let i of param) {
            assert(typeof i !== 'object', 'in验证器元素类型只能是字符串或数字');
            if (String(v) === String(i)) return [true, i];
        }
        return [false, null];
    },

    size: function(v, param) {
        assert(! isNaN(param), 'size检测器参数必须是数字: ' + String(param));
        if (Array.isArray(v)) return [v.length == param, v];
        return [String(v).length == param, String(v)];
    },

    required_with: function(v, param, attributes) {
        if (this.required(v)[0]) return [true, v];
        if (this.required(attributes[param])[0]) return [false, null];
        return [true, null];
    },
    
    required_unless: function(v, param, attributes) {
        if (this.required(v)[0]) return [true, v];
        if (! this.required(attributes[param])[0]) return [false, null];
        return [true, null];
    },

    required_if: function(v, param, attributes) {
        if (this.required(v)[0]) return [true, v];
        let key = Object.keys(param)[0];
        if (! this.required(attributes[key])[0]) return [true, null];
        if (attributes[key] == param[key]) return [false, null];
        if (Array.isArray(param[key]) && this.in(attributes[key], param[key])[0]) return [false, null];
        return [true, null];
    },

    required_ifnot: function(v, param, attributes) {
        if (this.required(v)[0]) return [true, v];
        let key = Object.keys(param)[0];
        if (attributes[key] == param[key]) return [true, null];
        if (Array.isArray(param[key]) && this.in(attributes[key], param[key])[0]) return [true, null];
        return [false, null];
    },

    default: function(v, param) {
        if (this.required(v)[0]) return [true, v];
        return [true, param];
    }
};
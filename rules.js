'use strict';

const {SystemError} = require('ch-error');

module.exports = {
    required: function(v) {
        if (v === undefined || v === null) return [false, null];
        let str = String(v).replace(/\s/g, '');
        if (str.length > 0) return [true, v];
        else return [false, null];
    },

    string: function(v) {
        return [true, String(v).trim()];
    },

    numeric: function(v) {
        if (isNaN(v)) return [false, null];
        else return [true, Number(v)];
    },

    integer: function(v) {
        if (isNaN(v) || (v % 1 !== 0)) return [false, null];
        else return [true, Number(v)];
    },

    mobile: function(v, param, attributes) {
        if (isNaN(v)) return [false, null];
        if (attributes['area'] === '86' || ! attributes['area']) {
            let pattern = /^1(3|4|5|6|7|8|9)\d{9}$/;
            return [pattern.test(String(v)), String(v)];
        }
        return [String(v).length > 3, String(v)];
    },

    uuidv1: function(v) {
        let pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
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
        if (! isNaN(v)) v = String(v).length === 10 ? Number(v) * 1000 : Number(v);
        return [String(new Date(v)) !== 'Invalid Date', v];
    },

    max: function(v, param) {
        if (isNaN(param)) throw new SystemError('max检测器参数错误: ' + String(param));
        if (typeof v === 'string') return [v.length <= param, v];
        if (typeof v === 'number') return [v <= param, v];
    },

    min: function(v, param) {
        if (isNaN(param)) throw new SystemError('min检测器参数错误: ' + String(param));
        if (typeof v === 'string') return [v.length >= param, v];
        if (typeof v === 'number') return [v >= param, v];
    },

    before: function(v, param) {
        if (! this.date(param)[0]) throw new SystemError('before检测器参数错误: ' + String(param));
        if (! this.date(v)[0]) return [false, null];
        return [new Date(param).getTime() > new Date(v).getTime(), v];
    },
    
    after: function(v, param) {
        if (! this.date(param)[0]) throw new SystemError('after检测器参数错误: ' + String(param));
        if (! this.date(v)[0]) return [false, null];
        return [new Date(param).getTime() < new Date(v).getTime(), v];
    },

    decimal: function(v, param) {
        if (isNaN(param)) throw new SystemError('decimal检测器参数错误: ' + String(param));
        if (isNaN(v)) return [false, null];
        let tmp = String(v).split('.');
        if (tmp.length === 2 && tmp[1].length > param) return [false, null];
        else return [true, Number(v)];
    },

    in: function(v, param) {
        if (! Array.isArray(param)) throw new SystemError('in验证器参数错误: ' + typeof param);
        for (let i of param) {
            if (typeof i === 'object') throw new SystemError('in验证器元素类型不允许: ' + typeof i);
            if (String(v) === String(i)) return [true, i];
        }
        return [false, null];
    },

    size: function(v, param) {
        if (isNaN(param)) throw new SystemError('size检测器参数错误: ' + String(param));
        if (Array.isArray(v)) return [v.length == param, v];
        return [String(v).length == param, String(v)];
    },

    required_with: function(v, param, attributes) {
        if (this.required(v)[0]) return [true, v];
        else if (this.required(attributes[param])[0]) return [false, null];
        else return [true, null];
    },

    required_unless: function(v, param, attributes) {
        if (this.required(v)[0]) return [true, v];
        else if (! this.required(attributes[param])[0]) return [false, null];
        else return [true, null];
    },

    required_if: function(v, param, attributes) {
        if (this.required(v)[0]) return [true, v];
        else {
            let key = Object.keys(param)[0];
            if (! this.required(attributes[key])[0]) return [true, null];
            else {
                if (Array.isArray(param[key])) if (! this.in(attributes[key], param[key])[0]) return [true, null];
                else if (attributes[key] != param[key]) return [true, null];
            }
        }
        return [false, null];
    },

    default: function(v, param) {
        if (this.required(v)[0]) return [true, v];
        else return [true, param];
    }
};
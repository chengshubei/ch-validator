'use strict';

const assert = require('assert');
const {ValidateError} = require('ch-error');
const rules = require('./rules');
const language = require('./lang');

/**
 * ruleMap.set('/user/info', {'id': {
 *      en: 'id',               //英文参数名
 *      zh_CN: '用户编号',      //中文参数名
 *      rules: [{
 *          rule: 'min',        //规则名
 *          option: 100         //校验条件
 *      }]
 * }});
 */
let ruleMap = new Map();

//使用说明：第一个规则，必须是字段名
module.exports = (ruleObj = {}) => {
    for (let path in ruleObj) {
        let params = ruleObj[path];
        let options = {};
        for (let key in params) {
            if (! Array.isArray(params[key]) || params[key].length <= 1) continue;
            let ruleArray = params[key];
            let ruleList = [];
            for (let i=1, l=ruleArray.length; i<l; i++) {
                let rule = ruleArray[i];
                let option = null;
                if (typeof rule === 'object') [rule, option] = Object.entries(rule)[0];
                assert(typeof rules[rule] === 'function', '无效检验规则: ' + rule);
                //校验规则条件
                if (option) rules[rule](0, option);
                let vl = {rule, option};
                if (['required', 'required_if', 'required_unless', 'default'].includes(rule)) ruleList.unshift(vl);
                else ruleList.push(vl);
            }
            options[key] = {
                zh_CN: ruleArray[0],
                en: key,
                rules: ruleList
            };
        }
        ruleMap.set(path, options);
    }

    return function (ctx, next) {
        if (! ruleMap.has(ctx.path)) {
            ctx.attributes = {};
            return;
        }

        let lang = ctx.get('lang') === 'en' ? 'en' : 'zh-CN';
        let attributes = Object.assign(ctx.request.query, ctx.request.body);
        let keyMap = ruleMap.get(ctx.path);
        let params = {};
        for (let key in keyMap) {
            let comment = lang === 'en' ? keyMap[key]['en'] : keyMap[key]['zh_CN'];
            for (let {rule, option} of keyMap[key]['rules']) {
                let result = rules[rule](attributes[key], option, attributes);
                if (! result[0]) {
                    let err = `${comment}${language[lang][rule]}`;
                    if (err.charAt(err.length - 1) === ' ') err += String(option);
                    throw new ValidateError(err);
                } else if (result[1] !== null) {
                    params[key] = result[1];
                }
            }
        }
        ctx.attributes = params;
        return next();
    };
};
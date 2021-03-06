'use strict';

const assert = require('assert');
const {ValidateError} = require('ch-error');
const rules = require('./rules');
const language = require('./lang');

/**
 * ruleMap.set('get_/user/info', {'id': {
 *      en: 'id',               //英文参数名
 *      zh_CN: '用户编号',      //中文参数名
 *      necessity: [{          //参数必要性检测集合
 *          rule: 'default',   //必要性规则名
 *          option: 20         //参数
 *      }]
 *      rules: [{               //规则集合
 *          rule: 'min',        //规则名
 *          option: 100         //校验条件
 *      }]
 * }});
 */
let ruleMap = new Map();

//使用说明：第一个规则，必须是字段名
module.exports = (ruleObj = {}) => {
    for (let uri in ruleObj) {
        let params = ruleObj[uri];
        let options = {};
        for (let key in params) {
            if (! Array.isArray(params[key]) || params[key].length <= 1) continue;
            let ruleArray = params[key];
            let ruleList = [];
            let nsList = [];
            for (let i=1, l=ruleArray.length; i<l; i++) {
                let rule = ruleArray[i];
                let option = null;
                if (typeof rule === 'object') [rule, option] = Object.entries(rule)[0];
                assert(typeof rules[rule] === 'function', '无效检验规则: ' + rule);
                //校验规则条件
                if (option) rules[rule](0, option);
                let vl = {rule, option};
                //检测条件排序
                if (['required', 'required_if', 'required_unless', 'default'].includes(rule)) nsList.push(vl);
                else if (['string', 'numeric', 'integer'].includes(rule)) ruleList.unshift(vl);
                else ruleList.push(vl);
            }
            options[key] = {
                zh_CN: ruleArray[0],
                en: key,
                necessity: nsList,
                rules: ruleList
            };
        }
        ruleMap.set(uri, options);
    }

    return function (ctx, next) {
        let params = {};
        let uri = `${ctx.method.toLowerCase()}_${ctx.path}`;
        if (ruleMap.has(uri)) {
            let lang = ctx.get('lang') === 'en' ? 'en' : 'zh-CN';
            let attributes = Object.assign(ctx.request.query, ctx.request.body);
            let keyMap = ruleMap.get(uri);
            for (let key in keyMap) {
                let comment = lang === 'en' ? keyMap[key]['en'] : keyMap[key]['zh_CN'];
                let value = attributes[key];
                //必要性检测
                if (! value && value !== 0) {
                    for (let {rule, option} of keyMap[key]['necessity']) {
                        let result = rules[rule](value, option, attributes);
                        if (! result[0]) {
                            let err = `${comment}${language[lang][rule]}`;
                            if (err.charAt(err.length - 1) === ' ') err += String(option);
                            throw new ValidateError(err);
                        } else if (result[1] !== null) {
                            params[key] = value = result[1];
                        }
                    }
                    continue;
                }
                //规则条件检测
                for (let {rule, option} of keyMap[key]['rules']) {
                    let result = rules[rule](value, option, attributes);
                    if (! result[0]) {
                        let err = `${comment}${language[lang][rule]}`;
                        if (err.charAt(err.length - 1) === ' ') err += String(option);
                        throw new ValidateError(err);
                    } else if (result[1] !== null) {
                        params[key] = value = result[1];
                    }
                }
            }
        }        
        ctx.attributes = params;
        return next();
    };
};
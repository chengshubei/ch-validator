'use strict';

const {SystemError, ValidateError} = require('ch-error');
const rules = require('./rules');
const language = require('./lang');

//使用说明：第一个规则，必须是字段名
module.exports = (ctx, ruleObj) => {
    if (! ruleObj || typeof ruleObj !== 'object' || ! ruleObj[ctx.path]) {
        ctx.attributes = {};
        return;
    }
    let lang = ctx.get('lang') || 'zh-CN';
    let attributes = Object.assign(ctx.params, ctx.request.query, ctx.request.body);
    let ruleMap = ruleObj[ctx.path];
    let params = {};

    for (let key in ruleMap) {
        if (! Array.isArray(ruleMap[key]) || ruleMap[key].length <= 1) continue;
        let ruleArray = ruleMap[key];
        let comment = (typeof ruleArray[0] === 'string' ? ruleArray[0] : ruleArray[0][lang]) || 'attribute';
        
        for (let i = 1; i < ruleArray.length; i++) {
            let rule = ruleArray[i];
            let option = null;
            if (typeof rule === 'object') {
                option = Object.values(rule)[0];
                rule = Object.keys(rule)[0];
            }
            if (typeof rules[rule] !== 'function') throw new SystemError('invalidated rule: ' + rule);
            if (! rules['required'](attributes[key]) && ! ['required', 'required_if', 'required_unless', 'default'].includes(rule)) {continue;}
            
            let result = rules[rule](attributes[key], option, attributes, key);
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
};
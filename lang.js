'use strict';

module.exports = {
    //简体中文
    'zh-CN': {
        required: '不能为空',
        string: '必须是字符串类型',
        numeric: '必须是数字类型',
        integer: '必须是整数类型',
        mobile: '必须是正确的手机号',
        uuidv1: '必须是UUID/v1格式',
        email: '必须是正确的邮箱格式',
        url: '必须是正确的url格式',
        array: '必须是数组格式',
        date: '必须是正确的日期格式',

        max: '值不能大于 ',
        min: '值不能小于 ',
        before: '日期太大',
        after: '日期太小',
        decimal: '小数位数不能大于 ',
        in: '值必须是指定的有效值',
        size: '值的长度必须等于 ',
        required_with: '不能为空',
        required_if: '不能为空'
    },
    //英文
    'en': {
        required: ' is required',
        string: ' must be a string',
        numeric: ' must be a number',
        integer: ' must be an integer',
        mobile: ' must be a right mobile number',
        uuidv1: ' must be a string with UUID/v1 rule',
        email: ' must be a right email format',
        url: ' must be a right url format',
        array: ' must be an array',
        date: ' is not a valid date format',

        max: ' may not be smaller than ',
        min: ' must be at least ',
        before: 'is too large',
        after: 'is too small',
        decimal: ' decimal digits must be smaller than ',
        in: ' is invalid',
        size: ' length must be ',
        required_with: ' is required',
        required_if: ' is required'
    }
};
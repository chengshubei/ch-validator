'use strict';

module.exports = {
    //简体中文
    'zh-CN': {
        required: '不能为空',
        string: '必须是字符串类型',
        numeric: '必须是数字类型',
        integer: '必须是整数类型',
        mobile: '必须是正确的手机号',
        uuid: '必须是UUID格式',
        email: '必须是正确的邮箱格式',
        url: '必须是正确的url格式',
        array: '必须是数组格式',
        date: '必须是正确的日期格式',

        max: '值或长度不能大于 ',
        min: '值或长度不能小于 ',
        before: '日期太大',
        after: '日期太小',
        decimal: '小数位数不能大于 ',
        in: '值必须是指定的有效值',
        size: '值的长度必须等于 ',
        required_with: '不能为空',
        required_unless: '不能为空',
        required_if: '不能为空',
        required_ifnot: '不能为空'
    },
    //英文
    'en': {
        required: ' is required',
        string: ' must be a string',
        numeric: ' must be a number',
        integer: ' must be an integer',
        mobile: ' must be a right mobile number',
        uuid: ' must be a string with UUID rule',
        email: ' must be a right email format',
        url: ' must be a right url format',
        array: ' must be an array',
        date: ' is not a valid date format',

        max: ' value or length must be smaller than ',
        min: ' value or length must be bigger than ',
        before: 'is too large',
        after: 'is too small',
        decimal: ' decimal digits must be smaller than ',
        in: ' is invalid',
        size: ' length must be ',
        required_with: ' is required',
        required_unless: ' is required',
        required_if: ' is required',
        required_ifnot: ' is required'
    }
};
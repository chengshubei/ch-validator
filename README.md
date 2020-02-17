
# ch-validator
    支持数据校验,清洗,过滤,汇总的多功能路由参数校验中间件。
    集成于ch-koa框架。

## Installation

```
$ npm install ch-validator
```


## Example For Koa2

```js
const Koa = require('koa');
const validate = require('ch-validator');
const app = new Koa(config);
const validators = {
    'get_/user/info': {
        'id': ['用户编号', 'required', 'integer', {'min': 1000}],
        'school': ['学校名称', 'string', {'default': '杭州市学军中学'}]
    }
};
app.use((ctx, next) => {
    try {
        ctx.body = 'success';
    } catch(e) {
        ctx.body = {
            code: e.code,
            data: e.data,
            message: e.messsage,
            error: e.error
        };
    }
});
app.use(validate(validators));
```

## 使用说明

(请忽略1.2.0之前版本内容, 模块初建修改较大, 1.2.0为第一个稳定版本, 之后版本为正常迭代, 保证质量和兼容性) 

**该模块若配合koa2使用, 请务必在前置中间件中包含异常处理, 验证不通过会抛出Error。**  
模块需要传入路由校验对象。{method_path: {param: [name, ...validators]}}  
***特别注意: 参数校验规则列表的第一个元素，必须为参数名，用于检测不通过时的中文提示信息***  
因为参数校验在c端理应先行校验，在生产环境不通过的概率较小，本模块验证不通过的提示只支持中文和英文。  
根据ctx.get('lang')得到的国际化标识, 没有或为zh_CN则提示中文, 否则提示英文, 英文参数名为字段key本身。

## 支持的常用规则:  

名词 | 规则 | 示例
-|-|-|
required | 不能为空 | {uid: ['用户编号', 'required']} 
required_with | 如果某个参数存在,则不能为空 | {area: ['手机区号', {required_with: 'mobile'}]}
required_unless | 除非某个参数存在,否则不能为空 | {mobile: ['手机号', {required_unless: 'email'}]}
required_if | 如果某个参数等于指定值或是列表中的值,则不能为空 | {age: ['年龄', {required_if: {group: 'children'}}, {required_if: {level: [1, 2]}}]}
required_ifnot | 如果某个参数不等于指定值或列表中的值,则不能为空 | {mobile: ['手机号', {required_ifnot: {type: 'email'}}]}
default | 如果为空时,给予默认值 | {sex: ['性别', {default: 'man'}]}
string | 字符串(允许任意类型,强制转为字符串) | {address: ['地址', 'string']}
number | 数字(允许数字字符串,强制转为数字) | {score: ['分数', 'number']}
integer | 整数(允许整数字符串,强制转为整数) | {age: ['年龄', 'number']}
mobile | 手机号(建议带上'area'参数使用) | {mobile: ['手机号', 'mobile']}
email | 邮箱地址 | {email: ['邮箱地址', 'email']}
uuid | UUID格式(不区分v1,v4等版本) | {id: ['订单编号', 'uuid']}
url | 链接地址 | {download_url: ['下载地址', 'url']}
array | 数组 | {partners: ['同伴们', 'array']}
date | 日期(支持时间字符串和10,13位时间戳) | {addtime: ['注册时间', 'date']}
before | 必须早于指定时间字符串或10,13位时间戳 | {addtime: ['注册时间', 'date', {before: 1581955465}]}
after | 必须晚于指定时间字符串或10,13位时间戳 | {addtime: ['注册时间', 'date', {after: 1581955465}]}
max | 数字最大值或字符串最大长度 | {address: ['住址', 'string', {max: 50}]}
min | 数字最小值或字符串最小长度 | {age: ['年龄', 'integer', {min: 18}]}
size | 字符串长度或数组元素数量必须是指定值 | {code: ['验证码', 'string', {size: 6}]}
in | 必须是数组内的元素,允许数字字符串和数字类型匹配 | {level: ['等级', {in: [3, '4', 5]}]}
decimal | 指定最大小数位数,允许数字字符串,强制转为数字 | {score: ['分数', {decimal: 2}]}

校验包括ctx.request.query和ctx.request.body中的所有参数, 不支持动态路由校验(不校验ctx.params)。  
校验完成并格式化数据, 生成新对象, 挂载在ctx.attributes中, 原始数据不会修改。  
***建议在路由校验后的处理中统一使用ctx.attributes, 不再区分请求类型。***  

校验失败抛出的错误, 依赖于ch-error模块中定义的**ValidateError**错误类型。
需要新增校验规则, 可以提交issue或联系我 1246691129@qq.com  

# License

  MIT

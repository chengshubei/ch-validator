
# ch-validator
    支持数据校验,清洗,过滤,汇总的多功能路由参数校验器。
    使用需配合Koa2框架, 配合ch-koa框架使用更佳。

## Installation

```
$ npm install ch-validator
```


## Example

  Always pretty by default:

```js
const Koa = require('koa');
const validate = require('ch-validator');
const app = new Koa(config);
const validators = {
    '/user/info': {
        'id': ['用户编号', 'required', 'integer', {'min': 1000}],
        'school': ['学校名称', 'string', {'default': '杭州市学军中学'}]
    }
};
app.use(validate(validators));
```

## 使用说明
    如上举例..
    该模块配合koa2使用, 用于路由参数的校验,清洗,过滤,汇总。
    模块需要传入路由校验对象。{path: {param: [name, ...validators]}}
    ***特别注意: 参数校验规则列表的第一个元素，必须为参数名，用于检测不通过时的中文提示信息***
    因为参数校验在c端理应先行校验，在生产环境不通过的概率较小，本模块验证不通过的提示只支持中文和英文。
    根据ctx.get('lang')得到的国际化标识, 没有或为zh_CN则提示中文, 否则提示英文, 英文参数名为字段key本身。
    
    ch-validator支持常用的规则如下:
        - require               必须存在
        - require_with          如果某个参数存在, 则必须存在
        - require_if            满足条件, 则必须存在
        - required_unless       除非满足某个条件, 否则必须存在
        - default               如果参数不存在，给予默认值
        - string                字符串, 允许任意值，将强制转化为字符串
        - number                数字, 允许数字字符串，将强制转化为数字
        - integer               整数, 允许数字字符串，将强制转化为数字
        - mobile                手机号, 建议带参数"area"使用
        - uuidv1                v1版本UUID
        - email                 邮箱
        - url                   链接
        - array                 数组
        - date                  日期, 支持时间字符串和10,13位时间戳
        - before                必须早于指定时间戳或时间字符串
        - after                 必须晚于指定时间戳或时间字符串
        - max                   数字类型最大值 或 字符串类型最大长度
        - min                   数字类型最小值 或 字符串类型最小长度
        - decimal               指定最大小数位数, 允许数字字符串，将强制转化为数字
        - in                    必须是数组内元素, 允许数字字符串与数字类型匹配
        - size                  指定字符串长度 或 数组长度

    校验包括ctx.request.query和ctx.request.body中的所有参数, 不支持动态路由校验(不校验ctx.params)。
    校验完成并格式化数据, 生成新对象, 挂载在ctx.attributes中, 原始数据不会修改。
    ***建议在路由校验后的处理中统一使用ctx.attributes, 不再区分请求类型。***

    校验失败抛出的错误, 依赖于ch-error模块中定义的ValidateError错误类型。

# License

  MIT

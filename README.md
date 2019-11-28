
# ch-validator

  powerful objects and strings validation, used with koa, and better with ch-koa.
  支持 数据校验，数据清洗 和 数据过滤的多功能校验器

## Installation

```
$ npm install ch-validator
```


## Example

  Always pretty by default:

```js
const Koa = require('koa');
const app = new Koa(config);
const validators = {
    '/user/info': {
        'id': ['用户编号', 'required', 'integer', {'min': 1000}],
        'school': [{'zh-CN': '学校名称', 'en': 'school'}, 'string', {'default': '杭州市学军中学'}]
    }
}
app.use((ctx, next) => {
    validate(ctx, validators);
    return next();
});
```

## Basic Usage
    如上举例..
    该模块配合koa使用2, 最好配合ch-koa使用, 只用于检测路由参数。
    参数规则数组第一个元素必须为 参数名称 或参数名称对象(对应多语言), 用于参数检测不通过时的报错信息。
    支持常用的规则:
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

    校验包括ctx.param, ctx.request.query和ctx.request.body中的所有参数。
    校验完成并格式化数据, 生成新对象, 挂载在ctx.attributes中, 原始数据不会修改。
    建议在路由校验后的处理中统一使用ctx.attributes, 不再区分请求类型。

    校验失败抛出的错误, 依赖于ch-koa模块中定义的错误类型。

# License

  MIT

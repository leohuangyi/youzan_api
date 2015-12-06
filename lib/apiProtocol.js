/**
 * Created by leo on 15/12/6.
 */

var apiProtocol = function () {
    return {
        APP_ID_KEY: 'app_id',
        METHOD_KEY: 'method',
        TIMESTAMP_KEY: 'timestamp',
        FORMAT_KEY: 'format',
        VERSION_KEY: 'v',
        SIGN_KEY: 'sign',
        SIGN_METHOD_KEY: 'sign_method',

        ALLOWED_DEVIATE_SECONDS: 600,

        ERR_SYSTEM: -1,
        ERR_INVALID_APP_ID: 40001,
        ERR_INVALID_APP: 40002,
        ERR_INVALID_TIMESTAMP: 40003,
        ERR_EMPTY_SIGNATURE: 40004,
        ERR_INVALID_SIGNATURE: 40005,
        ERR_INVALID_METHOD_NAME: 40006,
        ERR_INVALID_METHOD: 40007,
        ERR_INVALID_TEAM: 40008,
        ERR_PARAMETER: 41000,
        ERR_LOGIC: 50000,

        sign: function (appSecret, params, method) {
            if (!params) params = {};

            //将params ksrot
            var keys = [];
            for (var key in params) {
                keys.push(key);
            }
            keys.sort();

            var sortedParams = {};
            keys.forEach(function(key){
                sortedParams[key] = params[key];
            });
            var text = '';
            for (var key in sortedParams) {
                text += key + sortedParams[key];
            }
            return this.hash(method, appSecret + text + appSecret);
        },

        hash: function (method, text) {
            var signature;
            switch (method) {
                case 'md5':

                default:
                    var crypto = require('crypto');
                    var md5 = crypto.createHash('md5');
                    md5.update(text);
                    signature = md5.digest('hex');
                    break;
            }
            return signature;
        },


        allowedSignMethods: function (method) {
            var allowMethods = {
                'md5': true
            };
            return allowMethods[method]
        },


        allowedFormat: function (method) {
            var alllowdFormat = {
                'json': true
            };
            return alllowdFormat[method];
        },

        doc: function () {
            return {
                APP_ID_KEY: {
                    'type': 'String',
                    'required': true,
                    'desc': 'App ID',
                },
                METHOD_KEY: {
                    'type': 'String',
                    'required': true,
                    'desc': 'API接口名称',
                },
                TIMESTAMP_KEY: {
                    'type': 'String',
                    'required': true,
                    'desc': '时间戳，格式为yyyy-mm-dd HH:mm:ss，例如：2013-05-06 13:52:03。服务端允许客户端请求时间误差为'. parseInt(this.ALLOWED_DEVIATE_SECONDS / 60) + '分钟。',
                },
                FORMAT_KEY: {
                    'type': 'String',
                    'required': false,
                    'desc': '可选，指定响应格式。默认json,目前支持格式为json',
                },
                VERSION_KEY: {
                    'type': 'String',
                    'required': true,
                    'desc': 'API协议版本，可选值:1.0',
                },
                SIGN_KEY: {
                    'type': 'String',
                    'required': true,
                    'desc': '对 API 输入参数进行 md5 加密获得，详细参考签名章节',
                },
                SIGN_METHOD_KEY: {
                    'type': 'String',
                    'required': false,
                    'desc': '可选，参数的加密方法选择。默认为md5，可选值是：md5',
                }
            };
        },

        error: function () {
            var errors = {};
            var response = {};

            response = {
                'code': {
                    'type': 'Number',
                    'desc': '错误编号',
                    'example': 40002,
                    'required': true,
                },
                'msg': {
                    'type': 'String',
                    'desc': '错误信息',
                    'example': 'invalid app',
                    'required': true,
                },
                'params': {
                    'type': 'List',
                    'desc': '请求参数列表',
                    'example': {
                        'app_id': 'ac9aaepv37d2a5guc',
                        'method': 'kdt.trades.sold.get',
                        'timestamp': '2014-01-20 20:38:42',
                        'format': 'json',
                        'sign_method': 'md5',
                        'v': '1.0',
                        'sign': 'wi93n31d034a9207ert7d3971e3vno10',
                    },
                    'required': true,
                }
            };
            errors[this.ERR_SYSTEM] = {
                'desc': '系统错误',
                'suggest': '',
            };
            errors[this.ERR_INVALID_APP_ID] = {
                'desc': '未指定 AppId',
                'suggest': '请求时传入 AppId',
            };
            errors[this.ERR_INVALID_APP] = {
                'desc': '无效的App',
                'suggest': '申请有效的 AppId',
            };
            errors[this.ERR_INVALID_TIMESTAMP] = {
                'desc': '无效的时间参数',
                'suggest': '以当前时间重新发起请求；如果系统时间和服务器时间误差超过10分钟，请调整系统时间',
            };
            errors[this.ERR_EMPTY_SIGNATURE] = {
                'desc': '请求没有签名',
                'suggest': '请使用协议规范对请求中的参数进行签名',
            };
            errors[this.ERR_INVALID_SIGNATURE] = {
                'desc': '签名校验失败',
                'suggest': '检查 AppId 和 AppSecret 是否正确；如果是自行开发的协议分装，请检查代码',
            };
            errors[this.ERR_INVALID_METHOD_NAME] = {
                'desc': '未指定请求的 Api 方法',
                'suggest': '指定 Api 方法',
            };
            errors[this.ERR_INVALID_METHOD] = {
                'desc': '请求非法的方法',
                'suggest': '检查请求的方法的值',
            };
            errors[this.ERR_INVALID_TEAM] = {
                'desc': '校验团队信息失败',
                'suggest': '检查团队是否有效、是否绑定微信',
            };
            errors[this.ERR_PARAMETER] = {
                'desc': '请求方法的参数错误',
                'suggest': '',
            };
            errors[this.ERR_LOGIC] = {
                'desc': '请求方法时业务逻辑发生错误',
                'suggest': '',
            };
            return {
                errors: errors,
                response: response
            }
        }
    };
};
module.exports = apiProtocol;
/**
 * Created by leo on 15/12/6.
 */

var apiProtocol = require('./apiProtocol')();
var httpClient = require('./httpClient')();
var dateFormatter = require('date-formatter');
var apiClient = function (appId, appSecret) {
    var client = {
        VERSION: '1.0',
        apiEntry: 'https://open.koudaitong.com/api/entry',

        appId: null,
        appSecret: null,

        format: 'json',
        signMethod: 'md5',

        constructor: function (appId, appSecret) {
            if (!appId || !appSecret) {
                throw new Error('appId 和 appSecret不能为空');

                this.appId = appId;
                this.appSecret = appSecret;
            }
        },
        get: function (method, params, files,callback) {
            return httpClient.get(this.apiEntry, this.buildRequestParams(method, params), files,callback);
        },
        post: function (method, params, files, callback) {
            return httpClient.post(this.apiEntry, this.buildRequestParams(method, params), files,callback);
        },
        setFormat: function (format) {
            if (!apiProtocol.allowedFormat(format)) throw new Exception('设置的数据格式错误');

            this.format = format;

            return this;
        },

        setSignMethod: function (method) {
            if (!apiProtocol.allowedSignMethods(method)) throw new Exception('设置的签名方法错误');

            this.signMethod = method;

            return this;
        },

        buildRequestParams: function (method, apiParams) {
            if (!apiParams) apiParams = {};

            var pairs = this.getCommonParams(method);

            for (var key in apiParams) {
                if (pairs[key]) throw new Error('参数名存在冲突');
                pairs[key] = apiParams[key];
            }

            pairs[apiProtocol.SIGN_KEY] = apiProtocol.sign(this.appSecret, pairs, this.signMethod);
            return pairs;
        },
        getCommonParams: function (method) {
            var params = {};
            params[apiProtocol.APP_ID_KEY] = this.appId;
            params[apiProtocol.METHOD_KEY] = method;
            //ToDo
            params[apiProtocol.TIMESTAMP_KEY] = dateFormatter(new Date(), 'YYYY-MM-DD hh:mm:ss');
            params[apiProtocol.FORMAT_KEY] = this.format;
            params[apiProtocol.SIGN_METHOD_KEY] = this.signMethod;
            params[apiProtocol.VERSION_KEY] = this.VERSION;
            return params;
        }
    };
    client.constructor(appId, appSecret);
    return client;
};
module.exports = apiClient;

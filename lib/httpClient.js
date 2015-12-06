/**
 * Created by leo on 15/12/6.
 */
var req = require('request');
var fs = require('fs');
var httpClient = function () {
    return {
        get: function (url, params, callback) {
            var getUrl = url + '?';
            for (var key in params) {
                getUrl += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
            }
            getUrl = getUrl.substring(0, getUrl.length - 1);

            req(getUrl, function (err, httpResponse, body) {
                if (err) {
                    throw new Error('请求出错');
                }
                callback(body);
            })
        },
        post: function (url, params, files, callback) {
            var options = {
                url: url,
                headers: {
                    'User-Agent': 'KdtApiSdk Client v0.1'
                },
                form: params
            };
            if (files) {
                for (var name in files) {
                    options[name] = fs.createReadStream(files[name]);
                }
            }
            req(options, function (err, httpResponse, body) {
                if (err) {
                    throw new Error('请求出错');
                }
                callback(body);
            })
        }
    }
};
module.exports = httpClient;
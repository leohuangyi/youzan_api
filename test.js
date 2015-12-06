/**
 * Created by leo on 15/12/6.
 */
var apiClient = require('./lib/apiClient')('xxxxx', 'xxxx');

var method = 'kdt.item.get';
var params = {
    alias: '3enzneynzr5nn'
};



apiClient.get(method, params, function(res){
    console.log(res);
});

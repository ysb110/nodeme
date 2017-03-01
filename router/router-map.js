var path = require('path');
var router = require('express').Router();
var _ = require("lodash");
// var pathconfig = require('./path_config');

/**
 * 读取控制器.
 */
 var controllers = requireAll({
 	dirname: path.join(__dirname, '../controllers'),
 	filter: /(.+)\.controller\.js$/
 });
var pathconfig = {
  // 首页
  '/': { get: 'home'},
 
  // 单页
  '/:page*': { get: 'page' },

  // 错误页
  '/*': { get: 'errors.notFound' },

  //api
  '/api': {
  	'/account': {
  		all: 'account.check',
  		get: 'account.current',
  		'/sign-in': {
  			'put': 'account.sign'
  		}
  	},
  	// 推荐
    '/features': {
      get: [100100, 'features.all'],
      post: [100101, 'features.create'],

      '/:feature': {
        get: [100100, 'features.one'],
        put: [100101, 'features.update'],
        delete: [100101, 'features.remove']
      }
    }
  }
};
(loop(map, route)=>{
	route = route | '';
	map.forEach((val,key)=>{
		if (typeof val === 'object' && !_.isArray(val)) {
			loop(val, route + key);
		} else {
			var controller, action;
			if (_.isString(val)) {
				controller = val.split('.')[0];
				action = val.split('.')[1];
			} else if (_.isArray(val)) {
				var authorities = _.filter(val, function(item) {
					return _.isNumber(item);
				});

				var controllerRouters = _.filter(val, (item) => {
					return _.isString(item);
				});
				
				// 获取权限
        		if (!_.isEmpty(authorities)) router[key](route, controllers.validation(authorities));
						 // 获取控制器和动作
		        if (!_.isEmpty(controllerRouters)) {
		          controller = controllerRouters[0].split('.')[0];
		          action = controllerRouters[0].split('.')[1];
		        }
			}

			if (action) {
				router[key](route, controllers[controller][action]);
			} else {
				router[key](route, controllers[controller]);
			}
		}
	});

})(pathconfig);

// router.get("/login/:id", function(req, res) {
//     console.log('打印参数result1 ', req.params.id);
//     res.end('ok');
// });

module.exports = router;
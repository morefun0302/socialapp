exports.definition = {
	config: {
		adapter: {
			type: "properties",
			collection_name: "EventDispatcher"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			defaults: {
                Events: {
                    BOOT:'com.foodtec.customerapp.BOOT',
                    APP_EXIT:'com.foodtec.customerapp.APP_EXIT',       
                    PAGE_OPENED: 'com.foodtec.customerapp.PAGE_OPENED',
                    PAGE_CLOSED: 'com.foodtec.customerapp.PAGE_CLOSED',
                    UNEXPECTED_API_RESPONSE:'com.foodtec.customerapp.UNEXPECTED_API_RESPONSE'
                }
            }
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			
		});

		return Collection;
	}
};

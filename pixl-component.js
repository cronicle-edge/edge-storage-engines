

module.exports = class Component {
	
	__name = ''
	
	server =  null
	config = null
	defaultConfig = null
	logger = null
	
	constructor() {
		// class constructor
	}
	
	init(server, config) {
		// initialize and attach to server
		this.server = server;
		this.config = config || server.config.getSub( this.__name );
		this.logger = server.logger;
		
		// init config and monitor for reloads
		this.initConfig();
		this.config.on('reload', this.initConfig.bind(this));
	}
	
	initConfig() {
		// import default config
		if (this.defaultConfig) {
			var config = this.config.get();
			for (var key in this.defaultConfig) {
				if (typeof(config[key]) == 'undefined') {
					config[key] = this.defaultConfig[key];
				}
			}
		}
	}
	
	earlyStart() {
		// override in subclass, return false to interrupt startup
		return true;
	}
	
	startup(callback) {
		// override in subclass
		callback();
	}
	
	shutdown(callback) {
		// override in subclass
		callback();
	}
	
	debugLevel(level) {
		// check if we're logging at or above the requested level
		if (!this.config || !this.config.get) return true; // sanity
		var debug_level = this.config.get('debug_level') || this.logger.get('debugLevel');
		return (debug_level >= level);
	}
	
	logDebug(level, msg, data) {
		// proxy request to system logger with correct component
		if (!this.logger.print && this.logger.debug) return this.logger.debug(level, msg, data);
		
		if (this.debugLevel(level)) {
			this.logger.set( 'component', this.__name );
			this.logger.print({ 
				category: 'debug', 
				code: level, 
				msg: msg, 
				data: data 
			});
		}
	}
	
	logError(code, msg, data) {
		// proxy request to system logger with correct component
		this.logger.set( 'component', this.__name );
		this.logger.error( code, msg, data );
	}
	
	logTransaction(code, msg, data) {
		// proxy request to system logger with correct component
		this.logger.set( 'component', this.__name );
		this.logger.transaction( code, msg, data );
	}
	
}


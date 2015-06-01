
compiler.registerClass("wipeoutDocs.viewModels.application", "wo.view", function() {
    
    function Application(templateId) {
        if(this.constructor === Application) throw "Cannot create an instance of an abstract class";
        
        this._super(templateId);
                
        var _this = this;
        crossroads.addRoute('/{site}/{version}/{page}{?query}', function(site, version, page, query){
            _this.route(query);
        });
    };
    
    Application.prototype.onApplicationInitialized = function() {
        this.appInit = true;
    };
    
    Application.prototype.route = function(query) {
        throw "Abstract method must be overridden";
    };
    
    Application.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        
		this.observe("templateItems.content.model", function() {                
			window.scrollTo(0,0);
		});
    };
    
    return Application;
});
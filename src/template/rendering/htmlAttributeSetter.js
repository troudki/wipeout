//TODO: rename
Class("wipeout.template.rendering.htmlAttributeSetter", function () {
	
	var htmlPropertyValue = wipeout.template.propertyValue.extend(function htmlAttributeSetter (name, value, action) {
		///<summary>Set html attributes</summary>
        ///<param name="name" type="String">The name of the attribute</param>
        ///<param name="value" type="String">The value of the attribute</param>
        ///<param name="action" type="String" optional="true">The wipoeut html attribute to use. If null, use "name"</param>
		
		this._super(name, value);
		
		///<summary type="String">The wipoeut html attribute to use. If null, use "name"</summary>
		this.action = action;
	});
	
	htmlPropertyValue.prototype.eventBuild = function () {
		///<summary>Build an event invoker for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		return this._eventBuilt || (this._eventBuilt = wipeout.template.context.buildEventGetter(this.value()));
	};
	
	htmlPropertyValue.prototype.onElementEvent = function (event, renderContext, callback, capture) { //TODE
		///<summary>When called within a wipeout binding function, will watch for a an element event. Also handles all disposal in this case</summary>
        ///<param name="event" type="String">The event</param>
        ///<param name="renderContext" type="wipeout.template.context">The context of the callback</param>
        ///<param name="callback" type="Function">A callback for the event. To use the render context, generate the callback using wipeout.template.context.buildEventGetter</param>
        ///<param name="capture" type="Boolean">Capture the event within this element</param>
        ///<returns type="Function">A dispose function to dispose prematurely</returns>
		
		this.primed();
		
		var element = this.propertyOwner;
		callback = callback || (function (e) {
			this.eventBuild().apply(null, renderContext.asEventArgs(e, element));
		}).bind(this);
						
        element.addEventListener(event, callback, capture || false);
        
        var output = new obsjs.disposable(function() {
			element.removeEventListener(event, callback, capture || false);
			callback = null;
        });
		
		this._caching.push(output);
		
		return output.dispose.bind(output);
    };
	
	//TODO: is this used?
	htmlPropertyValue.prototype.setData = function (element, name, data) {
		///<summary>When used by a wipeout html attribute (wo.htmlAttributes), set data against the html element. This is useful to pass data between html attributes</summary>	//TODM
        ///<param name="element" type="Element">The html element</param>
        ///<param name="name" type="String">The data key</param>
        ///<param name="data" type="Any">the data</param>
        ///<returns type="Any">The data</returns>
        
		this.primed();
		
		this._caching.push({
			dispose: function () {
				wipeout.utils.domData.clear(element, name);
			}
		});
		
		return wipeout.utils.domData.set(element, name, data);
	};
	
	//TODO: is this used?
	htmlPropertyValue.prototype.getData = function (element, name) {
		///<summary>Get data saved against a html element</summary>
        ///<param name="element" type="Element">the element</param>
        ///<param name="name" type="String">The data key</param>
        ///<returns type="Any">The data</returns>
		
		return wipeout.utils.domData.get(element, name);
	};
	
	//TODO: is this used?
	htmlPropertyValue.prototype.dataExists = function (element, name) {
		///<summary>Determine whether an element has a data key</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="name" type="String">The data key</param>
        ///<returns type="Boolean">The result</returns>
		
		return wipeout.utils.domData.exists(element, name);
	};
	
	return htmlPropertyValue;
});
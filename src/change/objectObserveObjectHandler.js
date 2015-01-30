
Class("wipeout.change.objectObserveObjectHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var objectObserveObjectHandler = wipeout.change.objectHandler.extend(function objectObserveObjectHandler (forObject) {
        
        this._super(forObject);

        this.__subscription = (function(changes) {
            enumerateArr(changes, function(change) {
                this.registerChange(change);
            }, this)
        }).bind(this);
        
        (this.forArray ? Array : Object).observe(forObject, this.__subscription);
    });
    
    objectObserveObjectHandler.prototype.disposeOfObserve = function (property, observeCallback, disposeCallback) {
        this.onNextPropertyChange(property, function (change) {
            observeCallback.changeValidator.afterLastChange(change, disposeCallback);
        });
    };
        
    objectObserveObjectHandler.prototype.onNextPropertyChange = function(property, callback) {
        var cb = (function (changes) {            
            for (var i = 0, ii = changes.length; i < ii; i++) {                
                if (wipeout.change.objectHandler.changeIsForThisProperty(property, changes[i])) {                    
                    (this.forArray ? Array : Object).unobserve(this.forObject, cb);
                    callback(changes[i]);
                    return;
                }
            }            
        }).bind(this);
        
        (this.forArray ? Array : Object).observe(this.forObject, cb);
    };
    
    objectObserveObjectHandler.prototype._observe = function (property, callback, callbackList, sortCallback) {
        
        var _this = this;
        this.onNextPropertyChange(property, function (change) {
            
            // subscription or observe handler were disposed of
            if (!_this || !_this.__subscription) {
                return;
            }

            callback.changeValidator.registerFirstChange(change);
            callbackList.push(callback);
            sortCallback();
        });
        
        return function () {
            // using _this as a flag
            _this = null;
        };
    };
    
    objectObserveObjectHandler.prototype.dispose = function() {
        
        this._super();
        
        if (this.__subscription) {
            (this.forArray ? Array : Object).unobserve(this.forObject, this.__subscription);
            delete this.__subscription;
        }
    }
    
    return objectObserveObjectHandler;
});
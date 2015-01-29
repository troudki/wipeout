
Class("wipeout.change.objectObserveObjectHandler", function () {
        
    var useObjectObserve = wipeout.base.watched.useObjectObserve;
    
    var objectObserveObjectHandler = wipeout.change.objectHandler.extend(function objectObserveObjectHandler (forObject) {
        
        this._super(forObject);
        
        this.registeredChanges = [];
        this.extraCallbacks = 0;

        this.__subscription = (function(changes) {
            if (this.extraCallbacks) return;
            this.registeredChanges.length = 0;

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
        
        var _this = this, tempSubscription = function (changes) {
            
            // was disposed of
            if (!_this.__subscription) {
                Object.unobserve(_this.forObject, tempSubscription);
                return;
            }
                        
            // has been disposed of, do nothing
            if (!_this) return;
                     
            var firstChangeDone = false;
            enumerateArr(changes, function(change) {
                
                if (!firstChangeDone && wipeout.change.objectHandler.changeIsForThisProperty(property, change)) {
                    Object.unobserve(_this.forObject, tempSubscription);
                    _this.extraCallbacks--;
                    firstChangeDone = true;
                    
                    callback.changeValidator.registerFirstChange(change);
                    callbackList.push(callback);
                    sortCallback();
                }
                
                // record change so that another subscription will not act on it
                if (_this.registeredChanges.indexOf(change) !== -1) return;
                _this.registeredChanges.push(change);
                
                _this.registerChange(change);
            }, _this);
        };
            
        (this.forArray ? Array : Object).observe(this.forObject, tempSubscription);     
        this.onNextPropertyChange(property, function (change) {
            
            _this.extraCallbacks--;
            
            // was disposed of
            if (!_this || _this.__subscription) {
                return;
            }

            callback.changeValidator.registerFirstChange(change);
            callbackList.push(callback);
            sortCallback();
            
            
            
            
            // was disposed of
            if (!_this.__subscription) {
                Object.unobserve(_this.forObject, tempSubscription);
                return;
            }
                        
            // has been disposed of, do nothing
            if (!_this) return;
                     
            var firstChangeDone = false;
            enumerateArr(changes, function(change) {
                
                if (!firstChangeDone && wipeout.change.objectHandler.changeIsForThisProperty(property, change)) {
                    Object.unobserve(_this.forObject, tempSubscription);
                    _this.extraCallbacks--;
                    firstChangeDone = true;
                    
                    callback.changeValidator.registerFirstChange(change);
                    callbackList.push(callback);
                    sortCallback();
                }
                
                // record change so that another subscription will not act on it
                if (_this.registeredChanges.indexOf(change) !== -1) return;
                _this.registeredChanges.push(change);
                
                _this.registerChange(change);
            }, _this);
        });
        this.extraCallbacks++;
        
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
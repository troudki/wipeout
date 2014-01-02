
var wpfko = wpfko || {};
wpfko.ko = wpfko.ko || {};
wpfko.ko.bindings = wpfko.ko.bindings || {};

(function () {
        
        var init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            return ko.bindingHandlers.template.init.call(this, element, wpfko.ko.bindings.render.utils.createValueAccessor(valueAccessor), allBindingsAccessor, valueAccessor(), bindingContext);
        };

        var update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var child = wpfko.util.ko.peek(valueAccessor());
            if ((viewModel && !(viewModel instanceof wpfko.base.visual)) || (child && !(child instanceof wpfko.base.visual)))
                throw "This binding can only be used to render a wo.visual within the context of a wo.visual";
            
            var _this = this;
            var templateChanged = function() {
                ko.bindingHandlers.template.update.call(_this, element, wpfko.ko.bindings.render.utils.createValueAccessor(valueAccessor), allBindingsAccessor, child, bindingContext);
            };

            if (child) {
                if (child._rootHtmlElement)
                    throw "This visual has already been rendered";
                
                ko.utils.domData.set(element, wpfko.ko.bindings.wpfko.utils.wpfkoKey, child);
                child._rootHtmlElement = element;
                if (viewModel) viewModel.renderedChildren.push(child);
                child.templateId.subscribe(templateChanged);
            }
            
            templateChanged();
        };
    
    var createValueAccessor = function(oldValueAccessor) {
        // ensure template id does not trigger another update
        // this will be handled within the binding
        return function () {
            var child = oldValueAccessor();
            var _child = ko.utils.unwrapObservable(child);
            return {
                name: _child ? _child.templateId.peek() : "",
                data: child || {},
                afterRender: _child ? wpfko.base.visual._afterRendered : undefined
            }
        };
    };
    
    wpfko.ko.bindings.render = {
        init: init,
        update: update,
        utils: {
            createValueAccessor: createValueAccessor
        }
    };
            
    ko.bindingHandlers.render = {};
    ko.virtualElements.allowedBindings.render = true;
    for(var i in wpfko.ko.bindings.render) {
        if(i !== "utils") {
            ko.bindingHandlers.render[i] = wpfko.ko.bindings.render[i];
        }
    };
    
    // backwards compatibility
    ko.bindingHandlers.renderChild = {
        init: ko.bindingHandlers.render.init,
        update: ko.bindingHandlers.render.update
    }
})();
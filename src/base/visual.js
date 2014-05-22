
Class("wipeout.base.visual", function () {
    
    var visual = wipeout.base.object.extend({
        constructor: function (templateId) {
            ///<summary>Base class for anything with a visual element. Interacts with the wipeout template engine to render content</summary>
            ///<param name="templateId" type="String" optional="true">A default template id</param>
            this._super();

            //Specifies whether this object should be used as a binding context. If false, the binding context of this object will be it's parent. 
            this.shareParentScope = this.constructor.shareParentScopeDefault;

            //Dictionary of items created within the current template. The items can be visuals or html elements
            this.templateItems = {};

            //The template of the visual, giving it an appearance
            this.templateId = ko.observable(templateId || visual.getDefaultTemplateId());

            //A bag to put objects needed for the lifecycle of this object and its properties
            this.__woBag = {
                disposables: {},
                createdByWipeout: false,
                rootHtmlElement: null,
                routedEventSubscriptions: []
            };
        },
        statics: {
            shareParentScopeDefault: false,
            //TODO: move to util
            getParentElement: function(node) {
                ///<summary>Gets the parent or virtual parent of the element</summary>
                ///<param name="node" type="HTMLNode" optional="false">The node to find the parent of</param>
                ///<returns type="HTMLNode">The parent element</returns>    

                var depth = 0;
                var current = node.previousSibling;
                while(current) {
                    if(wipeout.utils.ko.virtualElements.isVirtualClosing(current)) {
                        depth--;
                    }

                    if(wipeout.utils.ko.virtualElements.isVirtual(current)) {
                        if(depth === 0)
                            return current;

                        depth++;
                    }

                    current = current.previousSibling;
                }

                return node.parentNode;
            },
            getDefaultTemplateId: (function () {
                var templateId = null;
                return function () {
                    ///<summary>Returns the Id for the default template</summary>   
                    ///<returns type="String">The Id for an default template</returns>     
                    if (!templateId) {
                        templateId = wipeout.base.contentControl.createAnonymousTemplate("<span>No template has been specified</span>");
                    }

                    return templateId;
                };
            })(),
            getBlankTemplateId: (function () {
                var templateId = null;
                return function () {
                    ///<summary>Returns the Id for an empty template</summary>    
                    ///<returns type="String">The Id for an empty template</returns>    
                    if (!templateId) {
                        templateId = wipeout.base.contentControl.createAnonymousTemplate("");
                    }

                    return templateId;
                };
            })(),
            visualGraph: function (rootElement, displayFunction) {
                ///<summary>Compiles a tree of all visual elements in a block of html, starting at the rootElement</summary>    
                ///<param name="rootElement" type="HTMLNode" optional="false">The root node of the visual tree</param>
                ///<param name="displayFunction" type="Function" optional="true">A function to convert view models found into a custom type</param>
                ///<returns type="Array" generic0="Object">The visual graph</returns>

                if (!rootElement)
                    return [];

                displayFunction = displayFunction || function() { return typeof arguments[0]; };

                var output = [];
                wipeout.utils.obj.enumerate(wipeout.utils.html.getAllChildren(rootElement), function (child) {
                    wipeout.utils.obj.enumerate(visual.visualGraph(child), output.push, output);
                });

                var vm = ko.utils.domData.get(rootElement, wipeout.bindings.wipeout.utils.wipeoutKey);        
                if (vm) {
                    return [{ viewModel: vm, display: displayFunction(vm), children: output}];
                }

                return output;
            }
        },
        disposeOf: function(key) {
            ///<summary>Dispose of an item registered as a disposable</summary>
            ///<param name="key" type="String" optional="false">The key of the item to dispose</param>
            if(this.__woBag.disposables[key]) {
                this.__woBag.disposables[key]();
                delete this.__woBag.disposables[key];
            }
        },
        disposeOfAll: function() {
            ///<summary>Dispose of all items registered as a disposable</summary>
            for(var i in this.__woBag.disposables)
                this.disposeOf(i);
        },
        registerDisposable: (function() {
            var i = 0;
            return function(disposeFunction) {
                ///<summary>Register a dispose function which will be called when this object is disposed of.</summary>
                ///<param name="disposeFunction" type="Function" optional="false">The function to call when on dispose</param>
                ///<returns type="String">A key to dispose off this object manually</returns>

                if(!disposeFunction || disposeFunction.constructor !== Function) throw "The dispose function must be a Function";

                var id = (++i).toString();            
                this.__woBag.disposables[id] = disposeFunction;            
                return id;
            };
        })(),
        unTemplate: function() {
            ///<summary>Removes and disposes (if necessary) all of the children of the visual</summary>

            // delete all template items
            enumerate(this.templateItems, function(item, i) {            
                delete this.templateItems[i];
            }, this);

            if(this.__woBag.rootHtmlElement) {
                //IE does not have document.contains
                var doc = document.contains ? document : document.getElementsByTagName("body")[0];
                if(doc) {
                    if(doc.contains(this.__woBag.rootHtmlElement))
                        ko.virtualElements.emptyNode(this.__woBag.rootHtmlElement);
                    else
                        console.warn("Warning, could not dispose of html element correctly. This element has been manually moved from the DOM (not by knockout). This may cause memory leaks and unwanted event subscriptions");
                } else {
                    try {
                        ko.virtualElements.emptyNode(this.__woBag.rootHtmlElement);
                    } catch(e) {
                        console.warn("Warning, could not dispose of html element correctly. This element has been manually moved from the DOM (not by knockout). This may cause memory leaks and unwanted event subscriptions");
                    }
                }
            }
        },
        unRenderOrDispose: function() {
            ///<summary>Internal: do not use. un renders or disposes an object based on whether it was created by wipeopt or not</summary>
             
            this.__woBag.createdByWipeout ? this.dispose() : this.unRender();            
        },
        unRender: function() {
            ///<summary>Prepares a visual to be re-rendered</summary>

            this.onUnrender();

            this.unTemplate();

            if(this.__woBag.rootHtmlElement) {
                // disassociate the visual from its root element and empty the root element
                ko.utils.domData.set(this.__woBag.rootHtmlElement, wipeout.bindings.wipeout.utils.wipeoutKey, undefined); 
                delete this.__woBag.rootHtmlElement;
            }
        },
        dispose: function() {
            ///<summary>Dispose of this visual</summary>

            this.unRender();

            // dispose of any computeds
            for(var i in this)
                if(ko.isObservable(this[i]) && this[i].dispose instanceof Function)
                    this[i].dispose();

            // dispose of routed event subscriptions
            enumerate(this.__woBag.routedEventSubscriptions.splice(0, this.__woBag.routedEventSubscriptions.length), function(event) {
                event.dispose();
            });
        },
        getParents: function() {
            ///<summary>Gets an array of the entire tree of ancestor visual objects</summary>
            ///<returns type="Array" generic0="wo.view" arrayType="wo.view">A tree of ancestor view models</returns>
            var current = this;
            var parents = [];
            while(current) {
                parents.push(current);
                current = current.getParent();
            }

            return parents;
        },
        getParent: function() {
            ///<summary>Get the parent visual of this visual</summary>
            ///<returns type="wo.view">The parent view model</returns>
            if(this.__woBag.rootHtmlElement == null)
                return null;

            var nextTarget;
            var current = visual.getParentElement(this.__woBag.rootHtmlElement);
            while(current) {
                if(nextTarget = ko.utils.domData.get(current, wipeout.bindings.wipeout.utils.wipeoutKey)) {
                    return nextTarget;
                }

                current = visual.getParentElement(current);
            }
        },
        unRegisterRoutedEvent: function(routedEvent, callback, callbackContext /* optional */) {  
            ///<summary>Unregister from a routed event. The callback and callback context must be the same as those passed in during registration</summary>  
            ///<param name="callback" type="Function" optional="false">The callback to un-register</param>
            ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to un register from</param>
            ///<param name="callbackContext" type="Any" optional="true">The original context passed into the register function</param>
            ///<returns type="Boolean">Whether the event registration was found or not</returns>         

            for(var i = 0, ii = this.__woBag.routedEventSubscriptions.length; i < ii; i++) {
                if(this.__woBag.routedEventSubscriptions[i].routedEvent === routedEvent) {
                    this.__woBag.routedEventSubscriptions[i].event.unRegister(callback, callbackContext);
                    return true;
                }
            }  

            return false;
        },
        registerRoutedEvent: function(routedEvent, callback, callbackContext /* optional */) {
            ///<summary>Register for a routed event</summary>   
            ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
            ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
            ///<param name="callbackContext" type="Any" optional="true">The context "this" to use within the callback</param>
            ///<returns type="wo.eventRegistration">A dispose function</returns>         

            var rev;
            for(var i = 0, ii = this.__woBag.routedEventSubscriptions.length; i < ii; i++) {
                if(this.__woBag.routedEventSubscriptions[i].routedEvent === routedEvent) {
                    rev = this.__woBag.routedEventSubscriptions[i];
                    break;
                }
            }

            if(!rev) {
                rev = new wipeout.base.routedEventRegistration(routedEvent);
                this.__woBag.routedEventSubscriptions.push(rev);
            }

            return rev.event.register(callback, callbackContext);
        },
        triggerRoutedEvent: function(routedEvent, eventArgs) {
            ///<summary>Trigger a routed event. The event will bubble upwards to all ancestors of this visual. Overrides wo.object.triggerRoutedEvent</summary>        
            ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
            ///<param name="eventArgs" type="Any" optional="true">The event args to bubble up with the routed event</param>
            if(!(eventArgs instanceof wipeout.base.routedEventArgs)) {
                eventArgs = new wipeout.base.routedEventArgs(eventArgs, this);
            }

            for(var i = 0, ii = this.__woBag.routedEventSubscriptions.length; i < ii; i++) {
                if(eventArgs.handled) return;
                if(this.__woBag.routedEventSubscriptions[i].routedEvent === routedEvent) {
                    this.__woBag.routedEventSubscriptions[i].event.trigger(eventArgs);
                }
            }

            if(!eventArgs.handled) {
                var nextTarget = this.getParent();
                if(nextTarget) {
                    nextTarget.triggerRoutedEvent(routedEvent, eventArgs);
                }
            }
        },
        onRendered: function (oldValues, newValues) {
            ///<summary>Triggered each time after a template is rendered</summary>   
            ///<param name="oldValues" type="Array" generic0="HTMLNode" optional="false">A list of HTMLNodes removed</param>
            ///<param name="newValues" type="Array" generic0="HTMLNode" optional="false">A list of HTMLNodes rendered</param>
        },
        // virtual
        onUnrender: function () {
            ///<summary>Triggered just before a visual is un rendered</summary>    
        },
        // virtual
        onApplicationInitialized: function () {
            ///<summary>Triggered after the entire application has been initialized. Will only be triggered on the viewModel created directly by the wipeout binding</summary>    
        }
    }, "visual");
    
    // list of html tags which will not be treated as objects
    var reservedTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "head", "header", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
    
    visual.reservedTags = {};
    enumerate(reservedTags, function(tag) {
        visual.reservedTags[tag] = true;
    });
    
    return visual;
});
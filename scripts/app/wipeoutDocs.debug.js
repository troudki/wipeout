(function () { window.Wipeout = {};
Wipeout.compiler = (function () {
    
    var innerCompiler = function(classes, baseClasses) {        
        this.classes = [];
        for(var i = 0, ii = classes.length; i < ii; i++)
            this.classes.push(classes[i]);
        
        this.compiled = [];
        for(var i = 0, ii = baseClasses.length; i < ii; i++) {
            this.compiled.push({
                name: baseClasses[i],
                value: get(baseClasses[i])
            });
        }
    };
    
    function get(namespacedObject) {
        var current = window;
        namespacedObject = namespacedObject.split(".");
        for(var i = 0, ii = namespacedObject.length; i < ii; i++) {
            current = current[namespacedObject[i]];
        }
        
        return current;
    }
    
    innerCompiler.prototype.checkDependency = function(dependency) {
        for(var i = 0, ii = this.compiled.length; i < ii; i++) {
            if(this.compiled[i].name === dependency)
                return true;
        }
        
        return false;        
    };
    
    innerCompiler.prototype.getClass = function(className) {
        for(var i = 0, ii = this.compiled.length; i < ii; i++) {
            if(this.compiled[i].name === className)
                return this.compiled[i].value;
        }
        
        return null;
    };
    
    innerCompiler.prototype.checkDependencies = function(dependencies) {
        for(var i = 0, ii = dependencies.length; i < ii; i++) {
            if(!this.checkDependency(dependencies[i]))
                return false;
        }
        
        return true;
    };
        
    innerCompiler.prototype.compile = function() {        
        while (this.classes.length) {
            var length = this.classes.length;
            
            for(var i = 0; i < this.classes.length; i++) {
                if(this.checkDependencies(this.classes[i].dependencies)) {
                    var className = this.classes[i].className;
                    if(className.indexOf(".") !== -1)
                        className = className.substr(className.lastIndexOf(".") + 1);
                    
                    var newClass = this.classes[i].constructor();
                    var statics = {};
                    for (var j in newClass)
                        statics[j] = newClass[j];
                    
                    var proto = newClass.prototype;
                    newClass = this.getClass(this.classes[i].parentClass).extend(newClass, className);
                    for(j in proto)
                        newClass.prototype[j] = proto[j];
                    for(j in statics)
                        newClass[j] = statics[j];
                    
                    this.compiled.push({
                        name: this.classes[i].className,
                        value: newClass
                    });
                    this.classes.splice(i, 1);
                    i--;
                }
            }    
            
            if(length === this.classes.length) {
                throw {
                    message: "Cannot compile remainig classes. They all have dependencies not registered with this constructor",
                    classes: this.classes
                };
            }
        }
    }
        
    function compiler(rootNamespace, baseClass, dependencies) {
        this.rootNamespace = rootNamespace;
        this.baseClass = baseClass;
        this.dependencies = dependencies || [];
        this.classes = [];
    };
    
    compiler.prototype.namespaceCorrectly = function(itemFullName) {
        if(this.rootNamespace && itemFullName && itemFullName.indexOf(this.rootNamespace + ".") === 0) {
            itemFullName = itemFullName.substr(this.rootNamespace.length + 1);        
        }
        
        return itemFullName;
    };
    
    compiler.prototype.registerClass = function(className, parentClass, buildConstructorFunction /* any extra arguments are counted as dependencies */) {      
        
        var parentClass = !parentClass || parentClass === this.baseClass ? this.baseClass : this.namespaceCorrectly(parentClass);
        
        var theClass = {
            className: this.namespaceCorrectly(className),
            constructor: buildConstructorFunction,
            parentClass: parentClass,
            dependencies: [parentClass]
        };
        
        for(var i = 0, ii = this.classes.length; i < ii; i++)
            if(this.classes[i].className === theClass.className)
                throw "There is already a class named " + className;
        
        for(i = 3, ii = arguments.length; i < ii; i++)
            theClass.dependencies.push(this.namespaceCorrectly(arguments[i]));
        
        this.classes.push(theClass);
    };
    
    compiler.append = function(append, to) {
        var name = append.name.split(".");
        for(var i = 0, ii = name.length - 1; i < ii; i++)
            to = to[name[i]] = to[name[i]] || {};
        
        to[name[i]] = append.value;
    }
       
    compiler.prototype.compile = function(root /* optional */) {
        root = root || {};
        
        var baseClasses = [this.baseClass];
        for(var i = 0, ii = this.dependencies.length; i < ii; i++) {
            baseClasses.push(this.dependencies[i]);
        }
        
        var ic = new innerCompiler(this.classes, baseClasses);
        ic.compile();
        
        // skip base class
        for(i = 1, ii = ic.compiled.length; i < ii; i++)
            compiler.append(ic.compiled[i], root);
        
        return root;
    };        
    
    return compiler;
    
})();

var compiler = new Wipeout.compiler("Wipeout", "wo.object", [
    "wo.visual", "wo.view", "wo.contentControl", "wo.itemsControl", "wo.if"
]);


    var enumerate = function(enumerate, callback, context) {
        context = context || window;
        
        if(enumerate)
            for(var i = 0, ii = enumerate.length; i < ii; i++)
                callback.call(context, enumerate[i], i);
    };
    
    var get = function(item, root) {
        
        var current = root || window;
        enumerate(item.split("."), function(item) {
            current = current[item];
        });
        
        return current;
    };

(function () { window.Wipeout = {};
Wipeout.compiler = (function () {
    
    var innerCompiler = function(classes, baseClasses) {        
        this.classes = [];
        for(var i = 0, ii = classes.length; i < ii; i++)
            this.classes.push(classes[i]);
        
        this.compiled = [];
        for(var i = 0, ii = baseClasses.length; i < ii; i++) {
            this.compiled.push({
                name: baseClasses[i],
                value: get(baseClasses[i])
            });
        }
    };
    
    function get(namespacedObject) {
        var current = window;
        namespacedObject = namespacedObject.split(".");
        for(var i = 0, ii = namespacedObject.length; i < ii; i++) {
            current = current[namespacedObject[i]];
        }
        
        return current;
    }
    
    innerCompiler.prototype.checkDependency = function(dependency) {
        for(var i = 0, ii = this.compiled.length; i < ii; i++) {
            if(this.compiled[i].name === dependency)
                return true;
        }
        
        return false;        
    };
    
    innerCompiler.prototype.getClass = function(className) {
        for(var i = 0, ii = this.compiled.length; i < ii; i++) {
            if(this.compiled[i].name === className)
                return this.compiled[i].value;
        }
        
        return null;
    };
    
    innerCompiler.prototype.checkDependencies = function(dependencies) {
        for(var i = 0, ii = dependencies.length; i < ii; i++) {
            if(!this.checkDependency(dependencies[i]))
                return false;
        }
        
        return true;
    };
        
    innerCompiler.prototype.compile = function() {        
        while (this.classes.length) {
            var length = this.classes.length;
            
            for(var i = 0; i < this.classes.length; i++) {
                if(this.checkDependencies(this.classes[i].dependencies)) {
                    var className = this.classes[i].className;
                    if(className.indexOf(".") !== -1)
                        className = className.substr(className.lastIndexOf(".") + 1);
                    
                    var newClass = this.classes[i].constructor();
                    var statics = {};
                    for (var j in newClass)
                        statics[j] = newClass[j];
                    
                    var proto = newClass.prototype;
                    newClass = this.getClass(this.classes[i].parentClass).extend(newClass, className);
                    for(j in proto)
                        newClass.prototype[j] = proto[j];
                    for(j in statics)
                        newClass[j] = statics[j];
                    
                    this.compiled.push({
                        name: this.classes[i].className,
                        value: newClass
                    });
                    this.classes.splice(i, 1);
                    i--;
                }
            }    
            
            if(length === this.classes.length) {
                throw {
                    message: "Cannot compile remainig classes. They all have dependencies not registered with this constructor",
                    classes: this.classes
                };
            }
        }
    }
        
    function compiler(rootNamespace, baseClass, dependencies) {
        this.rootNamespace = rootNamespace;
        this.baseClass = baseClass;
        this.dependencies = dependencies || [];
        this.classes = [];
    };
    
    compiler.prototype.namespaceCorrectly = function(itemFullName) {
        if(this.rootNamespace && itemFullName && itemFullName.indexOf(this.rootNamespace + ".") === 0) {
            itemFullName = itemFullName.substr(this.rootNamespace.length + 1);        
        }
        
        return itemFullName;
    };
    
    compiler.prototype.registerClass = function(className, parentClass, buildConstructorFunction /* any extra arguments are counted as dependencies */) {      
        
        var parentClass = !parentClass || parentClass === this.baseClass ? this.baseClass : this.namespaceCorrectly(parentClass);
        
        var theClass = {
            className: this.namespaceCorrectly(className),
            constructor: buildConstructorFunction,
            parentClass: parentClass,
            dependencies: [parentClass]
        };
        
        for(var i = 0, ii = this.classes.length; i < ii; i++)
            if(this.classes[i].className === theClass.className)
                throw "There is already a class named " + className;
        
        for(i = 3, ii = arguments.length; i < ii; i++)
            theClass.dependencies.push(this.namespaceCorrectly(arguments[i]));
        
        this.classes.push(theClass);
    };
    
    compiler.append = function(append, to) {
        var name = append.name.split(".");
        for(var i = 0, ii = name.length - 1; i < ii; i++)
            to = to[name[i]] = to[name[i]] || {};
        
        to[name[i]] = append.value;
    }
       
    compiler.prototype.compile = function(root /* optional */) {
        root = root || {};
        
        var baseClasses = [this.baseClass];
        for(var i = 0, ii = this.dependencies.length; i < ii; i++) {
            baseClasses.push(this.dependencies[i]);
        }
        
        var ic = new innerCompiler(this.classes, baseClasses);
        ic.compile();
        
        // skip base class
        for(i = 1, ii = ic.compiled.length; i < ii; i++)
            compiler.append(ic.compiled[i], root);
        
        return root;
    };        
    
    return compiler;
    
})();

var compiler = new Wipeout.compiler("Wipeout", "wo.object", [
    "wo.visual", "wo.view", "wo.contentControl", "wo.itemsControl", "wo.if"
]);


    var enumerate = function(enumerate, callback, context) {
        context = context || window;
        
        if(enumerate)
            for(var i = 0, ii = enumerate.length; i < ii; i++)
                callback.call(context, enumerate[i], i);
    };
    
    var get = function(item, root) {
        
        var current = root || window;
        enumerate(item.split("."), function(item) {
            current = current[item];
        });
        
        return current;
    };

(function () { window.Wipeout = {};
Wipeout.compiler = (function () {
    
    var innerCompiler = function(classes, baseClasses) {        
        this.classes = [];
        for(var i = 0, ii = classes.length; i < ii; i++)
            this.classes.push(classes[i]);
        
        this.compiled = [];
        for(var i = 0, ii = baseClasses.length; i < ii; i++) {
            this.compiled.push({
                name: baseClasses[i],
                value: get(baseClasses[i])
            });
        }
    };
    
    function get(namespacedObject) {
        var current = window;
        namespacedObject = namespacedObject.split(".");
        for(var i = 0, ii = namespacedObject.length; i < ii; i++) {
            current = current[namespacedObject[i]];
        }
        
        return current;
    }
    
    innerCompiler.prototype.checkDependency = function(dependency) {
        for(var i = 0, ii = this.compiled.length; i < ii; i++) {
            if(this.compiled[i].name === dependency)
                return true;
        }
        
        return false;        
    };
    
    innerCompiler.prototype.getClass = function(className) {
        for(var i = 0, ii = this.compiled.length; i < ii; i++) {
            if(this.compiled[i].name === className)
                return this.compiled[i].value;
        }
        
        return null;
    };
    
    innerCompiler.prototype.checkDependencies = function(dependencies) {
        for(var i = 0, ii = dependencies.length; i < ii; i++) {
            if(!this.checkDependency(dependencies[i]))
                return false;
        }
        
        return true;
    };
        
    innerCompiler.prototype.compile = function() {        
        while (this.classes.length) {
            var length = this.classes.length;
            
            for(var i = 0; i < this.classes.length; i++) {
                if(this.checkDependencies(this.classes[i].dependencies)) {
                    var className = this.classes[i].className;
                    if(className.indexOf(".") !== -1)
                        className = className.substr(className.lastIndexOf(".") + 1);
                    
                    var newClass = this.classes[i].constructor();
                    var statics = {};
                    for (var j in newClass)
                        statics[j] = newClass[j];
                    
                    var proto = newClass.prototype;
                    newClass = this.getClass(this.classes[i].parentClass).extend(newClass, className);
                    for(j in proto)
                        newClass.prototype[j] = proto[j];
                    for(j in statics)
                        newClass[j] = statics[j];
                    
                    this.compiled.push({
                        name: this.classes[i].className,
                        value: newClass
                    });
                    this.classes.splice(i, 1);
                    i--;
                }
            }    
            
            if(length === this.classes.length) {
                throw {
                    message: "Cannot compile remainig classes. They all have dependencies not registered with this constructor",
                    classes: this.classes
                };
            }
        }
    }
        
    function compiler(rootNamespace, baseClass, dependencies) {
        this.rootNamespace = rootNamespace;
        this.baseClass = baseClass;
        this.dependencies = dependencies || [];
        this.classes = [];
    };
    
    compiler.prototype.namespaceCorrectly = function(itemFullName) {
        if(this.rootNamespace && itemFullName && itemFullName.indexOf(this.rootNamespace + ".") === 0) {
            itemFullName = itemFullName.substr(this.rootNamespace.length + 1);        
        }
        
        return itemFullName;
    };
    
    compiler.prototype.registerClass = function(className, parentClass, buildConstructorFunction /* any extra arguments are counted as dependencies */) {      
        
        var parentClass = !parentClass || parentClass === this.baseClass ? this.baseClass : this.namespaceCorrectly(parentClass);
        
        var theClass = {
            className: this.namespaceCorrectly(className),
            constructor: buildConstructorFunction,
            parentClass: parentClass,
            dependencies: [parentClass]
        };
        
        for(var i = 0, ii = this.classes.length; i < ii; i++)
            if(this.classes[i].className === theClass.className)
                throw "There is already a class named " + className;
        
        for(i = 3, ii = arguments.length; i < ii; i++)
            theClass.dependencies.push(this.namespaceCorrectly(arguments[i]));
        
        this.classes.push(theClass);
    };
    
    compiler.append = function(append, to) {
        var name = append.name.split(".");
        for(var i = 0, ii = name.length - 1; i < ii; i++)
            to = to[name[i]] = to[name[i]] || {};
        
        to[name[i]] = append.value;
    }
       
    compiler.prototype.compile = function(root /* optional */) {
        root = root || {};
        
        var baseClasses = [this.baseClass];
        for(var i = 0, ii = this.dependencies.length; i < ii; i++) {
            baseClasses.push(this.dependencies[i]);
        }
        
        var ic = new innerCompiler(this.classes, baseClasses);
        ic.compile();
        
        // skip base class
        for(i = 1, ii = ic.compiled.length; i < ii; i++)
            compiler.append(ic.compiled[i], root);
        
        return root;
    };        
    
    return compiler;
    
})();

var compiler = new Wipeout.compiler("Wipeout", "wo.object", [
    "wo.visual", "wo.view", "wo.contentControl", "wo.itemsControl", "wo.if"
]);


window.NS = function(namespace) {
    
    namespace = namespace.split(".");
    var current = window;
    for(var i = 0, ii = namespace.length; i < ii; i++) {
        current = current[namespace[i]] || (current[namespace[i]] = {});
    }
    
    return current;
};

window.vmChooser = function(model) {
    model = ko.unwrap(model);
    
    if(model == null) return null;
    
    throw "Unknown model type";
};


compiler.registerClass("Wipeout.Docs.ViewModels.Application", "wo.view", function() {
    
    function application() {
        this._super("Wipeout.Docs.ViewModels.Application");
        
        this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage, function (args) {
            this.model().content(args.data);
        }, this);
    };
    
    application.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        
        //TODO: this
        this.templateItems.treeView.select();
    };
    
    return application;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock", "wo.view", function() {
    var codeBlock = function(templateId) {
        this._super(templateId || "Wipeout.Docs.ViewModels.Components.CodeBlock");        
        this.code = ko.observable();
        
        this.code.subscribe(this.onCodeChanged, this);
    };
    
    codeBlock.prototype.onCodeChanged = function(newVal) {
    };
    
    codeBlock.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        prettyPrint(null, this.templateItems.codeBlock);
    };
    
    return codeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender", "wo.contentControl", function() {
    var dynamicRender = function() {
        this._super();
        
        this.content = ko.observable();
        
        this.template("<!-- ko render: content --><!-- /ko -->");
    };
    
    dynamicRender.prototype.onModelChanged = function(oldVal, newVal) {
        this._super(oldVal, newVal);
               
        var oldVal = this.content();
        
        if(newVal == null) {
            this.content(null);
        } else {
            var newVm = null;
            if(newVal instanceof Wipeout.Docs.Models.Pages.LandingPage) {
                newVm = new Wipeout.Docs.ViewModels.Pages.LandingPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Class) {
                newVm = new Wipeout.Docs.ViewModels.Pages.ClassPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Event) {
                newVm = new Wipeout.Docs.ViewModels.Pages.EventPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Property) {
                newVm = new Wipeout.Docs.ViewModels.Pages.PropertyPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Function) {
                newVm = new Wipeout.Docs.ViewModels.Pages.FunctionPage();
            } else {
                throw "Unknown model type";
            }
            
            newVm.model(newVal);
            this.content(newVm);
        }
    };  
    
    return dynamicRender
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function () {
    var jsCodeBlock = function() {
        this._super.apply(this, arguments);
    };
    
    jsCodeBlock.prototype.onCodeChanged = function(newVal) {  
        new Function(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"))();
    };

    return jsCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function() {
    var templateCodeBlock = function() {
        templateCodeBlock.staticConstructor();
        this._super.apply(this, arguments);
    };
    
    var templateDiv;
    templateCodeBlock.staticConstructor = function() {
        if(templateDiv) return;
        
        templateDiv = document.createElement("div");
        templateDiv.setAttribute("style", "display: none");
        document.getElementsByTagName("body")[0].appendChild(templateDiv);
    };
    
    templateCodeBlock.prototype.onCodeChanged = function(newVal) {  
        templateDiv.innerHTML += newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&gt;/g, ">");
    };
    
    return templateCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch", "wo.view", function() {
    var treeViewBranch = function() {
        this._super(treeViewBranch.nullTemplate);  
    };
    
    treeViewBranch.branchTemplate = "Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";
    treeViewBranch.leafTemplate = "Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";
    treeViewBranch.nullTemplate = wo.visual.getBlankTemplateId();
    
    treeViewBranch.prototype.onModelChanged = function(oldVal, newVal) {  
        this._super(oldVal, newVal);
        if(newVal && (newVal.branches || newVal.payload())) {
            this.templateId(treeViewBranch.branchTemplate);
        } else if(newVal) {
            this.templateId(treeViewBranch.leafTemplate);
        } else {
            this.templateId(treeViewBranch.nullTemplate);
        }
    };
    
    treeViewBranch.prototype.select = function() {
        if(this.model().branches)
            $(this.templateItems.content).toggle();
        
        var payload = this.model().payload();
        if ($(this.templateItems.content).filter(":visible").length && payload) {
            this.triggerRoutedEvent(treeViewBranch.renderPage, payload);
        }
    };
    
    treeViewBranch.renderPage = new wo.routedEvent(); 
    
    return treeViewBranch;
});


compiler.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function() {
    var usageCodeBlock = function() {
        this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");
        
        this.usage = ko.observable();
    };
    
    usageCodeBlock.prototype.onCodeChanged = function(newVal) {  
        this.usage(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"));
    };
    
    return usageCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable", "wo.itemsControl", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable", "Wipeout.Docs.ViewModels.Pages.ClassItemRow");
    };
});


    compiler.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage", "wo.view", function() {
        var classPage = function() {
            this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");

            this.usagesTemplateId = ko.computed(function() {
                if(this.model()) {
                    var className = this.model().classFullName + classPage.classUsagesTemplateSuffix;
                    if(document.getElementById(className))
                        return className;
                }

                return wo.contentControl.getBlankTemplateId();
            }, this);
        };

        classPage.classUsagesTemplateSuffix = "_ClassUsages";
        
        return classPage;
    });

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage");
    };
});


compiler.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.LandingPage");
    };
});

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage");
    };
});

compiler.registerClass("Wipeout.Docs.Models.Application", "wo.object", function() {
    
    return function() {
        
        this.content = ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());
        
        var currentApi = new Wipeout.Docs.Models.Components.Api();
                
        //wo
        var _wo = (function() {
            var objectBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object", currentApi.forClass("wo.object"));
            var routedEventModelBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel", currentApi.forClass("wo.routedEventModel"));
            var visualBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual", currentApi.forClass("wo.visual"));
            var viewBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view", currentApi.forClass("wo.view"));
            var contentControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl", currentApi.forClass("wo.contentControl"));
            var ifBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if", currentApi.forClass("wo.if"));
            var itemsControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wo.itemsControl"));
            var eventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event", currentApi.forClass("wo.event"));
            var routedEventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent", currentApi.forClass("wo.routedEvent"));
            var routedEventArgsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs", currentApi.forClass("wo.routedEventArgs"));
            var routedEventRegistrationBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration", currentApi.forClass("wo.routedEventRegistration"));
            
            var htmlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html", currentApi.forClass("wo.html"));
            var koVirtualElementsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements", currentApi.forClass("wo.ko.virtualElements"));
            var koArrayBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array", currentApi.forClass("wipeout.utils.ko.array"));
            var koBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko", currentApi.forClass("wo.ko"), {staticProperties: {"virtualElements": koVirtualElementsBranch, "array": koArrayBranch}});
            var objBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj", currentApi.forClass("wo.obj"));
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("wo", [
                contentControlBranch,
                eventBranch,
                ifBranch,
                htmlBranch,
                itemsControlBranch,
                koBranch,
                objBranch,
                objectBranch,
                routedEventBranch,
                routedEventArgsBranch,
                routedEventModelBranch,
                routedEventRegistrationBranch,
                viewBranch,
                visualBranch
            ]);
        })();
        
        // bindings
        var _bindings = (function() {
            
            var itemsControl = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wipeout.bindings.itemsControl"));
            var render = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render", currentApi.forClass("wipeout.bindings.render"));
            var wipeout_type = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type", currentApi.forClass("wipeout.bindings.wipeout-type"));
            var _wo = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo", currentApi.forClass("wipeout.bindings.wo"));
            var _wipeout = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout", currentApi.forClass("wipeout.bindings.wipeout"));
            var _icRender = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render", currentApi.forClass("wipeout.bindings.ic-render"));
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings", [
                _icRender,
                itemsControl,
                render,
                wipeout_type,
                _wo,
                _wipeout
            ]);
        })();
                                     
        //wipeout
        var _wipeout = (function() {
            
            var _base = (function() {
                var objectBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object", currentApi.forClass("wo.object"));
                var routedEventModelBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel", currentApi.forClass("wo.routedEventModel"));
                var visualBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual", currentApi.forClass("wo.visual"));
                var viewBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view", currentApi.forClass("wo.view"));
                var contentControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl", currentApi.forClass("wo.contentControl"));
                var ifBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if", currentApi.forClass("wo.if"));
                var itemsControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wo.itemsControl"));
                var eventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event", currentApi.forClass("wo.event"));
                var routedEventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent", currentApi.forClass("wo.routedEvent"));
                var routedEventArgsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs", currentApi.forClass("wo.routedEventArgs"));
                var routedEventRegistrationBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration", currentApi.forClass("wo.routedEventRegistration"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("base", [
                    contentControlBranch,
                    eventBranch,
                    ifBranch,
                    itemsControlBranch,
                    objectBranch,
                    routedEventBranch,
                    routedEventArgsBranch,
                    routedEventModelBranch,
                    routedEventRegistrationBranch,
                    viewBranch,
                    visualBranch
                ]);
            })();
            
            var _bindings = (function() {
                
                var itemsControl = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wipeout.bindings.itemsControl"));
                var render = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render", currentApi.forClass("wipeout.bindings.render"));
                var wipeout_type = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type", currentApi.forClass("wipeout.bindings.wipeout-type"));
                var _wo = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo", currentApi.forClass("wipeout.bindings.wo"));
                var _wipeout = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout", currentApi.forClass("wipeout.bindings.wipeout"));
                var _icRender = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render", currentApi.forClass("wipeout.bindings.ic-render"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings", [
                    _icRender,
                    itemsControl,
                    render,
                    wipeout_type,
                    _wo,
                    _wipeout
                ]);
            })();
            
            var _template = (function() {
                currentApi.forClass("ko.templateEngine");
                var engine = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine", currentApi.forClass("wipeout.template.engine"));
                var htmlBuilder = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder", currentApi.forClass("wipeout.template.htmlBuilder"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("template", [
                    engine,
                    htmlBuilder
                ]);
            })();
            
            var _utils = (function() {
                
                var htmlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html", currentApi.forClass("wipeout.utils.html"));
                var koVirtualElementsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements", currentApi.forClass("wipeout.utils.ko.virtualElements"));
                var koArrayBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array", currentApi.forClass("wipeout.utils.ko.array"));
                var koBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko", currentApi.forClass("wipeout.utils.ko"), {staticProperties: {"virtualElements": koVirtualElementsBranch, "array": koArrayBranch}});
                var objBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj", currentApi.forClass("wipeout.utils.obj"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("utils", [
                    htmlBranch,
                    koBranch,
                    objBranch
                ]);
            })();
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)", [
                _base,
                _bindings,
                _template,
                _utils
            ]);
        })();
        
        this.menu =
            new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout", [
                new Wipeout.Docs.Models.Components.TreeViewBranch("API", [
                    _wo,
                    _bindings,
                    _wipeout
                ])
        ]);        
    };
});


    var enumerate = function(enumerate, callback, context) {
        context = context || window;
        
        if(enumerate)
            for(var i = 0, ii = enumerate.length; i < ii; i++)
                callback.call(context, enumerate[i], i);
    };
    
    var get = function(item, root) {
        
        var current = root || window;
        enumerate(item.split("."), function(item) {
            current = current[item];
        });
        
        return current;
    };

compiler.registerClass("Wipeout.Docs.Models.Components.Api", "wo.object", function() {    
    
    var api = function(rootNamespace) {
        this._super();
        
        this.classes = [];
    };
    
    api.prototype.getClassDescription = function(classConstructor) {
        for(var i = 0, ii = this.classes.length; i < ii; i++)            
            if(this.classes[i].classConstructor === classConstructor)
                return this.classes[i].classDescription;
    };
    
    api.prototype.forClass = function(className) {
        
        var classConstructor = get(className);
        var result = this.getClassDescription(classConstructor);
        if(result)
            return result;
        
        var desc = new Wipeout.Docs.Models.Descriptions.Class(className, this);
        this.classes.push({
            classDescription: desc,
            classConstructor: classConstructor
        });
        
        return desc;
    };
    
    return api;
});

compiler.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch", "Wipeout.Docs.Models.Components.PageTreeViewBranch", function() {
    var classTreeViewBranch = function(name, classDescription, customBranches) {
        this._super(name, classDescription, classTreeViewBranch.compileBranches(classDescription, customBranches));
    };
    
    classTreeViewBranch.compileBranches = function(classDescription, customBranches /*optional*/) {
        var output = [];
        
        customBranches = customBranches || {};
        customBranches.staticEvents = customBranches.staticEvents || {};
        customBranches.staticProperties = customBranches.staticProperties || {};
        customBranches.staticFunctions = customBranches.staticFunctions || {};
        customBranches.events = customBranches.events || {};
        customBranches.properties = customBranches.properties || {};
        customBranches.functions = customBranches.functions || {};
        
        output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));    
        
        enumerate(classDescription.staticEvents, function(event) {
            if(customBranches.staticEvents[event.eventName])
                output.push(customBranches.staticEvents[event.eventName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(event.eventName, null));            
        });
        
        enumerate(classDescription.staticProperties, function(property) {
            if(customBranches.staticProperties[property.propertyName])
                output.push(customBranches.staticProperties[property.propertyName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(property.propertyName, null));
        });
        
        enumerate(classDescription.staticFunctions, function(_function) {
            if(customBranches.staticFunctions[_function.functionName])
                output.push(customBranches.staticFunctions[_function.functionName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(_function.functionName, null));            
        });
        
        enumerate(classDescription.events, function(event) {
            if(customBranches.events[event.eventName])
                output.push(customBranches.events[event.eventName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(event.eventName, null));            
        });
        
        enumerate(classDescription.properties, function(property) {
            if(customBranches.staticProperties[property.propertyName])
                output.push(customBranches.staticProperties[property.propertyName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(property.propertyName, null));            
        });
        
        enumerate(classDescription.functions, function(_function) {
            if(customBranches.functions[_function.functionName])
                output.push(customBranches.functions[_function.functionName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(_function.functionName, null));            
        });
        
        output.sort(function() { return arguments[0].name === "constructor" ? -1 : arguments[0].name.localeCompare(arguments[1].name); });
        return output;
    };
    
    return classTreeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch", "Wipeout.Docs.Models.Components.TreeViewBranch", function() {
    var pageTreeViewBranch = function(name, page, branches) {
        this._super(name, branches);
            
        this.page = page;
    };
    
    pageTreeViewBranch.prototype.payload = function() {
        return this.page;
    };
    
    return pageTreeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch", "wo.object", function() {
    var treeViewBranch = function(name, branches) {
        this._super();
            
        this.name = name;
        this.branches = branches;
    };
    
    treeViewBranch.prototype.payload = function() {
        return null;
    };
    
    return treeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Class", "wo.object", function() {
    var classDescription = function(classFullName, api) {
        this._super();
        
        this.className = classDescription.getClassName(classFullName);
        this.constructorFunction = get(classFullName);
        this.classFullName = classFullName;
        this.api = api;
        
        this.classConstructor = null;
        this.events = [];
        this.staticEvents = [];
        this.properties = [];
        this.staticProperties = [];
        this.functions = [];
        this.staticFunctions = [];
        
        this.rebuild();
    };
    
    classDescription.getClassName = function(classFullName) {
        classFullName = classFullName.split(".");
        return classFullName[classFullName.length - 1];
    };
    
    classDescription.prototype.rebuild = function() {
        this.classConstructor = null;
        this.events.length = 0;
        this.staticEvents.length = 0;
        this.properties.length = 0;
        this.staticProperties.length = 0;
        this.functions.length = 0;
        this.staticFunctions.length = 0;
                
        for(var i in this.constructorFunction) {
            if(this.constructorFunction.hasOwnProperty(i)) {
                if(this.constructorFunction[i] instanceof wo.event) {
                    this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                } else if(this.constructorFunction[i] instanceof Function && !ko.isObservable(this.constructorFunction[i])) {
                    this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[i], i, this.classFullName));
                } else {
                    this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                }
            }
        }
        
        for(var i in this.constructorFunction.prototype) {
            if(this.constructorFunction.prototype.hasOwnProperty(i)) {                    
                if(this.constructorFunction.prototype[i] instanceof wo.event) { 
                    this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                } else if(this.constructorFunction.prototype[i] instanceof Function && !ko.isObservable(this.constructorFunction.prototype[i])) {
                    this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[i], i, this.classFullName));
                } else {
                    this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                }
            }
        }
        
        if(this.constructorFunction.constructor === Function) {
            var anInstance = new this.constructorFunction();        
            for(var i in anInstance) {
                if(anInstance.hasOwnProperty(i)) {                    
                    if(anInstance[i] instanceof wo.event) { 
                        this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                    } else if(anInstance[i] instanceof Function && !ko.isObservable(anInstance[i])) { 
                        this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(anInstance[i], i, this.classFullName));
                    } else {
                        this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                    }
                }
            }
        }
        
        if(this.constructorFunction.constructor === Function) {
            var current = this.constructorFunction;
            while((current = Object.getPrototypeOf(current.prototype).constructor) !== Object) {  
                var parentClass = this.api.getClassDescription(current);
                if(!parentClass)
                    throw "Class has not been defined yet";
                
                var copy = function(fromTo, nameProperty) {
                    enumerate(parentClass[fromTo], function(fn) { 
                        if(this[fromTo].indexOf(fn) !== -1) return;
                        
                        for(var i = 0, ii = this[fromTo].length; i < ii; i++) {                    
                            if(this[fromTo][i][nameProperty] === fn[nameProperty]) {
                                if(!this[fromTo][i].overrides)
                                    this[fromTo][i].overrides = fn;
                                
                                return;
                            }
                        }
                        
                        this[fromTo].push(fn);
                    }, this);
                };
                
                // instance items only (no statics)
                copy.call(this, "events", "eventName");
                copy.call(this, "properties", "propertyName");
                copy.call(this, "functions", "functionName");
            }
        }
        
        var pullSummaryFromOverride = function(fromTo) {
            enumerate(this[fromTo], function(item) {
                var current = item;
                while (current && current.overrides && !current.summary) {
                    if(current.overrides.summary) {
                        current.summary = current.overrides.summary + 
                            (current.overrides.summaryInherited ? "" : " (from " + current.overrides.classFullName + ")");
                        current.summaryInherited = true;
                    }
                    
                    current = current.overrides;
                }
            });
        };
        
        pullSummaryFromOverride.call(this, "staticProperties");
        pullSummaryFromOverride.call(this, "staticFunctions");
        pullSummaryFromOverride.call(this, "staticEvents");
        pullSummaryFromOverride.call(this, "events");
        pullSummaryFromOverride.call(this, "properties");
        pullSummaryFromOverride.call(this, "functions");
        
        for(var i = 0, ii = this.functions.length; i < ii; i++) {
            if(this.functions[i].functionName === "constructor") {
                this.classConstructor = this.functions.splice(i, 1)[0];
                break;
            }
        }
        
        if(i === this.functions.length)
            this.classConstructor = new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction, this.className, this.classFullName);
        
        var sort = function() { return arguments[0].name.localeCompare(arguments[1].name); };
        
        this.events.sort(sort);
        this.staticEvents.sort(sort);
        this.properties.sort(sort);
        this.staticProperties.sort(sort);
        this.functions.sort(sort);
        this.staticFunctions.sort(sort);
    };
    
    return classDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem", "wo.object", function() {
    return function(itemName, itemSummary) {
        this._super();
        
        this.name = itemName;
        this.summary = itemSummary;
    }
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Event", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    var eventDescription = function(constructorFunction, eventName, classFullName) {
        this._super(eventName, Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(constructorFunction, eventName));
        
        this.eventName = eventName;
        this.classFullName = classFullName;
    };
    
    return eventDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Function", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    
    var functionDescription = function(theFunction, functionName, classFullName) {
        this._super(functionName, functionDescription.getFunctionSummary(theFunction));
        
        this["function"] = theFunction;
        this.functionName = functionName;
        this.classFullName = classFullName;
        
        this.overrides = null;
    };
        
    functionDescription.getFunctionSummary = function(theFunction) {
        var functionString = theFunction.toString();
        
        var isInlineComment = false;
        var isBlockComment = false;
        
        var removeFunctionDefinition = function() {
            var firstInline = functionString.indexOf("//");
            var firstBlock = functionString.indexOf("/*");
            var openFunction = functionString.indexOf("{");
            
            if(firstInline === -1) firstInline = Number.MAX_VALUE;
            if(firstBlock === -1) firstBlock = Number.MAX_VALUE;
                    
            if(openFunction < firstInline && openFunction < firstBlock) {
                functionString = functionString.substr(openFunction + 1).replace(/^\s+|\s+$/g, '');
            } else { 
                if(firstInline < firstBlock) {
                    functionString = functionString.substr(functionString.indexOf("\n")).replace(/^\s+|\s+$/g, '');
                } else {
                    functionString = functionString.substr(functionString.indexOf("*/")).replace(/^\s+|\s+$/g, '');
                }
                
                removeFunctionDefinition();
            }
        };
        
        removeFunctionDefinition();
        
        if (functionString.indexOf("///<summary>") === 0) {
            return functionString.substring(12, functionString.indexOf("</summary>"));
        }
        
        return "";   
    };  
    
    return functionDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    var property = function(constructorFunction, propertyName, classFullName) {
        this._super(propertyName, property.getPropertySummary(constructorFunction, propertyName, classFullName));
        
        this.propertyName = propertyName;
        this.classFullName = classFullName;
    };
    
    var inlineCommentOnly = /^\/\//;
    property.getPropertySummary = function(constructorFunction, propertyName, classFullName) {
        var result;
        if(result =  property.getPropertyDescriptionOverride(classFullName + "." + propertyName))
            return result;
        
        constructorFunction = constructorFunction.toString();
                
        var search = function(regex) {
            var i = constructorFunction.search(regex);
            if(i !== -1) {
                var func = constructorFunction.substring(0, i);
                var lastLine = func.lastIndexOf("\n");
                if(lastLine > 0) {
                    func = func.substring(lastLine);
                } 
                
                func = func.replace(/^\s+|\s+$/g, '');
                if(inlineCommentOnly.test(func))
                    return func.substring(2);
                else
                    return null;
            }
        }
        
        result = search(new RegExp("\\s*this\\s*\\.\\s*" + propertyName + "\\s*="));
        if(result)
            return result;
                
        return search(new RegExp("\\s*this\\s*\\[\\s*\"" + propertyName + "\"\\s*\\]\\s*="));        
    };
    
    property.getPropertyDescriptionOverride = function(classDelimitedPropertyName) {
        
        var current = property.descriptionOverrides;
        enumerate(classDelimitedPropertyName.split("."), function(item) {
            if(!current) return;
            current = current[item];
        });
        
        return current;
    };
        
    property.descriptionOverrides = {
        wo: {
            'if': {
                woInvisibleDefault: "The default value for woInvisible for the wo.if class."
            },
            html: {
                specialTags: "A list of html tags which cannot be placed inside a div element."
            },
            ko: {
                array: "Utils for operating on observableArrays",
                virtualElements: "Utils for operating on knockout virtual elements"
            },
            object: {
                useVirtualCache: "When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."
            },
            view: {
                //TODO: give this a page
                objectParser: "Used to parse string values into a given type",
                //TODO: give this a page
                reservedPropertyNames: "Properties which cannot be set on a wipeout object via the template"
            },
            visual: {
                reservedTags: "A list of names which cannot be used as wipeout object names. These are mostly html tag names",
                woInvisibleDefault: "The default value for woInvisible for the wo.visual class."
            }
        },
        wipeout: {
            template: {
                engine: {
            closeCodeTag: "Signifies the end of a wipeout code block. \"" + wipeout.template.engine.closeCodeTag + "\".",
            instance: "An instance of a wipeout.template.engine which is used by the render binding.",
            openCodeTag: "Signifies the beginning of a wipeout code block. \"" + wipeout.template.engine.openCodeTag + "\".",
            scriptCache: "A placeholder for precompiled scripts.",
            scriptHasBeenReWritten: "TODO"
                }}
        }
    };
    
    return property;
});

compiler.registerClass("Wipeout.Docs.Models.Pages.DisplayItem", "wo.object", function() {
    return function(name) {
        this._super();
        
        this.title = name;
    };
});

compiler.registerClass("Wipeout.Docs.Models.Pages.LandingPage", "Wipeout.Docs.Models.Pages.DisplayItem", function() {
    return function(title) {
       this._super(title); 
    }
});

compiler.compile(window.Wipeout);


//window.Wipeout = Wipeout;



})();


(function(){window.Wipeout={};Wipeout.compiler=(function(){var f=function(h,g){this.classes=[];for(var j=0,k=h.length;j<k;j++){this.classes.push(h[j])}this.compiled=[];for(var j=0,k=g.length;j<k;j++){this.compiled.push({name:g[j],value:e(g[j])})}};function e(k){var g=window;k=k.split(".");for(var h=0,j=k.length;h<j;h++){g=g[k[h]]}return g}f.prototype.checkDependency=function(g){for(var h=0,j=this.compiled.length;h<j;h++){if(this.compiled[h].name===g){return true}}return false};f.prototype.getClass=function(g){for(var h=0,j=this.compiled.length;h<j;h++){if(this.compiled[h].name===g){return this.compiled[h].value}}return null};f.prototype.checkDependencies=function(g){for(var h=0,j=g.length;h<j;h++){if(!this.checkDependency(g[h])){return false}}return true};f.prototype.compile=function(){while(this.classes.length){var l=this.classes.length;for(var h=0;h<this.classes.length;h++){if(this.checkDependencies(this.classes[h].dependencies)){var g=this.classes[h].className;if(g.indexOf(".")!==-1){g=g.substr(g.lastIndexOf(".")+1)}var m=this.classes[h].constructor();var o={};for(var k in m){o[k]=m[k]}var n=m.prototype;m=this.getClass(this.classes[h].parentClass).extend(m,g);for(k in n){m.prototype[k]=n[k]}for(k in o){m[k]=o[k]}this.compiled.push({name:this.classes[h].className,value:m});this.classes.splice(h,1);h--}}if(l===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function d(i,g,h){this.rootNamespace=i;this.baseClass=g;this.dependencies=h||[];this.classes=[]}d.prototype.namespaceCorrectly=function(g){if(this.rootNamespace&&g&&g.indexOf(this.rootNamespace+".")===0){g=g.substr(this.rootNamespace.length+1)}return g};d.prototype.registerClass=function(h,l,g){var l=!l||l===this.baseClass?this.baseClass:this.namespaceCorrectly(l);var m={className:this.namespaceCorrectly(h),constructor:g,parentClass:l,dependencies:[l]};for(var j=0,k=this.classes.length;j<k;j++){if(this.classes[j].className===m.className){throw"There is already a class named "+h}}for(j=3,k=arguments.length;j<k;j++){m.dependencies.push(this.namespaceCorrectly(arguments[j]))}this.classes.push(m)};d.append=function(g,l){var k=g.name.split(".");for(var h=0,j=k.length-1;h<j;h++){l=l[k[h]]=l[k[h]]||{}}l[k[h]]=g.value};d.prototype.compile=function(l){l=l||{};var g=[this.baseClass];for(var h=0,k=this.dependencies.length;h<k;h++){g.push(this.dependencies[h])}var j=new f(this.classes,g);j.compile();for(h=1,k=j.compiled.length;h<k;h++){d.append(j.compiled[h],l)}return l};return d})();var a=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);var b=function(f,d,e){e=e||window;if(f){for(var g=0,h=f.length;g<h;g++){d.call(e,f[g],g)}}};var c=function(e,f){var d=f||window;b(e.split("."),function(g){d=d[g]});return d};(function(){window.Wipeout={};Wipeout.compiler=(function(){var i=function(k,j){this.classes=[];for(var l=0,m=k.length;l<m;l++){this.classes.push(k[l])}this.compiled=[];for(var l=0,m=j.length;l<m;l++){this.compiled.push({name:j[l],value:h(j[l])})}};function h(m){var j=window;m=m.split(".");for(var k=0,l=m.length;k<l;k++){j=j[m[k]]}return j}i.prototype.checkDependency=function(j){for(var k=0,l=this.compiled.length;k<l;k++){if(this.compiled[k].name===j){return true}}return false};i.prototype.getClass=function(j){for(var k=0,l=this.compiled.length;k<l;k++){if(this.compiled[k].name===j){return this.compiled[k].value}}return null};i.prototype.checkDependencies=function(j){for(var k=0,l=j.length;k<l;k++){if(!this.checkDependency(j[k])){return false}}return true};i.prototype.compile=function(){while(this.classes.length){var n=this.classes.length;for(var l=0;l<this.classes.length;l++){if(this.checkDependencies(this.classes[l].dependencies)){var k=this.classes[l].className;if(k.indexOf(".")!==-1){k=k.substr(k.lastIndexOf(".")+1)}var o=this.classes[l].constructor();var q={};for(var m in o){q[m]=o[m]}var p=o.prototype;o=this.getClass(this.classes[l].parentClass).extend(o,k);for(m in p){o.prototype[m]=p[m]}for(m in q){o[m]=q[m]}this.compiled.push({name:this.classes[l].className,value:o});this.classes.splice(l,1);l--}}if(n===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function g(l,j,k){this.rootNamespace=l;this.baseClass=j;this.dependencies=k||[];this.classes=[]}g.prototype.namespaceCorrectly=function(j){if(this.rootNamespace&&j&&j.indexOf(this.rootNamespace+".")===0){j=j.substr(this.rootNamespace.length+1)}return j};g.prototype.registerClass=function(k,n,j){var n=!n||n===this.baseClass?this.baseClass:this.namespaceCorrectly(n);var o={className:this.namespaceCorrectly(k),constructor:j,parentClass:n,dependencies:[n]};for(var l=0,m=this.classes.length;l<m;l++){if(this.classes[l].className===o.className){throw"There is already a class named "+k}}for(l=3,m=arguments.length;l<m;l++){o.dependencies.push(this.namespaceCorrectly(arguments[l]))}this.classes.push(o)};g.append=function(j,n){var m=j.name.split(".");for(var k=0,l=m.length-1;k<l;k++){n=n[m[k]]=n[m[k]]||{}}n[m[k]]=j.value};g.prototype.compile=function(n){n=n||{};var j=[this.baseClass];for(var k=0,m=this.dependencies.length;k<m;k++){j.push(this.dependencies[k])}var l=new i(this.classes,j);l.compile();for(k=1,m=l.compiled.length;k<m;k++){g.append(l.compiled[k],n)}return n};return g})();var d=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);window.NS=function(k){k=k.split(".");var g=window;for(var h=0,j=k.length;h<j;h++){g=g[k[h]]||(g[k[h]]={})}return g};window.vmChooser=function(g){g=ko.unwrap(g);if(g==null){return null}throw"Unknown model type"};d.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function g(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(h){this.model().content(h.data)},this)}g.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var g=function(h){this._super(h||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};g.prototype.onCodeChanged=function(h){};g.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var g=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};g.prototype.onModelChanged=function(j,h){this._super(j,h);var j=this.content();if(h==null){this.content(null)}else{var i=null;if(h instanceof Wipeout.Docs.Models.Pages.LandingPage){i=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Class){i=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Event){i=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Property){i=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Function){i=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}i.model(h);this.content(i)}};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){this._super.apply(this,arguments)};g.prototype.onCodeChanged=function(h){new Function(h.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){g.staticConstructor();this._super.apply(this,arguments)};var h;g.staticConstructor=function(){if(h){return}h=document.createElement("div");h.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(h)};g.prototype.onCodeChanged=function(i){h.innerHTML+=i.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var g=function(){this._super(g.nullTemplate)};g.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";g.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";g.nullTemplate=wo.visual.getBlankTemplateId();g.prototype.onModelChanged=function(i,h){this._super(i,h);if(h&&(h.branches||h.payload())){this.templateId(g.branchTemplate)}else{if(h){this.templateId(g.leafTemplate)}else{this.templateId(g.nullTemplate)}}};g.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var h=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&h){this.triggerRoutedEvent(g.renderPage,h)}};g.renderPage=new wo.routedEvent();return g});d.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};g.prototype.onCodeChanged=function(h){this.usage(h.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return g});d.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var g=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var h=this.model().classFullName+g.classUsagesTemplateSuffix;if(document.getElementById(h)){return h}}return wo.contentControl.getBlankTemplateId()},this)};g.classUsagesTemplateSuffix="_ClassUsages";return g});d.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});d.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var j=new Wipeout.Docs.Models.Components.Api();var i=(function(){var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",j.forClass("wo.object"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",j.forClass("wo.routedEventModel"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",j.forClass("wo.visual"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",j.forClass("wo.view"));var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",j.forClass("wo.contentControl"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",j.forClass("wo.if"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",j.forClass("wo.itemsControl"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",j.forClass("wo.event"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",j.forClass("wo.routedEvent"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",j.forClass("wo.routedEventArgs"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",j.forClass("wo.routedEventRegistration"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",j.forClass("wo.html"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",j.forClass("wo.ko.virtualElements"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",j.forClass("wipeout.utils.ko.array"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",j.forClass("wo.ko"),{staticProperties:{virtualElements:r,array:p}});var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",j.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[k,l,n,m,o,q,s,t,v,u,w,x,y,z])})();var g=(function(){var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",j.forClass("wipeout.bindings.itemsControl"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",j.forClass("wipeout.bindings.render"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",j.forClass("wipeout.bindings.wipeout-type"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",j.forClass("wipeout.bindings.wo"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",j.forClass("wipeout.bindings.wipeout"));var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",j.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[k,n,o,p,m,l])})();var h=(function(){var k=(function(){var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",j.forClass("wo.object"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",j.forClass("wo.routedEventModel"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",j.forClass("wo.visual"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",j.forClass("wo.view"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",j.forClass("wo.contentControl"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",j.forClass("wo.if"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",j.forClass("wo.itemsControl"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",j.forClass("wo.event"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",j.forClass("wo.routedEvent"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",j.forClass("wo.routedEventArgs"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",j.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[o,p,q,r,s,u,t,v,w,x,y])})();var l=(function(){var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",j.forClass("wipeout.bindings.itemsControl"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",j.forClass("wipeout.bindings.render"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",j.forClass("wipeout.bindings.wipeout-type"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",j.forClass("wipeout.bindings.wo"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",j.forClass("wipeout.bindings.wipeout"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",j.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[o,r,s,t,q,p])})();var m=(function(){j.forClass("ko.templateEngine");var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",j.forClass("wipeout.template.engine"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",j.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[o,p])})();var n=(function(){var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",j.forClass("wipeout.utils.html"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",j.forClass("wipeout.utils.ko.virtualElements"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",j.forClass("wipeout.utils.ko.array"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",j.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:r,array:p}});var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",j.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[o,q,s])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[k,l,m,n])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[i,g,h])])}});var e=function(j,g,h){h=h||window;if(j){for(var k=0,l=j.length;k<l;k++){g.call(h,j[k],k)}}};var f=function(h,i){var g=i||window;e(h.split("."),function(j){g=g[j]});return g};d.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var g=function(h){this._super();this.classes=[]};g.prototype.getClassDescription=function(h){for(var j=0,k=this.classes.length;j<k;j++){if(this.classes[j].classConstructor===h){return this.classes[j].classDescription}}};g.prototype.forClass=function(i){var h=f(i);var k=this.getClassDescription(h);if(k){return k}var j=new Wipeout.Docs.Models.Descriptions.Class(i,this);this.classes.push({classDescription:j,classConstructor:h});return j};return g});d.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var g=function(j,h,i){this._super(j,h,g.compileBranches(h,i))};g.compileBranches=function(h,i){var j=[];i=i||{};i.staticEvents=i.staticEvents||{};i.staticProperties=i.staticProperties||{};i.staticFunctions=i.staticFunctions||{};i.events=i.events||{};i.properties=i.properties||{};i.functions=i.functions||{};j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));e(h.staticEvents,function(k){if(i.staticEvents[k.eventName]){j.push(i.staticEvents[k.eventName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.eventName,null))}});e(h.staticProperties,function(k){if(i.staticProperties[k.propertyName]){j.push(i.staticProperties[k.propertyName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.propertyName,null))}});e(h.staticFunctions,function(k){if(i.staticFunctions[k.functionName]){j.push(i.staticFunctions[k.functionName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.functionName,null))}});e(h.events,function(k){if(i.events[k.eventName]){j.push(i.events[k.eventName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.eventName,null))}});e(h.properties,function(k){if(i.staticProperties[k.propertyName]){j.push(i.staticProperties[k.propertyName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.propertyName,null))}});e(h.functions,function(k){if(i.functions[k.functionName]){j.push(i.functions[k.functionName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.functionName,null))}});j.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return j};return g});d.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var g=function(i,j,h){this._super(i,h);this.page=j};g.prototype.payload=function(){return this.page};return g});d.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var g=function(i,h){this._super();this.name=i;this.branches=h};g.prototype.payload=function(){return null};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var g=function(i,h){this._super();this.className=g.getClassName(i);this.constructorFunction=f(i);this.classFullName=i;this.api=h;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};g.getClassName=function(h){h=h.split(".");return h[h.length-1]};g.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var l in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(l)){if(this.constructorFunction[l] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,l,this.classFullName))}else{if(this.constructorFunction[l] instanceof Function&&!ko.isObservable(this.constructorFunction[l])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[l],l,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,l,this.classFullName))}}}}for(var l in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(l)){if(this.constructorFunction.prototype[l] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,l,this.classFullName))}else{if(this.constructorFunction.prototype[l] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[l])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[l],l,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,l,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var h=new this.constructorFunction();for(var l in h){if(h.hasOwnProperty(l)){if(h[l] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,l,this.classFullName))}else{if(h[l] instanceof Function&&!ko.isObservable(h[l])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(h[l],l,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,l,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var k=this.constructorFunction;while((k=Object.getPrototypeOf(k.prototype).constructor)!==Object){var n=this.api.getClassDescription(k);if(!n){throw"Class has not been defined yet"}var j=function(i,q){e(n[i],function(r){if(this[i].indexOf(r)!==-1){return}for(var s=0,t=this[i].length;s<t;s++){if(this[i][s][q]===r[q]){if(!this[i][s].overrides){this[i][s].overrides=r}return}}this[i].push(r)},this)};j.call(this,"events","eventName");j.call(this,"properties","propertyName");j.call(this,"functions","functionName")}}var o=function(i){e(this[i],function(r){var q=r;while(q&&q.overrides&&!q.summary){if(q.overrides.summary){q.summary=q.overrides.summary+(q.overrides.summaryInherited?"":" (from "+q.overrides.classFullName+")");q.summaryInherited=true}q=q.overrides}})};o.call(this,"staticProperties");o.call(this,"staticFunctions");o.call(this,"staticEvents");o.call(this,"events");o.call(this,"properties");o.call(this,"functions");for(var l=0,m=this.functions.length;l<m;l++){if(this.functions[l].functionName==="constructor"){this.classConstructor=this.functions.splice(l,1)[0];break}}if(l===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var p=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(p);this.staticEvents.sort(p);this.properties.sort(p);this.staticProperties.sort(p);this.functions.sort(p);this.staticFunctions.sort(p)};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(g,h){this._super();this.name=g;this.summary=h}});d.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var g=function(i,j,h){this._super(j,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(i,j));this.eventName=j;this.classFullName=h};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var g=function(j,i,h){this._super(i,g.getFunctionSummary(j));this["function"]=j;this.functionName=i;this.classFullName=h;this.overrides=null};g.getFunctionSummary=function(l){var h=l.toString();var j=false;var i=false;var k=function(){var n=h.indexOf("//");var m=h.indexOf("/*");var o=h.indexOf("{");if(n===-1){n=Number.MAX_VALUE}if(m===-1){m=Number.MAX_VALUE}if(o<n&&o<m){h=h.substr(o+1).replace(/^\s+|\s+$/g,"")}else{if(n<m){h=h.substr(h.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{h=h.substr(h.indexOf("*/")).replace(/^\s+|\s+$/g,"")}k()}};k();if(h.indexOf("///<summary>")===0){return h.substring(12,h.indexOf("</summary>"))}return""};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var h=function(j,k,i){this._super(k,h.getPropertySummary(j,k,i));this.propertyName=k;this.classFullName=i};var g=/^\/\//;h.getPropertySummary=function(j,k,i){var l;if(l=h.getPropertyDescriptionOverride(i+"."+k)){return l}j=j.toString();var m=function(q){var o=j.search(q);if(o!==-1){var n=j.substring(0,o);var p=n.lastIndexOf("\n");if(p>0){n=n.substring(p)}n=n.replace(/^\s+|\s+$/g,"");if(g.test(n)){return n.substring(2)}else{return null}}};l=m(new RegExp("\\s*this\\s*\\.\\s*"+k+"\\s*="));if(l){return l}return m(new RegExp('\\s*this\\s*\\[\\s*"'+k+'"\\s*\\]\\s*='))};h.getPropertyDescriptionOverride=function(i){var j=h.descriptionOverrides;e(i.split("."),function(k){if(!j){return}j=j[k]});return j};h.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block. "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block. "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return h});d.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(g){this._super();this.title=g}});d.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(g){this._super(g)}});d.compile(window.Wipeout)})();(function(){window.Wipeout={};Wipeout.compiler=(function(){var i=function(m,l){this.classes=[];for(var n=0,o=m.length;n<o;n++){this.classes.push(m[n])}this.compiled=[];for(var n=0,o=l.length;n<o;n++){this.compiled.push({name:l[n],value:h(l[n])})}};function h(o){var l=window;o=o.split(".");for(var m=0,n=o.length;m<n;m++){l=l[o[m]]}return l}i.prototype.checkDependency=function(k){for(var l=0,m=this.compiled.length;l<m;l++){if(this.compiled[l].name===k){return true}}return false};i.prototype.getClass=function(k){for(var l=0,m=this.compiled.length;l<m;l++){if(this.compiled[l].name===k){return this.compiled[l].value}}return null};i.prototype.checkDependencies=function(k){for(var l=0,m=k.length;l<m;l++){if(!this.checkDependency(k[l])){return false}}return true};i.prototype.compile=function(){while(this.classes.length){var r=this.classes.length;for(var p=0;p<this.classes.length;p++){if(this.checkDependencies(this.classes[p].dependencies)){var j=this.classes[p].className;if(j.indexOf(".")!==-1){j=j.substr(j.lastIndexOf(".")+1)}var s=this.classes[p].constructor();var u={};for(var q in s){u[q]=s[q]}var t=s.prototype;s=this.getClass(this.classes[p].parentClass).extend(s,j);for(q in t){s.prototype[q]=t[q]}for(q in u){s[q]=u[q]}this.compiled.push({name:this.classes[p].className,value:s});this.classes.splice(p,1);p--}}if(r===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function g(l,j,k){this.rootNamespace=l;this.baseClass=j;this.dependencies=k||[];this.classes=[]}g.prototype.namespaceCorrectly=function(j){if(this.rootNamespace&&j&&j.indexOf(this.rootNamespace+".")===0){j=j.substr(this.rootNamespace.length+1)}return j};g.prototype.registerClass=function(o,r,n){var r=!r||r===this.baseClass?this.baseClass:this.namespaceCorrectly(r);var s={className:this.namespaceCorrectly(o),constructor:n,parentClass:r,dependencies:[r]};for(var p=0,q=this.classes.length;p<q;p++){if(this.classes[p].className===s.className){throw"There is already a class named "+o}}for(p=3,q=arguments.length;p<q;p++){s.dependencies.push(this.namespaceCorrectly(arguments[p]))}this.classes.push(s)};g.append=function(m,q){var p=m.name.split(".");for(var n=0,o=p.length-1;n<o;n++){q=q[p[n]]=q[p[n]]||{}}q[p[n]]=m.value};g.prototype.compile=function(q){q=q||{};var m=[this.baseClass];for(var n=0,p=this.dependencies.length;n<p;n++){m.push(this.dependencies[n])}var o=new i(this.classes,m);o.compile();for(n=1,p=o.compiled.length;n<p;n++){g.append(o.compiled[n],q)}return q};return g})();var d=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);window.NS=function(k){k=k.split(".");var h=window;for(var i=0,j=k.length;i<j;i++){h=h[k[i]]||(h[k[i]]={})}return h};window.vmChooser=function(g){g=ko.unwrap(g);if(g==null){return null}throw"Unknown model type"};d.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function g(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(h){this.model().content(h.data)},this)}g.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var g=function(h){this._super(h||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};g.prototype.onCodeChanged=function(h){};g.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var g=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};g.prototype.onModelChanged=function(j,h){this._super(j,h);var j=this.content();if(h==null){this.content(null)}else{var i=null;if(h instanceof Wipeout.Docs.Models.Pages.LandingPage){i=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Class){i=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Event){i=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Property){i=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Function){i=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}i.model(h);this.content(i)}};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){this._super.apply(this,arguments)};g.prototype.onCodeChanged=function(h){new Function(h.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){g.staticConstructor();this._super.apply(this,arguments)};var h;g.staticConstructor=function(){if(h){return}h=document.createElement("div");h.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(h)};g.prototype.onCodeChanged=function(i){h.innerHTML+=i.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var g=function(){this._super(g.nullTemplate)};g.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";g.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";g.nullTemplate=wo.visual.getBlankTemplateId();g.prototype.onModelChanged=function(i,h){this._super(i,h);if(h&&(h.branches||h.payload())){this.templateId(g.branchTemplate)}else{if(h){this.templateId(g.leafTemplate)}else{this.templateId(g.nullTemplate)}}};g.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var h=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&h){this.triggerRoutedEvent(g.renderPage,h)}};g.renderPage=new wo.routedEvent();return g});d.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};g.prototype.onCodeChanged=function(h){this.usage(h.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return g});d.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var g=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var h=this.model().classFullName+g.classUsagesTemplateSuffix;if(document.getElementById(h)){return h}}return wo.contentControl.getBlankTemplateId()},this)};g.classUsagesTemplateSuffix="_ClassUsages";return g});d.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});d.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var k=new Wipeout.Docs.Models.Components.Api();var j=(function(){var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",k.forClass("wo.object"));var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",k.forClass("wo.routedEventModel"));var L=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",k.forClass("wo.visual"));var K=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",k.forClass("wo.view"));var g=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",k.forClass("wo.contentControl"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",k.forClass("wo.if"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",k.forClass("wo.itemsControl"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",k.forClass("wo.event"));var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",k.forClass("wo.routedEvent"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",k.forClass("wo.routedEventArgs"));var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",k.forClass("wo.routedEventRegistration"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",k.forClass("wo.html"));var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",k.forClass("wo.ko.virtualElements"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",k.forClass("wipeout.utils.ko.array"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",k.forClass("wo.ko"),{staticProperties:{virtualElements:D,array:B}});var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",k.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[g,x,z,y,A,C,E,F,H,G,I,J,K,L])})();var h=(function(){var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",k.forClass("wipeout.bindings.itemsControl"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",k.forClass("wipeout.bindings.render"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",k.forClass("wipeout.bindings.wipeout-type"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",k.forClass("wipeout.bindings.wo"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",k.forClass("wipeout.bindings.wipeout"));var g=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",k.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[g,p,q,r,o,n])})();var i=(function(){var g=(function(){var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",k.forClass("wo.object"));var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",k.forClass("wo.routedEventModel"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",k.forClass("wo.visual"));var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",k.forClass("wo.view"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",k.forClass("wo.contentControl"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",k.forClass("wo.if"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",k.forClass("wo.itemsControl"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",k.forClass("wo.event"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",k.forClass("wo.routedEvent"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",k.forClass("wo.routedEventArgs"));var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",k.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[w,x,y,z,A,C,B,D,E,F,G])})();var l=(function(){var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",k.forClass("wipeout.bindings.itemsControl"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",k.forClass("wipeout.bindings.render"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",k.forClass("wipeout.bindings.wipeout-type"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",k.forClass("wipeout.bindings.wo"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",k.forClass("wipeout.bindings.wipeout"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",k.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[r,u,v,w,t,s])})();var m=(function(){k.forClass("ko.templateEngine");var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",k.forClass("wipeout.template.engine"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",k.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[o,p])})();var n=(function(){var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",k.forClass("wipeout.utils.html"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",k.forClass("wipeout.utils.ko.virtualElements"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",k.forClass("wipeout.utils.ko.array"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",k.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:t,array:r}});var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",k.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[q,s,u])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[g,l,m,n])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[j,h,i])])}});var e=function(k,i,j){j=j||window;if(k){for(var l=0,m=k.length;l<m;l++){i.call(j,k[l],l)}}};var f=function(h,i){var g=i||window;e(h.split("."),function(j){g=g[j]});return g};d.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var g=function(h){this._super();this.classes=[]};g.prototype.getClassDescription=function(h){for(var i=0,j=this.classes.length;i<j;i++){if(this.classes[i].classConstructor===h){return this.classes[i].classDescription}}};g.prototype.forClass=function(j){var i=f(j);var l=this.getClassDescription(i);if(l){return l}var k=new Wipeout.Docs.Models.Descriptions.Class(j,this);this.classes.push({classDescription:k,classConstructor:i});return k};return g});d.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var g=function(j,h,i){this._super(j,h,g.compileBranches(h,i))};g.compileBranches=function(h,i){var j=[];i=i||{};i.staticEvents=i.staticEvents||{};i.staticProperties=i.staticProperties||{};i.staticFunctions=i.staticFunctions||{};i.events=i.events||{};i.properties=i.properties||{};i.functions=i.functions||{};j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));e(h.staticEvents,function(k){if(i.staticEvents[k.eventName]){j.push(i.staticEvents[k.eventName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.eventName,null))}});e(h.staticProperties,function(k){if(i.staticProperties[k.propertyName]){j.push(i.staticProperties[k.propertyName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.propertyName,null))}});e(h.staticFunctions,function(k){if(i.staticFunctions[k.functionName]){j.push(i.staticFunctions[k.functionName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.functionName,null))}});e(h.events,function(k){if(i.events[k.eventName]){j.push(i.events[k.eventName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.eventName,null))}});e(h.properties,function(k){if(i.staticProperties[k.propertyName]){j.push(i.staticProperties[k.propertyName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.propertyName,null))}});e(h.functions,function(k){if(i.functions[k.functionName]){j.push(i.functions[k.functionName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.functionName,null))}});j.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return j};return g});d.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var g=function(i,j,h){this._super(i,h);this.page=j};g.prototype.payload=function(){return this.page};return g});d.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var g=function(i,h){this._super();this.name=i;this.branches=h};g.prototype.payload=function(){return null};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var g=function(i,h){this._super();this.className=g.getClassName(i);this.constructorFunction=f(i);this.classFullName=i;this.api=h;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};g.getClassName=function(h){h=h.split(".");return h[h.length-1]};g.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var p in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(p)){if(this.constructorFunction[p] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,p,this.classFullName))}else{if(this.constructorFunction[p] instanceof Function&&!ko.isObservable(this.constructorFunction[p])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[p],p,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,p,this.classFullName))}}}}for(var p in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(p)){if(this.constructorFunction.prototype[p] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,p,this.classFullName))}else{if(this.constructorFunction.prototype[p] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[p])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[p],p,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,p,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var i=new this.constructorFunction();for(var p in i){if(i.hasOwnProperty(p)){if(i[p] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,p,this.classFullName))}else{if(i[p] instanceof Function&&!ko.isObservable(i[p])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(i[p],p,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,p,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var o=this.constructorFunction;while((o=Object.getPrototypeOf(o.prototype).constructor)!==Object){var r=this.api.getClassDescription(o);if(!r){throw"Class has not been defined yet"}var n=function(h,j){e(r[h],function(k){if(this[h].indexOf(k)!==-1){return}for(var l=0,m=this[h].length;l<m;l++){if(this[h][l][j]===k[j]){if(!this[h][l].overrides){this[h][l].overrides=k}return}}this[h].push(k)},this)};n.call(this,"events","eventName");n.call(this,"properties","propertyName");n.call(this,"functions","functionName")}}var s=function(h){e(this[h],function(k){var j=k;while(j&&j.overrides&&!j.summary){if(j.overrides.summary){j.summary=j.overrides.summary+(j.overrides.summaryInherited?"":" (from "+j.overrides.classFullName+")");j.summaryInherited=true}j=j.overrides}})};s.call(this,"staticProperties");s.call(this,"staticFunctions");s.call(this,"staticEvents");s.call(this,"events");s.call(this,"properties");s.call(this,"functions");for(var p=0,q=this.functions.length;p<q;p++){if(this.functions[p].functionName==="constructor"){this.classConstructor=this.functions.splice(p,1)[0];break}}if(p===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var t=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(t);this.staticEvents.sort(t);this.properties.sort(t);this.staticProperties.sort(t);this.functions.sort(t);this.staticFunctions.sort(t)};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(g,h){this._super();this.name=g;this.summary=h}});d.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var g=function(i,j,h){this._super(j,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(i,j));this.eventName=j;this.classFullName=h};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var g=function(j,i,h){this._super(i,g.getFunctionSummary(j));this["function"]=j;this.functionName=i;this.classFullName=h;this.overrides=null};g.getFunctionSummary=function(n){var j=n.toString();var l=false;var k=false;var m=function(){var i=j.indexOf("//");var h=j.indexOf("/*");var o=j.indexOf("{");if(i===-1){i=Number.MAX_VALUE}if(h===-1){h=Number.MAX_VALUE}if(o<i&&o<h){j=j.substr(o+1).replace(/^\s+|\s+$/g,"")}else{if(i<h){j=j.substr(j.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{j=j.substr(j.indexOf("*/")).replace(/^\s+|\s+$/g,"")}m()}};m();if(j.indexOf("///<summary>")===0){return j.substring(12,j.indexOf("</summary>"))}return""};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var h=function(j,k,i){this._super(k,h.getPropertySummary(j,k,i));this.propertyName=k;this.classFullName=i};var g=/^\/\//;h.getPropertySummary=function(l,m,k){var n;if(n=h.getPropertyDescriptionOverride(k+"."+m)){return n}l=l.toString();var o=function(q){var j=l.search(q);if(j!==-1){var i=l.substring(0,j);var p=i.lastIndexOf("\n");if(p>0){i=i.substring(p)}i=i.replace(/^\s+|\s+$/g,"");if(g.test(i)){return i.substring(2)}else{return null}}};n=o(new RegExp("\\s*this\\s*\\.\\s*"+m+"\\s*="));if(n){return n}return o(new RegExp('\\s*this\\s*\\[\\s*"'+m+'"\\s*\\]\\s*='))};h.getPropertyDescriptionOverride=function(i){var j=h.descriptionOverrides;e(i.split("."),function(k){if(!j){return}j=j[k]});return j};h.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block. "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block. "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return h});d.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(g){this._super();this.title=g}});d.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(g){this._super(g)}});d.compile(window.Wipeout)})();a.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var g=new Wipeout.Docs.Models.Components.Api();var f=(function(){var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",g.forClass("wo.object"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",g.forClass("wo.routedEventModel"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",g.forClass("wo.visual"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",g.forClass("wo.view"));var h=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",g.forClass("wo.contentControl"));var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",g.forClass("wo.if"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",g.forClass("wo.itemsControl"));var i=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",g.forClass("wo.event"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",g.forClass("wo.routedEvent"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",g.forClass("wo.routedEventArgs"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",g.forClass("wo.routedEventRegistration"));var j=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",g.forClass("wo.html"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",g.forClass("wo.ko.virtualElements"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",g.forClass("wipeout.utils.ko.array"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",g.forClass("wo.ko"),{staticProperties:{virtualElements:o,array:m}});var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",g.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[h,i,k,j,l,n,p,q,s,r,t,u,v,w])})();var d=(function(){var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",g.forClass("wipeout.bindings.itemsControl"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",g.forClass("wipeout.bindings.render"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",g.forClass("wipeout.bindings.wipeout-type"));var j=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",g.forClass("wipeout.bindings.wo"));var i=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",g.forClass("wipeout.bindings.wipeout"));var h=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",g.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[h,k,l,m,j,i])})();var e=(function(){var h=(function(){var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",g.forClass("wo.object"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",g.forClass("wo.routedEventModel"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",g.forClass("wo.visual"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",g.forClass("wo.view"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",g.forClass("wo.contentControl"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",g.forClass("wo.if"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",g.forClass("wo.itemsControl"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",g.forClass("wo.event"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",g.forClass("wo.routedEvent"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",g.forClass("wo.routedEventArgs"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",g.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[l,m,n,o,p,r,q,s,t,u,v])})();var i=(function(){var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",g.forClass("wipeout.bindings.itemsControl"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",g.forClass("wipeout.bindings.render"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",g.forClass("wipeout.bindings.wipeout-type"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",g.forClass("wipeout.bindings.wo"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",g.forClass("wipeout.bindings.wipeout"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",g.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[l,o,p,q,n,m])})();var j=(function(){g.forClass("ko.templateEngine");var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",g.forClass("wipeout.template.engine"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",g.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[l,m])})();var k=(function(){var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",g.forClass("wipeout.utils.html"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",g.forClass("wipeout.utils.ko.virtualElements"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",g.forClass("wipeout.utils.ko.array"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",g.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:o,array:m}});var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",g.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[l,n,p])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[h,i,j,k])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[f,d,e])])}});a.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var d=function(e){this._super();this.classes=[]};d.prototype.getClassDescription=function(e){for(var f=0,g=this.classes.length;f<g;f++){if(this.classes[f].classConstructor===e){return this.classes[f].classDescription}}};d.prototype.forClass=function(f){var e=c(f);var h=this.getClassDescription(e);if(h){return h}var g=new Wipeout.Docs.Models.Descriptions.Class(f,this);this.classes.push({classDescription:g,classConstructor:e});return g};return d});a.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var d=function(g,e,f){this._super(g,e,d.compileBranches(e,f))};d.compileBranches=function(e,f){var g=[];f=f||{};f.staticEvents=f.staticEvents||{};f.staticProperties=f.staticProperties||{};f.staticFunctions=f.staticFunctions||{};f.events=f.events||{};f.properties=f.properties||{};f.functions=f.functions||{};g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));b(e.staticEvents,function(h){if(f.staticEvents[h.eventName]){g.push(f.staticEvents[h.eventName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.eventName,null))}});b(e.staticProperties,function(h){if(f.staticProperties[h.propertyName]){g.push(f.staticProperties[h.propertyName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.propertyName,null))}});b(e.staticFunctions,function(h){if(f.staticFunctions[h.functionName]){g.push(f.staticFunctions[h.functionName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.functionName,null))}});b(e.events,function(h){if(f.events[h.eventName]){g.push(f.events[h.eventName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.eventName,null))}});b(e.properties,function(h){if(f.staticProperties[h.propertyName]){g.push(f.staticProperties[h.propertyName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.propertyName,null))}});b(e.functions,function(h){if(f.functions[h.functionName]){g.push(f.functions[h.functionName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.functionName,null))}});g.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return g};return d});a.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var d=function(f,g,e){this._super(f,e);this.page=g};d.prototype.payload=function(){return this.page};return d});a.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var d=function(f,e){this._super();this.name=f;this.branches=e};d.prototype.payload=function(){return null};return d});a.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var d=function(f,e){this._super();this.className=d.getClassName(f);this.constructorFunction=c(f);this.classFullName=f;this.api=e;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};d.getClassName=function(e){e=e.split(".");return e[e.length-1]};d.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var h in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(h)){if(this.constructorFunction[h] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,h,this.classFullName))}else{if(this.constructorFunction[h] instanceof Function&&!ko.isObservable(this.constructorFunction[h])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[h],h,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,h,this.classFullName))}}}}for(var h in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(h)){if(this.constructorFunction.prototype[h] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,h,this.classFullName))}else{if(this.constructorFunction.prototype[h] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[h])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[h],h,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,h,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var e=new this.constructorFunction();for(var h in e){if(e.hasOwnProperty(h)){if(e[h] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,h,this.classFullName))}else{if(e[h] instanceof Function&&!ko.isObservable(e[h])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(e[h],h,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,h,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var g=this.constructorFunction;while((g=Object.getPrototypeOf(g.prototype).constructor)!==Object){var k=this.api.getClassDescription(g);if(!k){throw"Class has not been defined yet"}var f=function(i,n){b(k[i],function(o){if(this[i].indexOf(o)!==-1){return}for(var p=0,q=this[i].length;p<q;p++){if(this[i][p][n]===o[n]){if(!this[i][p].overrides){this[i][p].overrides=o}return}}this[i].push(o)},this)};f.call(this,"events","eventName");f.call(this,"properties","propertyName");f.call(this,"functions","functionName")}}var l=function(i){b(this[i],function(o){var n=o;while(n&&n.overrides&&!n.summary){if(n.overrides.summary){n.summary=n.overrides.summary+(n.overrides.summaryInherited?"":" (from "+n.overrides.classFullName+")");n.summaryInherited=true}n=n.overrides}})};l.call(this,"staticProperties");l.call(this,"staticFunctions");l.call(this,"staticEvents");l.call(this,"events");l.call(this,"properties");l.call(this,"functions");for(var h=0,j=this.functions.length;h<j;h++){if(this.functions[h].functionName==="constructor"){this.classConstructor=this.functions.splice(h,1)[0];break}}if(h===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var m=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(m);this.staticEvents.sort(m);this.properties.sort(m);this.staticProperties.sort(m);this.functions.sort(m);this.staticFunctions.sort(m)};return d});a.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(d,e){this._super();this.name=d;this.summary=e}});a.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var d=function(f,g,e){this._super(g,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(f,g));this.eventName=g;this.classFullName=e};return d});a.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var d=function(g,f,e){this._super(f,d.getFunctionSummary(g));this["function"]=g;this.functionName=f;this.classFullName=e;this.overrides=null};d.getFunctionSummary=function(i){var e=i.toString();var g=false;var f=false;var h=function(){var k=e.indexOf("//");var j=e.indexOf("/*");var l=e.indexOf("{");if(k===-1){k=Number.MAX_VALUE}if(j===-1){j=Number.MAX_VALUE}if(l<k&&l<j){e=e.substr(l+1).replace(/^\s+|\s+$/g,"")}else{if(k<j){e=e.substr(e.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{e=e.substr(e.indexOf("*/")).replace(/^\s+|\s+$/g,"")}h()}};h();if(e.indexOf("///<summary>")===0){return e.substring(12,e.indexOf("</summary>"))}return""};return d});a.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var e=function(g,h,f){this._super(h,e.getPropertySummary(g,h,f));this.propertyName=h;this.classFullName=f};var d=/^\/\//;e.getPropertySummary=function(g,h,f){var i;if(i=e.getPropertyDescriptionOverride(f+"."+h)){return i}g=g.toString();var j=function(n){var l=g.search(n);if(l!==-1){var k=g.substring(0,l);var m=k.lastIndexOf("\n");if(m>0){k=k.substring(m)}k=k.replace(/^\s+|\s+$/g,"");if(d.test(k)){return k.substring(2)}else{return null}}};i=j(new RegExp("\\s*this\\s*\\.\\s*"+h+"\\s*="));if(i){return i}return j(new RegExp('\\s*this\\s*\\[\\s*"'+h+'"\\s*\\]\\s*='))};e.getPropertyDescriptionOverride=function(f){var g=e.descriptionOverrides;b(f.split("."),function(h){if(!g){return}g=g[h]});return g};e.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block: "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block: "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return e});a.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(d){this._super();this.title=d}});a.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(d){this._super(d)}});a.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function d(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(e){this.model().content(e.data)},this)}d.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var d=function(e){this._super(e||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};d.prototype.onCodeChanged=function(e){};d.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var d=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};d.prototype.onModelChanged=function(g,e){this._super(g,e);var g=this.content();if(e==null){this.content(null)}else{var f=null;if(e instanceof Wipeout.Docs.Models.Pages.LandingPage){f=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(e instanceof Wipeout.Docs.Models.Descriptions.Class){f=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(e instanceof Wipeout.Docs.Models.Descriptions.Event){f=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(e instanceof Wipeout.Docs.Models.Descriptions.Property){f=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(e instanceof Wipeout.Docs.Models.Descriptions.Function){f=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}f.model(e);this.content(f)}};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var d=function(){this._super.apply(this,arguments)};d.prototype.onCodeChanged=function(e){new Function(e.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var d=function(){d.staticConstructor();this._super.apply(this,arguments)};var e;d.staticConstructor=function(){if(e){return}e=document.createElement("div");e.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(e)};d.prototype.onCodeChanged=function(f){e.innerHTML+=f.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var d=function(){this._super(d.nullTemplate)};d.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";d.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";d.nullTemplate=wo.visual.getBlankTemplateId();d.prototype.onModelChanged=function(f,e){this._super(f,e);if(e&&(e.branches||e.payload())){this.templateId(d.branchTemplate)}else{if(e){this.templateId(d.leafTemplate)}else{this.templateId(d.nullTemplate)}}};d.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var e=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&e){this.triggerRoutedEvent(d.renderPage,e)}};d.renderPage=new wo.routedEvent();return d});a.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var d=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};d.prototype.onCodeChanged=function(e){this.usage(e.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return d});a.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});a.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var d=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var e=this.model().classFullName+d.classUsagesTemplateSuffix;if(document.getElementById(e)){return e}}return wo.contentControl.getBlankTemplateId()},this)};d.classUsagesTemplateSuffix="_ClassUsages";return d});a.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});a.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});a.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});a.compile(window.Wipeout)})();

compiler.registerClass("Wipeout.Docs.Models.Application", "wo.object", function() {
    
    return function() {
        
        this.content = ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());
        
        var currentApi = new Wipeout.Docs.Models.Components.Api();
                
        //wo
        var _wo = (function() {
            var objectBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object", currentApi.forClass("wo.object"));
            var routedEventModelBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel", currentApi.forClass("wo.routedEventModel"));
            var visualBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual", currentApi.forClass("wo.visual"));
            var viewBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view", currentApi.forClass("wo.view"));
            var contentControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl", currentApi.forClass("wo.contentControl"));
            var ifBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if", currentApi.forClass("wo.if"));
            var itemsControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wo.itemsControl"));
            var eventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event", currentApi.forClass("wo.event"));
            var routedEventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent", currentApi.forClass("wo.routedEvent"));
            var routedEventArgsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs", currentApi.forClass("wo.routedEventArgs"));
            var routedEventRegistrationBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration", currentApi.forClass("wo.routedEventRegistration"));
            
            var htmlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html", currentApi.forClass("wo.html"));
            var koVirtualElementsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements", currentApi.forClass("wo.ko.virtualElements"));
            var koArrayBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array", currentApi.forClass("wipeout.utils.ko.array"));
            var koBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko", currentApi.forClass("wo.ko"), {staticProperties: {"virtualElements": koVirtualElementsBranch, "array": koArrayBranch}});
            var objBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj", currentApi.forClass("wo.obj"));
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("wo", [
                contentControlBranch,
                eventBranch,
                ifBranch,
                htmlBranch,
                itemsControlBranch,
                koBranch,
                objBranch,
                objectBranch,
                routedEventBranch,
                routedEventArgsBranch,
                routedEventModelBranch,
                routedEventRegistrationBranch,
                viewBranch,
                visualBranch
            ]);
        })();
        
        // bindings
        var _bindings = (function() {
            
            var itemsControl = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wipeout.bindings.itemsControl"));
            var render = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render", currentApi.forClass("wipeout.bindings.render"));
            var wipeout_type = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type", currentApi.forClass("wipeout.bindings.wipeout-type"));
            var _wo = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo", currentApi.forClass("wipeout.bindings.wo"));
            var _wipeout = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout", currentApi.forClass("wipeout.bindings.wipeout"));
            var _icRender = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render", currentApi.forClass("wipeout.bindings.ic-render"));
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings", [
                _icRender,
                itemsControl,
                render,
                wipeout_type,
                _wo,
                _wipeout
            ]);
        })();
                                     
        //wipeout
        var _wipeout = (function() {
            
            var _base = (function() {
                var objectBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object", currentApi.forClass("wo.object"));
                var routedEventModelBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel", currentApi.forClass("wo.routedEventModel"));
                var visualBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual", currentApi.forClass("wo.visual"));
                var viewBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view", currentApi.forClass("wo.view"));
                var contentControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl", currentApi.forClass("wo.contentControl"));
                var ifBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if", currentApi.forClass("wo.if"));
                var itemsControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wo.itemsControl"));
                var eventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event", currentApi.forClass("wo.event"));
                var routedEventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent", currentApi.forClass("wo.routedEvent"));
                var routedEventArgsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs", currentApi.forClass("wo.routedEventArgs"));
                var routedEventRegistrationBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration", currentApi.forClass("wo.routedEventRegistration"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("base", [
                    contentControlBranch,
                    eventBranch,
                    ifBranch,
                    itemsControlBranch,
                    objectBranch,
                    routedEventBranch,
                    routedEventArgsBranch,
                    routedEventModelBranch,
                    routedEventRegistrationBranch,
                    viewBranch,
                    visualBranch
                ]);
            })();
            
            var _bindings = (function() {
                
                var itemsControl = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wipeout.bindings.itemsControl"));
                var render = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render", currentApi.forClass("wipeout.bindings.render"));
                var wipeout_type = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type", currentApi.forClass("wipeout.bindings.wipeout-type"));
                var _wo = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo", currentApi.forClass("wipeout.bindings.wo"));
                var _wipeout = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout", currentApi.forClass("wipeout.bindings.wipeout"));
                var _icRender = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render", currentApi.forClass("wipeout.bindings.ic-render"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings", [
                    _icRender,
                    itemsControl,
                    render,
                    wipeout_type,
                    _wo,
                    _wipeout
                ]);
            })();
            
            var _template = (function() {
                currentApi.forClass("ko.templateEngine");
                var engine = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine", currentApi.forClass("wipeout.template.engine"));
                var htmlBuilder = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder", currentApi.forClass("wipeout.template.htmlBuilder"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("template", [
                    engine,
                    htmlBuilder
                ]);
            })();
            
            var _utils = (function() {
                
                var htmlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html", currentApi.forClass("wipeout.utils.html"));
                var koVirtualElementsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements", currentApi.forClass("wipeout.utils.ko.virtualElements"));
                var koArrayBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array", currentApi.forClass("wipeout.utils.ko.array"));
                var koBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko", currentApi.forClass("wipeout.utils.ko"), {staticProperties: {"virtualElements": koVirtualElementsBranch, "array": koArrayBranch}});
                var objBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj", currentApi.forClass("wipeout.utils.obj"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("utils", [
                    htmlBranch,
                    koBranch,
                    objBranch
                ]);
            })();
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)", [
                _base,
                _bindings,
                _template,
                _utils
            ]);
        })();
        
        this.menu =
            new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout", [
                new Wipeout.Docs.Models.Components.TreeViewBranch("API", [
                    _wo,
                    _bindings,
                    _wipeout
                ])
        ]);        
    };
});

compiler.registerClass("Wipeout.Docs.Models.Components.Api", "wo.object", function() {    
    
    var api = function(rootNamespace) {
        this._super();
        
        this.classes = [];
    };
    
    api.prototype.getClassDescription = function(classConstructor) {
        for(var i = 0, ii = this.classes.length; i < ii; i++)            
            if(this.classes[i].classConstructor === classConstructor)
                return this.classes[i].classDescription;
    };
    
    api.prototype.forClass = function(className) {
        
        var classConstructor = get(className);
        var result = this.getClassDescription(classConstructor);
        if(result)
            return result;
        
        var desc = new Wipeout.Docs.Models.Descriptions.Class(className, this);
        this.classes.push({
            classDescription: desc,
            classConstructor: classConstructor
        });
        
        return desc;
    };
    
    return api;
});

compiler.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch", "Wipeout.Docs.Models.Components.PageTreeViewBranch", function() {
    var classTreeViewBranch = function(name, classDescription, customBranches) {
        this._super(name, classDescription, classTreeViewBranch.compileBranches(classDescription, customBranches));
    };
    
    classTreeViewBranch.compileBranches = function(classDescription, customBranches /*optional*/) {
        var output = [];
        
        customBranches = customBranches || {};
        customBranches.staticEvents = customBranches.staticEvents || {};
        customBranches.staticProperties = customBranches.staticProperties || {};
        customBranches.staticFunctions = customBranches.staticFunctions || {};
        customBranches.events = customBranches.events || {};
        customBranches.properties = customBranches.properties || {};
        customBranches.functions = customBranches.functions || {};
        
        output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));    
        
        enumerate(classDescription.staticEvents, function(event) {
            if(customBranches.staticEvents[event.eventName])
                output.push(customBranches.staticEvents[event.eventName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(event.eventName, null));            
        });
        
        enumerate(classDescription.staticProperties, function(property) {
            if(customBranches.staticProperties[property.propertyName])
                output.push(customBranches.staticProperties[property.propertyName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(property.propertyName, null));
        });
        
        enumerate(classDescription.staticFunctions, function(_function) {
            if(customBranches.staticFunctions[_function.functionName])
                output.push(customBranches.staticFunctions[_function.functionName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(_function.functionName, null));            
        });
        
        enumerate(classDescription.events, function(event) {
            if(customBranches.events[event.eventName])
                output.push(customBranches.events[event.eventName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(event.eventName, null));            
        });
        
        enumerate(classDescription.properties, function(property) {
            if(customBranches.staticProperties[property.propertyName])
                output.push(customBranches.staticProperties[property.propertyName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(property.propertyName, null));            
        });
        
        enumerate(classDescription.functions, function(_function) {
            if(customBranches.functions[_function.functionName])
                output.push(customBranches.functions[_function.functionName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(_function.functionName, null));            
        });
        
        output.sort(function() { return arguments[0].name === "constructor" ? -1 : arguments[0].name.localeCompare(arguments[1].name); });
        return output;
    };
    
    return classTreeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch", "Wipeout.Docs.Models.Components.TreeViewBranch", function() {
    var pageTreeViewBranch = function(name, page, branches) {
        this._super(name, branches);
            
        this.page = page;
    };
    
    pageTreeViewBranch.prototype.payload = function() {
        return this.page;
    };
    
    return pageTreeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch", "wo.object", function() {
    var treeViewBranch = function(name, branches) {
        this._super();
            
        this.name = name;
        this.branches = branches;
    };
    
    treeViewBranch.prototype.payload = function() {
        return null;
    };
    
    return treeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Class", "wo.object", function() {
    var classDescription = function(classFullName, api) {
        this._super();
        
        this.className = classDescription.getClassName(classFullName);
        this.constructorFunction = get(classFullName);
        this.classFullName = classFullName;
        this.api = api;
        
        this.classConstructor = null;
        this.events = [];
        this.staticEvents = [];
        this.properties = [];
        this.staticProperties = [];
        this.functions = [];
        this.staticFunctions = [];
        
        this.rebuild();
    };
    
    classDescription.getClassName = function(classFullName) {
        classFullName = classFullName.split(".");
        return classFullName[classFullName.length - 1];
    };
    
    classDescription.prototype.rebuild = function() {
        this.classConstructor = null;
        this.events.length = 0;
        this.staticEvents.length = 0;
        this.properties.length = 0;
        this.staticProperties.length = 0;
        this.functions.length = 0;
        this.staticFunctions.length = 0;
                
        for(var i in this.constructorFunction) {
            if(this.constructorFunction.hasOwnProperty(i)) {
                if(this.constructorFunction[i] instanceof wo.event) {
                    this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                } else if(this.constructorFunction[i] instanceof Function && !ko.isObservable(this.constructorFunction[i])) {
                    this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[i], i, this.classFullName));
                } else {
                    this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                }
            }
        }
        
        for(var i in this.constructorFunction.prototype) {
            if(this.constructorFunction.prototype.hasOwnProperty(i)) {                    
                if(this.constructorFunction.prototype[i] instanceof wo.event) { 
                    this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                } else if(this.constructorFunction.prototype[i] instanceof Function && !ko.isObservable(this.constructorFunction.prototype[i])) {
                    this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[i], i, this.classFullName));
                } else {
                    this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                }
            }
        }
        
        if(this.constructorFunction.constructor === Function) {
            var anInstance = new this.constructorFunction();        
            for(var i in anInstance) {
                if(anInstance.hasOwnProperty(i)) {                    
                    if(anInstance[i] instanceof wo.event) { 
                        this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                    } else if(anInstance[i] instanceof Function && !ko.isObservable(anInstance[i])) { 
                        this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(anInstance[i], i, this.classFullName));
                    } else {
                        this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                    }
                }
            }
        }
        
        if(this.constructorFunction.constructor === Function) {
            var current = this.constructorFunction;
            while((current = Object.getPrototypeOf(current.prototype).constructor) !== Object) {  
                var parentClass = this.api.getClassDescription(current);
                if(!parentClass)
                    throw "Class has not been defined yet";
                
                var copy = function(fromTo, nameProperty) {
                    enumerate(parentClass[fromTo], function(fn) { 
                        if(this[fromTo].indexOf(fn) !== -1) return;
                        
                        for(var i = 0, ii = this[fromTo].length; i < ii; i++) {                    
                            if(this[fromTo][i][nameProperty] === fn[nameProperty]) {
                                if(!this[fromTo][i].overrides)
                                    this[fromTo][i].overrides = fn;
                                
                                return;
                            }
                        }
                        
                        this[fromTo].push(fn);
                    }, this);
                };
                
                // instance items only (no statics)
                copy.call(this, "events", "eventName");
                copy.call(this, "properties", "propertyName");
                copy.call(this, "functions", "functionName");
            }
        }
        
        var pullSummaryFromOverride = function(fromTo) {
            enumerate(this[fromTo], function(item) {
                var current = item;
                while (current && current.overrides && !current.summary) {
                    if(current.overrides.summary) {
                        current.summary = current.overrides.summary + 
                            (current.overrides.summaryInherited ? "" : " (from " + current.overrides.classFullName + ")");
                        current.summaryInherited = true;
                    }
                    
                    current = current.overrides;
                }
            });
        };
        
        pullSummaryFromOverride.call(this, "staticProperties");
        pullSummaryFromOverride.call(this, "staticFunctions");
        pullSummaryFromOverride.call(this, "staticEvents");
        pullSummaryFromOverride.call(this, "events");
        pullSummaryFromOverride.call(this, "properties");
        pullSummaryFromOverride.call(this, "functions");
        
        for(var i = 0, ii = this.functions.length; i < ii; i++) {
            if(this.functions[i].functionName === "constructor") {
                this.classConstructor = this.functions.splice(i, 1)[0];
                break;
            }
        }
        
        if(i === this.functions.length)
            this.classConstructor = new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction, this.className, this.classFullName);
        
        var sort = function() { return arguments[0].name.localeCompare(arguments[1].name); };
        
        this.events.sort(sort);
        this.staticEvents.sort(sort);
        this.properties.sort(sort);
        this.staticProperties.sort(sort);
        this.functions.sort(sort);
        this.staticFunctions.sort(sort);
    };
    
    return classDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem", "wo.object", function() {
    return function(itemName, itemSummary) {
        this._super();
        
        this.name = itemName;
        this.summary = itemSummary;
    }
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Event", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    var eventDescription = function(constructorFunction, eventName, classFullName) {
        this._super(eventName, Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(constructorFunction, eventName));
        
        this.eventName = eventName;
        this.classFullName = classFullName;
    };
    
    return eventDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Function", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    
    var functionDescription = function(theFunction, functionName, classFullName) {
        this._super(functionName, functionDescription.getFunctionSummary(theFunction));
        
        this["function"] = theFunction;
        this.functionName = functionName;
        this.classFullName = classFullName;
        
        this.overrides = null;
    };
        
    functionDescription.getFunctionSummary = function(theFunction) {
        var functionString = theFunction.toString();
        
        var isInlineComment = false;
        var isBlockComment = false;
        
        var removeFunctionDefinition = function() {
            var firstInline = functionString.indexOf("//");
            var firstBlock = functionString.indexOf("/*");
            var openFunction = functionString.indexOf("{");
            
            if(firstInline === -1) firstInline = Number.MAX_VALUE;
            if(firstBlock === -1) firstBlock = Number.MAX_VALUE;
                    
            if(openFunction < firstInline && openFunction < firstBlock) {
                functionString = functionString.substr(openFunction + 1).replace(/^\s+|\s+$/g, '');
            } else { 
                if(firstInline < firstBlock) {
                    functionString = functionString.substr(functionString.indexOf("\n")).replace(/^\s+|\s+$/g, '');
                } else {
                    functionString = functionString.substr(functionString.indexOf("*/")).replace(/^\s+|\s+$/g, '');
                }
                
                removeFunctionDefinition();
            }
        };
        
        removeFunctionDefinition();
        
        if (functionString.indexOf("///<summary>") === 0) {
            return functionString.substring(12, functionString.indexOf("</summary>"));
        }
        
        return "";   
    };  
    
    return functionDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    var property = function(constructorFunction, propertyName, classFullName) {
        this._super(propertyName, property.getPropertySummary(constructorFunction, propertyName, classFullName));
        
        this.propertyName = propertyName;
        this.classFullName = classFullName;
    };
    
    var inlineCommentOnly = /^\/\//;
    property.getPropertySummary = function(constructorFunction, propertyName, classFullName) {
        var result;
        if(result =  property.getPropertyDescriptionOverride(classFullName + "." + propertyName))
            return result;
        
        constructorFunction = constructorFunction.toString();
                
        var search = function(regex) {
            var i = constructorFunction.search(regex);
            if(i !== -1) {
                var func = constructorFunction.substring(0, i);
                var lastLine = func.lastIndexOf("\n");
                if(lastLine > 0) {
                    func = func.substring(lastLine);
                } 
                
                func = func.replace(/^\s+|\s+$/g, '');
                if(inlineCommentOnly.test(func))
                    return func.substring(2);
                else
                    return null;
            }
        }
        
        result = search(new RegExp("\\s*this\\s*\\.\\s*" + propertyName + "\\s*="));
        if(result)
            return result;
                
        return search(new RegExp("\\s*this\\s*\\[\\s*\"" + propertyName + "\"\\s*\\]\\s*="));        
    };
    
    property.getPropertyDescriptionOverride = function(classDelimitedPropertyName) {
        
        var current = property.descriptionOverrides;
        enumerate(classDelimitedPropertyName.split("."), function(item) {
            if(!current) return;
            current = current[item];
        });
        
        return current;
    };
        
    property.descriptionOverrides = {
        wo: {
            'if': {
                woInvisibleDefault: "The default value for woInvisible for the wo.if class."
            },
            html: {
                specialTags: "A list of html tags which cannot be placed inside a div element."
            },
            ko: {
                array: "Utils for operating on observableArrays",
                virtualElements: "Utils for operating on knockout virtual elements"
            },
            object: {
                useVirtualCache: "When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."
            },
            view: {
                //TODO: give this a page
                objectParser: "Used to parse string values into a given type",
                //TODO: give this a page
                reservedPropertyNames: "Properties which cannot be set on a wipeout object via the template"
            },
            visual: {
                reservedTags: "A list of names which cannot be used as wipeout object names. These are mostly html tag names",
                woInvisibleDefault: "The default value for woInvisible for the wo.visual class."
            }
        },
        wipeout: {
            template: {
                engine: {
                    closeCodeTag: "Signifies the end of a wipeout code block: \"" + wipeout.template.engine.closeCodeTag + "\".",
                    instance: "An instance of a wipeout.template.engine which is used by the render binding.",
                    openCodeTag: "Signifies the beginning of a wipeout code block: \"" + wipeout.template.engine.openCodeTag + "\".",
                    scriptCache: "A placeholder for precompiled scripts.",
                    scriptHasBeenReWritten: "TODO"
                }
            }
        }
    };
    
    return property;
});

compiler.registerClass("Wipeout.Docs.Models.Pages.DisplayItem", "wo.object", function() {
    return function(name) {
        this._super();
        
        this.title = name;
    };
});

compiler.registerClass("Wipeout.Docs.Models.Pages.LandingPage", "Wipeout.Docs.Models.Pages.DisplayItem", function() {
    return function(title) {
       this._super(title); 
    }
});


compiler.registerClass("Wipeout.Docs.ViewModels.Application", "wo.view", function() {
    
    function application() {
        this._super("Wipeout.Docs.ViewModels.Application");
        
        this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage, function (args) {
            this.model().content(args.data);
        }, this);
    };
    
    application.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        
        //TODO: this
        this.templateItems.treeView.select();
    };
    
    return application;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock", "wo.view", function() {
    var codeBlock = function(templateId) {
        this._super(templateId || "Wipeout.Docs.ViewModels.Components.CodeBlock");        
        this.code = ko.observable();
        
        this.code.subscribe(this.onCodeChanged, this);
    };
    
    codeBlock.prototype.onCodeChanged = function(newVal) {
    };
    
    codeBlock.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        prettyPrint(null, this.templateItems.codeBlock);
    };
    
    return codeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender", "wo.contentControl", function() {
    var dynamicRender = function() {
        this._super();
        
        this.content = ko.observable();
        
        this.template("<!-- ko render: content --><!-- /ko -->");
    };
    
    dynamicRender.prototype.onModelChanged = function(oldVal, newVal) {
        this._super(oldVal, newVal);
               
        var oldVal = this.content();
        
        if(newVal == null) {
            this.content(null);
        } else {
            var newVm = null;
            if(newVal instanceof Wipeout.Docs.Models.Pages.LandingPage) {
                newVm = new Wipeout.Docs.ViewModels.Pages.LandingPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Class) {
                newVm = new Wipeout.Docs.ViewModels.Pages.ClassPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Event) {
                newVm = new Wipeout.Docs.ViewModels.Pages.EventPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Property) {
                newVm = new Wipeout.Docs.ViewModels.Pages.PropertyPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Function) {
                newVm = new Wipeout.Docs.ViewModels.Pages.FunctionPage();
            } else {
                throw "Unknown model type";
            }
            
            newVm.model(newVal);
            this.content(newVm);
        }
    };  
    
    return dynamicRender
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function () {
    var jsCodeBlock = function() {
        this._super.apply(this, arguments);
    };
    
    jsCodeBlock.prototype.onCodeChanged = function(newVal) {  
        new Function(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"))();
    };

    return jsCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function() {
    var templateCodeBlock = function() {
        templateCodeBlock.staticConstructor();
        this._super.apply(this, arguments);
    };
    
    var templateDiv;
    templateCodeBlock.staticConstructor = function() {
        if(templateDiv) return;
        
        templateDiv = document.createElement("div");
        templateDiv.setAttribute("style", "display: none");
        document.getElementsByTagName("body")[0].appendChild(templateDiv);
    };
    
    templateCodeBlock.prototype.onCodeChanged = function(newVal) {  
        templateDiv.innerHTML += newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&gt;/g, ">");
    };
    
    return templateCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch", "wo.view", function() {
    var treeViewBranch = function() {
        this._super(treeViewBranch.nullTemplate);  
    };
    
    treeViewBranch.branchTemplate = "Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";
    treeViewBranch.leafTemplate = "Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";
    treeViewBranch.nullTemplate = wo.visual.getBlankTemplateId();
    
    treeViewBranch.prototype.onModelChanged = function(oldVal, newVal) {  
        this._super(oldVal, newVal);
        if(newVal && (newVal.branches || newVal.payload())) {
            this.templateId(treeViewBranch.branchTemplate);
        } else if(newVal) {
            this.templateId(treeViewBranch.leafTemplate);
        } else {
            this.templateId(treeViewBranch.nullTemplate);
        }
    };
    
    treeViewBranch.prototype.select = function() {
        if(this.model().branches)
            $(this.templateItems.content).toggle();
        
        var payload = this.model().payload();
        if ($(this.templateItems.content).filter(":visible").length && payload) {
            this.triggerRoutedEvent(treeViewBranch.renderPage, payload);
        }
    };
    
    treeViewBranch.renderPage = new wo.routedEvent(); 
    
    return treeViewBranch;
});


compiler.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function() {
    var usageCodeBlock = function() {
        this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");
        
        this.usage = ko.observable();
    };
    
    usageCodeBlock.prototype.onCodeChanged = function(newVal) {  
        this.usage(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"));
    };
    
    return usageCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable", "wo.itemsControl", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable", "Wipeout.Docs.ViewModels.Pages.ClassItemRow");
    };
});


    compiler.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage", "wo.view", function() {
        var classPage = function() {
            this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");

            this.usagesTemplateId = ko.computed(function() {
                if(this.model()) {
                    var className = this.model().classFullName + classPage.classUsagesTemplateSuffix;
                    if(document.getElementById(className))
                        return className;
                }

                return wo.contentControl.getBlankTemplateId();
            }, this);
        };

        classPage.classUsagesTemplateSuffix = "_ClassUsages";
        
        return classPage;
    });

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage");
    };
});


compiler.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.LandingPage");
    };
});

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage");
    };
});

compiler.compile(window.Wipeout);


//window.Wipeout = Wipeout;



})();


(function(){window.Wipeout={};Wipeout.compiler=(function(){var f=function(h,g){this.classes=[];for(var j=0,k=h.length;j<k;j++){this.classes.push(h[j])}this.compiled=[];for(var j=0,k=g.length;j<k;j++){this.compiled.push({name:g[j],value:e(g[j])})}};function e(k){var g=window;k=k.split(".");for(var h=0,j=k.length;h<j;h++){g=g[k[h]]}return g}f.prototype.checkDependency=function(g){for(var h=0,j=this.compiled.length;h<j;h++){if(this.compiled[h].name===g){return true}}return false};f.prototype.getClass=function(g){for(var h=0,j=this.compiled.length;h<j;h++){if(this.compiled[h].name===g){return this.compiled[h].value}}return null};f.prototype.checkDependencies=function(g){for(var h=0,j=g.length;h<j;h++){if(!this.checkDependency(g[h])){return false}}return true};f.prototype.compile=function(){while(this.classes.length){var l=this.classes.length;for(var h=0;h<this.classes.length;h++){if(this.checkDependencies(this.classes[h].dependencies)){var g=this.classes[h].className;if(g.indexOf(".")!==-1){g=g.substr(g.lastIndexOf(".")+1)}var m=this.classes[h].constructor();var o={};for(var k in m){o[k]=m[k]}var n=m.prototype;m=this.getClass(this.classes[h].parentClass).extend(m,g);for(k in n){m.prototype[k]=n[k]}for(k in o){m[k]=o[k]}this.compiled.push({name:this.classes[h].className,value:m});this.classes.splice(h,1);h--}}if(l===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function d(i,g,h){this.rootNamespace=i;this.baseClass=g;this.dependencies=h||[];this.classes=[]}d.prototype.namespaceCorrectly=function(g){if(this.rootNamespace&&g&&g.indexOf(this.rootNamespace+".")===0){g=g.substr(this.rootNamespace.length+1)}return g};d.prototype.registerClass=function(h,l,g){var l=!l||l===this.baseClass?this.baseClass:this.namespaceCorrectly(l);var m={className:this.namespaceCorrectly(h),constructor:g,parentClass:l,dependencies:[l]};for(var j=0,k=this.classes.length;j<k;j++){if(this.classes[j].className===m.className){throw"There is already a class named "+h}}for(j=3,k=arguments.length;j<k;j++){m.dependencies.push(this.namespaceCorrectly(arguments[j]))}this.classes.push(m)};d.append=function(g,l){var k=g.name.split(".");for(var h=0,j=k.length-1;h<j;h++){l=l[k[h]]=l[k[h]]||{}}l[k[h]]=g.value};d.prototype.compile=function(l){l=l||{};var g=[this.baseClass];for(var h=0,k=this.dependencies.length;h<k;h++){g.push(this.dependencies[h])}var j=new f(this.classes,g);j.compile();for(h=1,k=j.compiled.length;h<k;h++){d.append(j.compiled[h],l)}return l};return d})();var a=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);var b=function(f,d,e){e=e||window;if(f){for(var g=0,h=f.length;g<h;g++){d.call(e,f[g],g)}}};var c=function(e,f){var d=f||window;b(e.split("."),function(g){d=d[g]});return d};(function(){window.Wipeout={};Wipeout.compiler=(function(){var i=function(k,j){this.classes=[];for(var l=0,m=k.length;l<m;l++){this.classes.push(k[l])}this.compiled=[];for(var l=0,m=j.length;l<m;l++){this.compiled.push({name:j[l],value:h(j[l])})}};function h(m){var j=window;m=m.split(".");for(var k=0,l=m.length;k<l;k++){j=j[m[k]]}return j}i.prototype.checkDependency=function(j){for(var k=0,l=this.compiled.length;k<l;k++){if(this.compiled[k].name===j){return true}}return false};i.prototype.getClass=function(j){for(var k=0,l=this.compiled.length;k<l;k++){if(this.compiled[k].name===j){return this.compiled[k].value}}return null};i.prototype.checkDependencies=function(j){for(var k=0,l=j.length;k<l;k++){if(!this.checkDependency(j[k])){return false}}return true};i.prototype.compile=function(){while(this.classes.length){var n=this.classes.length;for(var l=0;l<this.classes.length;l++){if(this.checkDependencies(this.classes[l].dependencies)){var k=this.classes[l].className;if(k.indexOf(".")!==-1){k=k.substr(k.lastIndexOf(".")+1)}var o=this.classes[l].constructor();var q={};for(var m in o){q[m]=o[m]}var p=o.prototype;o=this.getClass(this.classes[l].parentClass).extend(o,k);for(m in p){o.prototype[m]=p[m]}for(m in q){o[m]=q[m]}this.compiled.push({name:this.classes[l].className,value:o});this.classes.splice(l,1);l--}}if(n===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function g(l,j,k){this.rootNamespace=l;this.baseClass=j;this.dependencies=k||[];this.classes=[]}g.prototype.namespaceCorrectly=function(j){if(this.rootNamespace&&j&&j.indexOf(this.rootNamespace+".")===0){j=j.substr(this.rootNamespace.length+1)}return j};g.prototype.registerClass=function(k,n,j){var n=!n||n===this.baseClass?this.baseClass:this.namespaceCorrectly(n);var o={className:this.namespaceCorrectly(k),constructor:j,parentClass:n,dependencies:[n]};for(var l=0,m=this.classes.length;l<m;l++){if(this.classes[l].className===o.className){throw"There is already a class named "+k}}for(l=3,m=arguments.length;l<m;l++){o.dependencies.push(this.namespaceCorrectly(arguments[l]))}this.classes.push(o)};g.append=function(j,n){var m=j.name.split(".");for(var k=0,l=m.length-1;k<l;k++){n=n[m[k]]=n[m[k]]||{}}n[m[k]]=j.value};g.prototype.compile=function(n){n=n||{};var j=[this.baseClass];for(var k=0,m=this.dependencies.length;k<m;k++){j.push(this.dependencies[k])}var l=new i(this.classes,j);l.compile();for(k=1,m=l.compiled.length;k<m;k++){g.append(l.compiled[k],n)}return n};return g})();var d=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);var e=function(j,g,h){h=h||window;if(j){for(var k=0,l=j.length;k<l;k++){g.call(h,j[k],k)}}};var f=function(h,i){var g=i||window;e(h.split("."),function(j){g=g[j]});return g};(function(){window.Wipeout={};Wipeout.compiler=(function(){var l=function(n,m){this.classes=[];for(var o=0,p=n.length;o<p;o++){this.classes.push(n[o])}this.compiled=[];for(var o=0,p=m.length;o<p;o++){this.compiled.push({name:m[o],value:k(m[o])})}};function k(p){var m=window;p=p.split(".");for(var n=0,o=p.length;n<o;n++){m=m[p[n]]}return m}l.prototype.checkDependency=function(m){for(var n=0,o=this.compiled.length;n<o;n++){if(this.compiled[n].name===m){return true}}return false};l.prototype.getClass=function(m){for(var n=0,o=this.compiled.length;n<o;n++){if(this.compiled[n].name===m){return this.compiled[n].value}}return null};l.prototype.checkDependencies=function(m){for(var n=0,o=m.length;n<o;n++){if(!this.checkDependency(m[n])){return false}}return true};l.prototype.compile=function(){while(this.classes.length){var p=this.classes.length;for(var n=0;n<this.classes.length;n++){if(this.checkDependencies(this.classes[n].dependencies)){var m=this.classes[n].className;if(m.indexOf(".")!==-1){m=m.substr(m.lastIndexOf(".")+1)}var q=this.classes[n].constructor();var s={};for(var o in q){s[o]=q[o]}var r=q.prototype;q=this.getClass(this.classes[n].parentClass).extend(q,m);for(o in r){q.prototype[o]=r[o]}for(o in s){q[o]=s[o]}this.compiled.push({name:this.classes[n].className,value:q});this.classes.splice(n,1);n--}}if(p===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function j(o,m,n){this.rootNamespace=o;this.baseClass=m;this.dependencies=n||[];this.classes=[]}j.prototype.namespaceCorrectly=function(m){if(this.rootNamespace&&m&&m.indexOf(this.rootNamespace+".")===0){m=m.substr(this.rootNamespace.length+1)}return m};j.prototype.registerClass=function(n,q,m){var q=!q||q===this.baseClass?this.baseClass:this.namespaceCorrectly(q);var r={className:this.namespaceCorrectly(n),constructor:m,parentClass:q,dependencies:[q]};for(var o=0,p=this.classes.length;o<p;o++){if(this.classes[o].className===r.className){throw"There is already a class named "+n}}for(o=3,p=arguments.length;o<p;o++){r.dependencies.push(this.namespaceCorrectly(arguments[o]))}this.classes.push(r)};j.append=function(m,q){var p=m.name.split(".");for(var n=0,o=p.length-1;n<o;n++){q=q[p[n]]=q[p[n]]||{}}q[p[n]]=m.value};j.prototype.compile=function(q){q=q||{};var m=[this.baseClass];for(var n=0,p=this.dependencies.length;n<p;n++){m.push(this.dependencies[n])}var o=new l(this.classes,m);o.compile();for(n=1,p=o.compiled.length;n<p;n++){j.append(o.compiled[n],q)}return q};return j})();var g=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);window.NS=function(m){m=m.split(".");var j=window;for(var k=0,l=m.length;k<l;k++){j=j[m[k]]||(j[m[k]]={})}return j};window.vmChooser=function(j){j=ko.unwrap(j);if(j==null){return null}throw"Unknown model type"};g.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function j(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(k){this.model().content(k.data)},this)}j.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var j=function(k){this._super(k||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};j.prototype.onCodeChanged=function(k){};j.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var j=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};j.prototype.onModelChanged=function(m,k){this._super(m,k);var m=this.content();if(k==null){this.content(null)}else{var l=null;if(k instanceof Wipeout.Docs.Models.Pages.LandingPage){l=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Class){l=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Event){l=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Property){l=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Function){l=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}l.model(k);this.content(l)}};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){this._super.apply(this,arguments)};j.prototype.onCodeChanged=function(k){new Function(k.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){j.staticConstructor();this._super.apply(this,arguments)};var k;j.staticConstructor=function(){if(k){return}k=document.createElement("div");k.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(k)};j.prototype.onCodeChanged=function(l){k.innerHTML+=l.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var j=function(){this._super(j.nullTemplate)};j.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";j.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";j.nullTemplate=wo.visual.getBlankTemplateId();j.prototype.onModelChanged=function(l,k){this._super(l,k);if(k&&(k.branches||k.payload())){this.templateId(j.branchTemplate)}else{if(k){this.templateId(j.leafTemplate)}else{this.templateId(j.nullTemplate)}}};j.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var k=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&k){this.triggerRoutedEvent(j.renderPage,k)}};j.renderPage=new wo.routedEvent();return j});g.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};j.prototype.onCodeChanged=function(k){this.usage(k.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return j});g.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var j=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var k=this.model().classFullName+j.classUsagesTemplateSuffix;if(document.getElementById(k)){return k}}return wo.contentControl.getBlankTemplateId()},this)};j.classUsagesTemplateSuffix="_ClassUsages";return j});g.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});g.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var m=new Wipeout.Docs.Models.Components.Api();var l=(function(){var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",m.forClass("wo.object"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",m.forClass("wo.routedEventModel"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",m.forClass("wo.visual"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",m.forClass("wo.view"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",m.forClass("wo.contentControl"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",m.forClass("wo.if"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",m.forClass("wo.itemsControl"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",m.forClass("wo.event"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",m.forClass("wo.routedEvent"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",m.forClass("wo.routedEventArgs"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",m.forClass("wo.routedEventRegistration"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",m.forClass("wo.html"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",m.forClass("wo.ko.virtualElements"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",m.forClass("wipeout.utils.ko.array"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",m.forClass("wo.ko"),{staticProperties:{virtualElements:u,array:s}});var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",m.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[n,o,q,p,r,t,v,w,y,x,z,A,B,C])})();var j=(function(){var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",m.forClass("wipeout.bindings.itemsControl"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",m.forClass("wipeout.bindings.render"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",m.forClass("wipeout.bindings.wipeout-type"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",m.forClass("wipeout.bindings.wo"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",m.forClass("wipeout.bindings.wipeout"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",m.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[n,q,r,s,p,o])})();var k=(function(){var n=(function(){var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",m.forClass("wo.object"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",m.forClass("wo.routedEventModel"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",m.forClass("wo.visual"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",m.forClass("wo.view"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",m.forClass("wo.contentControl"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",m.forClass("wo.if"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",m.forClass("wo.itemsControl"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",m.forClass("wo.event"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",m.forClass("wo.routedEvent"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",m.forClass("wo.routedEventArgs"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",m.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[r,s,t,u,v,x,w,y,z,A,B])})();var o=(function(){var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",m.forClass("wipeout.bindings.itemsControl"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",m.forClass("wipeout.bindings.render"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",m.forClass("wipeout.bindings.wipeout-type"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",m.forClass("wipeout.bindings.wo"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",m.forClass("wipeout.bindings.wipeout"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",m.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[r,u,v,w,t,s])})();var p=(function(){m.forClass("ko.templateEngine");var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",m.forClass("wipeout.template.engine"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",m.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[r,s])})();var q=(function(){var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",m.forClass("wipeout.utils.html"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",m.forClass("wipeout.utils.ko.virtualElements"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",m.forClass("wipeout.utils.ko.array"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",m.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:u,array:s}});var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",m.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[r,t,v])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[n,o,p,q])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[l,j,k])])}});var h=function(l,j,k){k=k||window;if(l){for(var m=0,n=l.length;m<n;m++){j.call(k,l[m],m)}}};var i=function(k,l){var j=l||window;h(k.split("."),function(m){j=j[m]});return j};g.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var j=function(k){this._super();this.classes=[]};j.prototype.getClassDescription=function(k){for(var l=0,m=this.classes.length;l<m;l++){if(this.classes[l].classConstructor===k){return this.classes[l].classDescription}}};j.prototype.forClass=function(l){var k=i(l);var n=this.getClassDescription(k);if(n){return n}var m=new Wipeout.Docs.Models.Descriptions.Class(l,this);this.classes.push({classDescription:m,classConstructor:k});return m};return j});g.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var j=function(m,k,l){this._super(m,k,j.compileBranches(k,l))};j.compileBranches=function(k,l){var m=[];l=l||{};l.staticEvents=l.staticEvents||{};l.staticProperties=l.staticProperties||{};l.staticFunctions=l.staticFunctions||{};l.events=l.events||{};l.properties=l.properties||{};l.functions=l.functions||{};m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));h(k.staticEvents,function(n){if(l.staticEvents[n.eventName]){m.push(l.staticEvents[n.eventName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.eventName,null))}});h(k.staticProperties,function(n){if(l.staticProperties[n.propertyName]){m.push(l.staticProperties[n.propertyName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.propertyName,null))}});h(k.staticFunctions,function(n){if(l.staticFunctions[n.functionName]){m.push(l.staticFunctions[n.functionName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.functionName,null))}});h(k.events,function(n){if(l.events[n.eventName]){m.push(l.events[n.eventName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.eventName,null))}});h(k.properties,function(n){if(l.staticProperties[n.propertyName]){m.push(l.staticProperties[n.propertyName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.propertyName,null))}});h(k.functions,function(n){if(l.functions[n.functionName]){m.push(l.functions[n.functionName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.functionName,null))}});m.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return m};return j});g.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var j=function(l,m,k){this._super(l,k);this.page=m};j.prototype.payload=function(){return this.page};return j});g.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var j=function(l,k){this._super();this.name=l;this.branches=k};j.prototype.payload=function(){return null};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var j=function(l,k){this._super();this.className=j.getClassName(l);this.constructorFunction=i(l);this.classFullName=l;this.api=k;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};j.getClassName=function(k){k=k.split(".");return k[k.length-1]};j.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var n in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(n)){if(this.constructorFunction[n] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,n,this.classFullName))}else{if(this.constructorFunction[n] instanceof Function&&!ko.isObservable(this.constructorFunction[n])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[n],n,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,n,this.classFullName))}}}}for(var n in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(n)){if(this.constructorFunction.prototype[n] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,n,this.classFullName))}else{if(this.constructorFunction.prototype[n] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[n])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[n],n,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,n,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var k=new this.constructorFunction();for(var n in k){if(k.hasOwnProperty(n)){if(k[n] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,n,this.classFullName))}else{if(k[n] instanceof Function&&!ko.isObservable(k[n])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(k[n],n,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,n,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var m=this.constructorFunction;while((m=Object.getPrototypeOf(m.prototype).constructor)!==Object){var p=this.api.getClassDescription(m);if(!p){throw"Class has not been defined yet"}var l=function(s,t){h(p[s],function(u){if(this[s].indexOf(u)!==-1){return}for(var v=0,w=this[s].length;v<w;v++){if(this[s][v][t]===u[t]){if(!this[s][v].overrides){this[s][v].overrides=u}return}}this[s].push(u)},this)};l.call(this,"events","eventName");l.call(this,"properties","propertyName");l.call(this,"functions","functionName")}}var q=function(s){h(this[s],function(u){var t=u;while(t&&t.overrides&&!t.summary){if(t.overrides.summary){t.summary=t.overrides.summary+(t.overrides.summaryInherited?"":" (from "+t.overrides.classFullName+")");t.summaryInherited=true}t=t.overrides}})};q.call(this,"staticProperties");q.call(this,"staticFunctions");q.call(this,"staticEvents");q.call(this,"events");q.call(this,"properties");q.call(this,"functions");for(var n=0,o=this.functions.length;n<o;n++){if(this.functions[n].functionName==="constructor"){this.classConstructor=this.functions.splice(n,1)[0];break}}if(n===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var r=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(r);this.staticEvents.sort(r);this.properties.sort(r);this.staticProperties.sort(r);this.functions.sort(r);this.staticFunctions.sort(r)};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(j,k){this._super();this.name=j;this.summary=k}});g.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var j=function(l,m,k){this._super(m,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(l,m));this.eventName=m;this.classFullName=k};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var j=function(m,l,k){this._super(l,j.getFunctionSummary(m));this["function"]=m;this.functionName=l;this.classFullName=k;this.overrides=null};j.getFunctionSummary=function(o){var k=o.toString();var m=false;var l=false;var n=function(){var q=k.indexOf("//");var p=k.indexOf("/*");var r=k.indexOf("{");if(q===-1){q=Number.MAX_VALUE}if(p===-1){p=Number.MAX_VALUE}if(r<q&&r<p){k=k.substr(r+1).replace(/^\s+|\s+$/g,"")}else{if(q<p){k=k.substr(k.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{k=k.substr(k.indexOf("*/")).replace(/^\s+|\s+$/g,"")}n()}};n();if(k.indexOf("///<summary>")===0){return k.substring(12,k.indexOf("</summary>"))}return""};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var k=function(m,n,l){this._super(n,k.getPropertySummary(m,n,l));this.propertyName=n;this.classFullName=l};var j=/^\/\//;k.getPropertySummary=function(m,n,l){var o;if(o=k.getPropertyDescriptionOverride(l+"."+n)){return o}m=m.toString();var p=function(t){var r=m.search(t);if(r!==-1){var q=m.substring(0,r);var s=q.lastIndexOf("\n");if(s>0){q=q.substring(s)}q=q.replace(/^\s+|\s+$/g,"");if(j.test(q)){return q.substring(2)}else{return null}}};o=p(new RegExp("\\s*this\\s*\\.\\s*"+n+"\\s*="));if(o){return o}return p(new RegExp('\\s*this\\s*\\[\\s*"'+n+'"\\s*\\]\\s*='))};k.getPropertyDescriptionOverride=function(l){var m=k.descriptionOverrides;h(l.split("."),function(n){if(!m){return}m=m[n]});return m};k.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block. "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block. "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return k});g.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(j){this._super();this.title=j}});g.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(j){this._super(j)}});g.compile(window.Wipeout)})();(function(){window.Wipeout={};Wipeout.compiler=(function(){var l=function(n,m){this.classes=[];for(var o=0,p=n.length;o<p;o++){this.classes.push(n[o])}this.compiled=[];for(var o=0,p=m.length;o<p;o++){this.compiled.push({name:m[o],value:k(m[o])})}};function k(p){var m=window;p=p.split(".");for(var n=0,o=p.length;n<o;n++){m=m[p[n]]}return m}l.prototype.checkDependency=function(m){for(var n=0,o=this.compiled.length;n<o;n++){if(this.compiled[n].name===m){return true}}return false};l.prototype.getClass=function(m){for(var n=0,o=this.compiled.length;n<o;n++){if(this.compiled[n].name===m){return this.compiled[n].value}}return null};l.prototype.checkDependencies=function(m){for(var n=0,o=m.length;n<o;n++){if(!this.checkDependency(m[n])){return false}}return true};l.prototype.compile=function(){while(this.classes.length){var s=this.classes.length;for(var q=0;q<this.classes.length;q++){if(this.checkDependencies(this.classes[q].dependencies)){var p=this.classes[q].className;if(p.indexOf(".")!==-1){p=p.substr(p.lastIndexOf(".")+1)}var t=this.classes[q].constructor();var v={};for(var r in t){v[r]=t[r]}var u=t.prototype;t=this.getClass(this.classes[q].parentClass).extend(t,p);for(r in u){t.prototype[r]=u[r]}for(r in v){t[r]=v[r]}this.compiled.push({name:this.classes[q].className,value:t});this.classes.splice(q,1);q--}}if(s===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function j(o,m,n){this.rootNamespace=o;this.baseClass=m;this.dependencies=n||[];this.classes=[]}j.prototype.namespaceCorrectly=function(m){if(this.rootNamespace&&m&&m.indexOf(this.rootNamespace+".")===0){m=m.substr(this.rootNamespace.length+1)}return m};j.prototype.registerClass=function(o,r,n){var r=!r||r===this.baseClass?this.baseClass:this.namespaceCorrectly(r);var s={className:this.namespaceCorrectly(o),constructor:n,parentClass:r,dependencies:[r]};for(var p=0,q=this.classes.length;p<q;p++){if(this.classes[p].className===s.className){throw"There is already a class named "+o}}for(p=3,q=arguments.length;p<q;p++){s.dependencies.push(this.namespaceCorrectly(arguments[p]))}this.classes.push(s)};j.append=function(m,q){var p=m.name.split(".");for(var n=0,o=p.length-1;n<o;n++){q=q[p[n]]=q[p[n]]||{}}q[p[n]]=m.value};j.prototype.compile=function(q){q=q||{};var m=[this.baseClass];for(var n=0,p=this.dependencies.length;n<p;n++){m.push(this.dependencies[n])}var o=new l(this.classes,m);o.compile();for(n=1,p=o.compiled.length;n<p;n++){j.append(o.compiled[n],q)}return q};return j})();var g=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);var h=function(l,j,k){k=k||window;if(l){for(var m=0,n=l.length;m<n;m++){j.call(k,l[m],m)}}};var i=function(k,l){var j=l||window;h(k.split("."),function(m){j=j[m]});return j};(function(){window.Wipeout={};Wipeout.compiler=(function(){var o=function(q,p){this.classes=[];for(var r=0,s=q.length;r<s;r++){this.classes.push(q[r])}this.compiled=[];for(var r=0,s=p.length;r<s;r++){this.compiled.push({name:p[r],value:n(p[r])})}};function n(s){var p=window;s=s.split(".");for(var q=0,r=s.length;q<r;q++){p=p[s[q]]}return p}o.prototype.checkDependency=function(p){for(var q=0,r=this.compiled.length;q<r;q++){if(this.compiled[q].name===p){return true}}return false};o.prototype.getClass=function(p){for(var q=0,r=this.compiled.length;q<r;q++){if(this.compiled[q].name===p){return this.compiled[q].value}}return null};o.prototype.checkDependencies=function(p){for(var q=0,r=p.length;q<r;q++){if(!this.checkDependency(p[q])){return false}}return true};o.prototype.compile=function(){while(this.classes.length){var u=this.classes.length;for(var s=0;s<this.classes.length;s++){if(this.checkDependencies(this.classes[s].dependencies)){var r=this.classes[s].className;if(r.indexOf(".")!==-1){r=r.substr(r.lastIndexOf(".")+1)}var v=this.classes[s].constructor();var x={};for(var t in v){x[t]=v[t]}var w=v.prototype;v=this.getClass(this.classes[s].parentClass).extend(v,r);for(t in w){v.prototype[t]=w[t]}for(t in x){v[t]=x[t]}this.compiled.push({name:this.classes[s].className,value:v});this.classes.splice(s,1);s--}}if(u===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function m(r,p,q){this.rootNamespace=r;this.baseClass=p;this.dependencies=q||[];this.classes=[]}m.prototype.namespaceCorrectly=function(p){if(this.rootNamespace&&p&&p.indexOf(this.rootNamespace+".")===0){p=p.substr(this.rootNamespace.length+1)}return p};m.prototype.registerClass=function(q,t,p){var t=!t||t===this.baseClass?this.baseClass:this.namespaceCorrectly(t);var u={className:this.namespaceCorrectly(q),constructor:p,parentClass:t,dependencies:[t]};for(var r=0,s=this.classes.length;r<s;r++){if(this.classes[r].className===u.className){throw"There is already a class named "+q}}for(r=3,s=arguments.length;r<s;r++){u.dependencies.push(this.namespaceCorrectly(arguments[r]))}this.classes.push(u)};m.append=function(p,t){var s=p.name.split(".");for(var q=0,r=s.length-1;q<r;q++){t=t[s[q]]=t[s[q]]||{}}t[s[q]]=p.value};m.prototype.compile=function(t){t=t||{};var p=[this.baseClass];for(var q=0,s=this.dependencies.length;q<s;q++){p.push(this.dependencies[q])}var r=new o(this.classes,p);r.compile();for(q=1,s=r.compiled.length;q<s;q++){m.append(r.compiled[q],t)}return t};return m})();var j=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);window.NS=function(p){p=p.split(".");var m=window;for(var n=0,o=p.length;n<o;n++){m=m[p[n]]||(m[p[n]]={})}return m};window.vmChooser=function(m){m=ko.unwrap(m);if(m==null){return null}throw"Unknown model type"};j.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function m(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(n){this.model().content(n.data)},this)}m.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var m=function(n){this._super(n||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};m.prototype.onCodeChanged=function(n){};m.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var m=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};m.prototype.onModelChanged=function(p,n){this._super(p,n);var p=this.content();if(n==null){this.content(null)}else{var o=null;if(n instanceof Wipeout.Docs.Models.Pages.LandingPage){o=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(n instanceof Wipeout.Docs.Models.Descriptions.Class){o=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(n instanceof Wipeout.Docs.Models.Descriptions.Event){o=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(n instanceof Wipeout.Docs.Models.Descriptions.Property){o=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(n instanceof Wipeout.Docs.Models.Descriptions.Function){o=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}o.model(n);this.content(o)}};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var m=function(){this._super.apply(this,arguments)};m.prototype.onCodeChanged=function(n){new Function(n.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var m=function(){m.staticConstructor();this._super.apply(this,arguments)};var n;m.staticConstructor=function(){if(n){return}n=document.createElement("div");n.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(n)};m.prototype.onCodeChanged=function(o){n.innerHTML+=o.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var m=function(){this._super(m.nullTemplate)};m.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";m.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";m.nullTemplate=wo.visual.getBlankTemplateId();m.prototype.onModelChanged=function(o,n){this._super(o,n);if(n&&(n.branches||n.payload())){this.templateId(m.branchTemplate)}else{if(n){this.templateId(m.leafTemplate)}else{this.templateId(m.nullTemplate)}}};m.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var n=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&n){this.triggerRoutedEvent(m.renderPage,n)}};m.renderPage=new wo.routedEvent();return m});j.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var m=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};m.prototype.onCodeChanged=function(n){this.usage(n.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return m});j.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});j.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var m=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var n=this.model().classFullName+m.classUsagesTemplateSuffix;if(document.getElementById(n)){return n}}return wo.contentControl.getBlankTemplateId()},this)};m.classUsagesTemplateSuffix="_ClassUsages";return m});j.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});j.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});j.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});j.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var p=new Wipeout.Docs.Models.Components.Api();var o=(function(){var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",p.forClass("wo.object"));var M=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",p.forClass("wo.routedEventModel"));var P=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",p.forClass("wo.visual"));var O=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",p.forClass("wo.view"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",p.forClass("wo.contentControl"));var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",p.forClass("wo.if"));var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",p.forClass("wo.itemsControl"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",p.forClass("wo.event"));var L=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",p.forClass("wo.routedEvent"));var K=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",p.forClass("wo.routedEventArgs"));var N=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",p.forClass("wo.routedEventRegistration"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",p.forClass("wo.html"));var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",p.forClass("wo.ko.virtualElements"));var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",p.forClass("wipeout.utils.ko.array"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",p.forClass("wo.ko"),{staticProperties:{virtualElements:H,array:F}});var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",p.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[A,B,D,C,E,G,I,J,L,K,M,N,O,P])})();var m=(function(){var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",p.forClass("wipeout.bindings.itemsControl"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",p.forClass("wipeout.bindings.render"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",p.forClass("wipeout.bindings.wipeout-type"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",p.forClass("wipeout.bindings.wo"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",p.forClass("wipeout.bindings.wipeout"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",p.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[q,t,u,v,s,r])})();var n=(function(){var q=(function(){var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",p.forClass("wo.object"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",p.forClass("wo.routedEventModel"));var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",p.forClass("wo.visual"));var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",p.forClass("wo.view"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",p.forClass("wo.contentControl"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",p.forClass("wo.if"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",p.forClass("wo.itemsControl"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",p.forClass("wo.event"));var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",p.forClass("wo.routedEvent"));var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",p.forClass("wo.routedEventArgs"));var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",p.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[z,A,B,C,D,F,E,G,H,I,J])})();var r=(function(){var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",p.forClass("wipeout.bindings.itemsControl"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",p.forClass("wipeout.bindings.render"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",p.forClass("wipeout.bindings.wipeout-type"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",p.forClass("wipeout.bindings.wo"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",p.forClass("wipeout.bindings.wipeout"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",p.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[u,x,y,z,w,v])})();var s=(function(){p.forClass("ko.templateEngine");var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",p.forClass("wipeout.template.engine"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",p.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[u,v])})();var t=(function(){var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",p.forClass("wipeout.utils.html"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",p.forClass("wipeout.utils.ko.virtualElements"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",p.forClass("wipeout.utils.ko.array"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",p.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:x,array:v}});var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",p.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[u,w,y])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[q,r,s,t])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[o,m,n])])}});var k=function(o,m,n){n=n||window;if(o){for(var p=0,q=o.length;p<q;p++){m.call(n,o[p],p)}}};var l=function(n,o){var m=o||window;k(n.split("."),function(p){m=m[p]});return m};j.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var m=function(n){this._super();this.classes=[]};m.prototype.getClassDescription=function(n){for(var o=0,p=this.classes.length;o<p;o++){if(this.classes[o].classConstructor===n){return this.classes[o].classDescription}}};m.prototype.forClass=function(o){var n=l(o);var q=this.getClassDescription(n);if(q){return q}var p=new Wipeout.Docs.Models.Descriptions.Class(o,this);this.classes.push({classDescription:p,classConstructor:n});return p};return m});j.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var m=function(p,n,o){this._super(p,n,m.compileBranches(n,o))};m.compileBranches=function(n,o){var p=[];o=o||{};o.staticEvents=o.staticEvents||{};o.staticProperties=o.staticProperties||{};o.staticFunctions=o.staticFunctions||{};o.events=o.events||{};o.properties=o.properties||{};o.functions=o.functions||{};p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));k(n.staticEvents,function(q){if(o.staticEvents[q.eventName]){p.push(o.staticEvents[q.eventName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.eventName,null))}});k(n.staticProperties,function(q){if(o.staticProperties[q.propertyName]){p.push(o.staticProperties[q.propertyName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.propertyName,null))}});k(n.staticFunctions,function(q){if(o.staticFunctions[q.functionName]){p.push(o.staticFunctions[q.functionName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.functionName,null))}});k(n.events,function(q){if(o.events[q.eventName]){p.push(o.events[q.eventName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.eventName,null))}});k(n.properties,function(q){if(o.staticProperties[q.propertyName]){p.push(o.staticProperties[q.propertyName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.propertyName,null))}});k(n.functions,function(q){if(o.functions[q.functionName]){p.push(o.functions[q.functionName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.functionName,null))}});p.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return p};return m});j.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var m=function(o,p,n){this._super(o,n);this.page=p};m.prototype.payload=function(){return this.page};return m});j.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var m=function(o,n){this._super();this.name=o;this.branches=n};m.prototype.payload=function(){return null};return m});j.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var m=function(o,n){this._super();this.className=m.getClassName(o);this.constructorFunction=l(o);this.classFullName=o;this.api=n;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};m.getClassName=function(n){n=n.split(".");return n[n.length-1]};m.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var t in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(t)){if(this.constructorFunction[t] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,t,this.classFullName))}else{if(this.constructorFunction[t] instanceof Function&&!ko.isObservable(this.constructorFunction[t])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[t],t,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,t,this.classFullName))}}}}for(var t in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(t)){if(this.constructorFunction.prototype[t] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,t,this.classFullName))}else{if(this.constructorFunction.prototype[t] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[t])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[t],t,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,t,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var q=new this.constructorFunction();for(var t in q){if(q.hasOwnProperty(t)){if(q[t] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,t,this.classFullName))}else{if(q[t] instanceof Function&&!ko.isObservable(q[t])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(q[t],t,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,t,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var s=this.constructorFunction;while((s=Object.getPrototypeOf(s.prototype).constructor)!==Object){var v=this.api.getClassDescription(s);if(!v){throw"Class has not been defined yet"}var r=function(n,o){k(v[n],function(p){if(this[n].indexOf(p)!==-1){return}for(var y=0,z=this[n].length;y<z;y++){if(this[n][y][o]===p[o]){if(!this[n][y].overrides){this[n][y].overrides=p}return}}this[n].push(p)},this)};r.call(this,"events","eventName");r.call(this,"properties","propertyName");r.call(this,"functions","functionName")}}var w=function(n){k(this[n],function(p){var o=p;while(o&&o.overrides&&!o.summary){if(o.overrides.summary){o.summary=o.overrides.summary+(o.overrides.summaryInherited?"":" (from "+o.overrides.classFullName+")");o.summaryInherited=true}o=o.overrides}})};w.call(this,"staticProperties");w.call(this,"staticFunctions");w.call(this,"staticEvents");w.call(this,"events");w.call(this,"properties");w.call(this,"functions");for(var t=0,u=this.functions.length;t<u;t++){if(this.functions[t].functionName==="constructor"){this.classConstructor=this.functions.splice(t,1)[0];break}}if(t===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var x=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(x);this.staticEvents.sort(x);this.properties.sort(x);this.staticProperties.sort(x);this.functions.sort(x);this.staticFunctions.sort(x)};return m});j.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(m,n){this._super();this.name=m;this.summary=n}});j.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var m=function(o,p,n){this._super(p,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(o,p));this.eventName=p;this.classFullName=n};return m});j.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var m=function(p,o,n){this._super(o,m.getFunctionSummary(p));this["function"]=p;this.functionName=o;this.classFullName=n;this.overrides=null};m.getFunctionSummary=function(r){var n=r.toString();var p=false;var o=false;var q=function(){var t=n.indexOf("//");var s=n.indexOf("/*");var u=n.indexOf("{");if(t===-1){t=Number.MAX_VALUE}if(s===-1){s=Number.MAX_VALUE}if(u<t&&u<s){n=n.substr(u+1).replace(/^\s+|\s+$/g,"")}else{if(t<s){n=n.substr(n.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{n=n.substr(n.indexOf("*/")).replace(/^\s+|\s+$/g,"")}q()}};q();if(n.indexOf("///<summary>")===0){return n.substring(12,n.indexOf("</summary>"))}return""};return m});j.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var n=function(p,q,o){this._super(q,n.getPropertySummary(p,q,o));this.propertyName=q;this.classFullName=o};var m=/^\/\//;n.getPropertySummary=function(p,q,o){var r;if(r=n.getPropertyDescriptionOverride(o+"."+q)){return r}p=p.toString();var s=function(w){var u=p.search(w);if(u!==-1){var t=p.substring(0,u);var v=t.lastIndexOf("\n");if(v>0){t=t.substring(v)}t=t.replace(/^\s+|\s+$/g,"");if(m.test(t)){return t.substring(2)}else{return null}}};r=s(new RegExp("\\s*this\\s*\\.\\s*"+q+"\\s*="));if(r){return r}return s(new RegExp('\\s*this\\s*\\[\\s*"'+q+'"\\s*\\]\\s*='))};n.getPropertyDescriptionOverride=function(o){var p=n.descriptionOverrides;k(o.split("."),function(q){if(!p){return}p=p[q]});return p};n.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block. "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block. "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return n});j.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(m){this._super();this.title=m}});j.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(m){this._super(m)}});j.compile(window.Wipeout)})();(function(){window.Wipeout={};Wipeout.compiler=(function(){var o=function(q,p){this.classes=[];for(var r=0,s=q.length;r<s;r++){this.classes.push(q[r])}this.compiled=[];for(var r=0,s=p.length;r<s;r++){this.compiled.push({name:p[r],value:n(p[r])})}};function n(s){var p=window;s=s.split(".");for(var q=0,r=s.length;q<r;q++){p=p[s[q]]}return p}o.prototype.checkDependency=function(p){for(var q=0,r=this.compiled.length;q<r;q++){if(this.compiled[q].name===p){return true}}return false};o.prototype.getClass=function(p){for(var q=0,r=this.compiled.length;q<r;q++){if(this.compiled[q].name===p){return this.compiled[q].value}}return null};o.prototype.checkDependencies=function(p){for(var q=0,r=p.length;q<r;q++){if(!this.checkDependency(p[q])){return false}}return true};o.prototype.compile=function(){while(this.classes.length){var y=this.classes.length;for(var w=0;w<this.classes.length;w++){if(this.checkDependencies(this.classes[w].dependencies)){var v=this.classes[w].className;if(v.indexOf(".")!==-1){v=v.substr(v.lastIndexOf(".")+1)}var z=this.classes[w].constructor();var B={};for(var x in z){B[x]=z[x]}var A=z.prototype;z=this.getClass(this.classes[w].parentClass).extend(z,v);for(x in A){z.prototype[x]=A[x]}for(x in B){z[x]=B[x]}this.compiled.push({name:this.classes[w].className,value:z});this.classes.splice(w,1);w--}}if(y===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function m(r,p,q){this.rootNamespace=r;this.baseClass=p;this.dependencies=q||[];this.classes=[]}m.prototype.namespaceCorrectly=function(p){if(this.rootNamespace&&p&&p.indexOf(this.rootNamespace+".")===0){p=p.substr(this.rootNamespace.length+1)}return p};m.prototype.registerClass=function(u,x,t){var x=!x||x===this.baseClass?this.baseClass:this.namespaceCorrectly(x);var y={className:this.namespaceCorrectly(u),constructor:t,parentClass:x,dependencies:[x]};for(var v=0,w=this.classes.length;v<w;v++){if(this.classes[v].className===y.className){throw"There is already a class named "+u}}for(v=3,w=arguments.length;v<w;v++){y.dependencies.push(this.namespaceCorrectly(arguments[v]))}this.classes.push(y)};m.append=function(r,v){var u=r.name.split(".");for(var s=0,t=u.length-1;s<t;s++){v=v[u[s]]=v[u[s]]||{}}v[u[s]]=r.value};m.prototype.compile=function(v){v=v||{};var r=[this.baseClass];for(var s=0,u=this.dependencies.length;s<u;s++){r.push(this.dependencies[s])}var t=new o(this.classes,r);t.compile();for(s=1,u=t.compiled.length;s<u;s++){m.append(t.compiled[s],v)}return v};return m})();var j=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);window.NS=function(p){p=p.split(".");var m=window;for(var n=0,o=p.length;n<o;n++){m=m[p[n]]||(m[p[n]]={})}return m};window.vmChooser=function(m){m=ko.unwrap(m);if(m==null){return null}throw"Unknown model type"};j.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function m(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(n){this.model().content(n.data)},this)}m.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var m=function(n){this._super(n||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};m.prototype.onCodeChanged=function(n){};m.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var m=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};m.prototype.onModelChanged=function(p,n){this._super(p,n);var p=this.content();if(n==null){this.content(null)}else{var o=null;if(n instanceof Wipeout.Docs.Models.Pages.LandingPage){o=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(n instanceof Wipeout.Docs.Models.Descriptions.Class){o=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(n instanceof Wipeout.Docs.Models.Descriptions.Event){o=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(n instanceof Wipeout.Docs.Models.Descriptions.Property){o=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(n instanceof Wipeout.Docs.Models.Descriptions.Function){o=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}o.model(n);this.content(o)}};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var m=function(){this._super.apply(this,arguments)};m.prototype.onCodeChanged=function(n){new Function(n.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var m=function(){m.staticConstructor();this._super.apply(this,arguments)};var n;m.staticConstructor=function(){if(n){return}n=document.createElement("div");n.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(n)};m.prototype.onCodeChanged=function(o){n.innerHTML+=o.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return m});j.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var m=function(){this._super(m.nullTemplate)};m.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";m.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";m.nullTemplate=wo.visual.getBlankTemplateId();m.prototype.onModelChanged=function(o,n){this._super(o,n);if(n&&(n.branches||n.payload())){this.templateId(m.branchTemplate)}else{if(n){this.templateId(m.leafTemplate)}else{this.templateId(m.nullTemplate)}}};m.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var n=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&n){this.triggerRoutedEvent(m.renderPage,n)}};m.renderPage=new wo.routedEvent();return m});j.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var m=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};m.prototype.onCodeChanged=function(n){this.usage(n.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return m});j.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});j.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var m=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var n=this.model().classFullName+m.classUsagesTemplateSuffix;if(document.getElementById(n)){return n}}return wo.contentControl.getBlankTemplateId()},this)};m.classUsagesTemplateSuffix="_ClassUsages";return m});j.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});j.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});j.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});j.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var p=new Wipeout.Docs.Models.Components.Api();var o=(function(){var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",p.forClass("wo.object"));var O=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",p.forClass("wo.routedEventModel"));var R=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",p.forClass("wo.visual"));var Q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",p.forClass("wo.view"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",p.forClass("wo.contentControl"));var U=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",p.forClass("wo.if"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",p.forClass("wo.itemsControl"));var S=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",p.forClass("wo.event"));var N=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",p.forClass("wo.routedEvent"));var M=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",p.forClass("wo.routedEventArgs"));var P=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",p.forClass("wo.routedEventRegistration"));var T=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",p.forClass("wo.html"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",p.forClass("wo.ko.virtualElements"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",p.forClass("wipeout.utils.ko.array"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",p.forClass("wo.ko"),{staticProperties:{virtualElements:t,array:r}});var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",p.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[w,S,U,T,q,s,u,v,N,M,O,P,Q,R])})();var m=(function(){var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",p.forClass("wipeout.bindings.itemsControl"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",p.forClass("wipeout.bindings.render"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",p.forClass("wipeout.bindings.wipeout-type"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",p.forClass("wipeout.bindings.wo"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",p.forClass("wipeout.bindings.wipeout"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",p.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[s,v,w,x,u,t])})();var n=(function(){var q=(function(){var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",p.forClass("wo.object"));var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",p.forClass("wo.routedEventModel"));var L=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",p.forClass("wo.visual"));var K=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",p.forClass("wo.view"));var M=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",p.forClass("wo.contentControl"));var O=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",p.forClass("wo.if"));var P=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",p.forClass("wo.itemsControl"));var N=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",p.forClass("wo.event"));var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",p.forClass("wo.routedEvent"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",p.forClass("wo.routedEventArgs"));var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",p.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[M,N,O,P,u,H,v,I,J,K,L])})();var r=(function(){var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",p.forClass("wipeout.bindings.itemsControl"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",p.forClass("wipeout.bindings.render"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",p.forClass("wipeout.bindings.wipeout-type"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",p.forClass("wipeout.bindings.wo"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",p.forClass("wipeout.bindings.wipeout"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",p.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[x,A,B,C,z,y])})();var s=(function(){p.forClass("ko.templateEngine");var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",p.forClass("wipeout.template.engine"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",p.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[u,v])})();var t=(function(){var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",p.forClass("wipeout.utils.html"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",p.forClass("wipeout.utils.ko.virtualElements"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",p.forClass("wipeout.utils.ko.array"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",p.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:y,array:w}});var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",p.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[v,x,z])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[q,r,s,t])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[o,m,n])])}});var k=function(p,n,o){o=o||window;if(p){for(var q=0,r=p.length;q<r;q++){n.call(o,p[q],q)}}};var l=function(n,o){var m=o||window;k(n.split("."),function(p){m=m[p]});return m};j.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var m=function(n){this._super();this.classes=[]};m.prototype.getClassDescription=function(n){for(var o=0,p=this.classes.length;o<p;o++){if(this.classes[o].classConstructor===n){return this.classes[o].classDescription}}};m.prototype.forClass=function(o){var n=l(o);var q=this.getClassDescription(n);if(q){return q}var p=new Wipeout.Docs.Models.Descriptions.Class(o,this);this.classes.push({classDescription:p,classConstructor:n});return p};return m});j.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var m=function(p,n,o){this._super(p,n,m.compileBranches(n,o))};m.compileBranches=function(n,o){var p=[];o=o||{};o.staticEvents=o.staticEvents||{};o.staticProperties=o.staticProperties||{};o.staticFunctions=o.staticFunctions||{};o.events=o.events||{};o.properties=o.properties||{};o.functions=o.functions||{};p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));k(n.staticEvents,function(q){if(o.staticEvents[q.eventName]){p.push(o.staticEvents[q.eventName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.eventName,null))}});k(n.staticProperties,function(q){if(o.staticProperties[q.propertyName]){p.push(o.staticProperties[q.propertyName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.propertyName,null))}});k(n.staticFunctions,function(q){if(o.staticFunctions[q.functionName]){p.push(o.staticFunctions[q.functionName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.functionName,null))}});k(n.events,function(q){if(o.events[q.eventName]){p.push(o.events[q.eventName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.eventName,null))}});k(n.properties,function(q){if(o.staticProperties[q.propertyName]){p.push(o.staticProperties[q.propertyName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.propertyName,null))}});k(n.functions,function(q){if(o.functions[q.functionName]){p.push(o.functions[q.functionName])}else{p.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(q.functionName,null))}});p.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return p};return m});j.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var m=function(o,p,n){this._super(o,n);this.page=p};m.prototype.payload=function(){return this.page};return m});j.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var m=function(o,n){this._super();this.name=o;this.branches=n};m.prototype.payload=function(){return null};return m});j.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var m=function(o,n){this._super();this.className=m.getClassName(o);this.constructorFunction=l(o);this.classFullName=o;this.api=n;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};m.getClassName=function(n){n=n.split(".");return n[n.length-1]};m.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var x in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(x)){if(this.constructorFunction[x] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,x,this.classFullName))}else{if(this.constructorFunction[x] instanceof Function&&!ko.isObservable(this.constructorFunction[x])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[x],x,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,x,this.classFullName))}}}}for(var x in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(x)){if(this.constructorFunction.prototype[x] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,x,this.classFullName))}else{if(this.constructorFunction.prototype[x] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[x])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[x],x,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,x,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var u=new this.constructorFunction();for(var x in u){if(u.hasOwnProperty(x)){if(u[x] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,x,this.classFullName))}else{if(u[x] instanceof Function&&!ko.isObservable(u[x])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(u[x],x,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,x,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var w=this.constructorFunction;while((w=Object.getPrototypeOf(w.prototype).constructor)!==Object){var z=this.api.getClassDescription(w);if(!z){throw"Class has not been defined yet"}var v=function(n,o){k(z[n],function(p){if(this[n].indexOf(p)!==-1){return}for(var q=0,r=this[n].length;q<r;q++){if(this[n][q][o]===p[o]){if(!this[n][q].overrides){this[n][q].overrides=p}return}}this[n].push(p)},this)};v.call(this,"events","eventName");v.call(this,"properties","propertyName");v.call(this,"functions","functionName")}}var A=function(n){k(this[n],function(p){var o=p;while(o&&o.overrides&&!o.summary){if(o.overrides.summary){o.summary=o.overrides.summary+(o.overrides.summaryInherited?"":" (from "+o.overrides.classFullName+")");o.summaryInherited=true}o=o.overrides}})};A.call(this,"staticProperties");A.call(this,"staticFunctions");A.call(this,"staticEvents");A.call(this,"events");A.call(this,"properties");A.call(this,"functions");for(var x=0,y=this.functions.length;x<y;x++){if(this.functions[x].functionName==="constructor"){this.classConstructor=this.functions.splice(x,1)[0];break}}if(x===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var B=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(B);this.staticEvents.sort(B);this.properties.sort(B);this.staticProperties.sort(B);this.functions.sort(B);this.staticFunctions.sort(B)};return m});j.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(m,n){this._super();this.name=m;this.summary=n}});j.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var m=function(o,p,n){this._super(p,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(o,p));this.eventName=p;this.classFullName=n};return m});j.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var m=function(p,o,n){this._super(o,m.getFunctionSummary(p));this["function"]=p;this.functionName=o;this.classFullName=n;this.overrides=null};m.getFunctionSummary=function(s){var o=s.toString();var q=false;var p=false;var r=function(){var t=o.indexOf("//");var n=o.indexOf("/*");var u=o.indexOf("{");if(t===-1){t=Number.MAX_VALUE}if(n===-1){n=Number.MAX_VALUE}if(u<t&&u<n){o=o.substr(u+1).replace(/^\s+|\s+$/g,"")}else{if(t<n){o=o.substr(o.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{o=o.substr(o.indexOf("*/")).replace(/^\s+|\s+$/g,"")}r()}};r();if(o.indexOf("///<summary>")===0){return o.substring(12,o.indexOf("</summary>"))}return""};return m});j.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var n=function(p,q,o){this._super(q,n.getPropertySummary(p,q,o));this.propertyName=q;this.classFullName=o};var m=/^\/\//;n.getPropertySummary=function(q,r,p){var s;if(s=n.getPropertyDescriptionOverride(p+"."+r)){return s}q=q.toString();var t=function(w){var u=q.search(w);if(u!==-1){var o=q.substring(0,u);var v=o.lastIndexOf("\n");if(v>0){o=o.substring(v)}o=o.replace(/^\s+|\s+$/g,"");if(m.test(o)){return o.substring(2)}else{return null}}};s=t(new RegExp("\\s*this\\s*\\.\\s*"+r+"\\s*="));if(s){return s}return t(new RegExp('\\s*this\\s*\\[\\s*"'+r+'"\\s*\\]\\s*='))};n.getPropertyDescriptionOverride=function(o){var p=n.descriptionOverrides;k(o.split("."),function(q){if(!p){return}p=p[q]});return p};n.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block. "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block. "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return n});j.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(m){this._super();this.title=m}});j.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(m){this._super(m)}});j.compile(window.Wipeout)})();g.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var m=new Wipeout.Docs.Models.Components.Api();var l=(function(){var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",m.forClass("wo.object"));var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",m.forClass("wo.routedEventModel"));var M=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",m.forClass("wo.visual"));var L=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",m.forClass("wo.view"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",m.forClass("wo.contentControl"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",m.forClass("wo.if"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",m.forClass("wo.itemsControl"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",m.forClass("wo.event"));var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",m.forClass("wo.routedEvent"));var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",m.forClass("wo.routedEventArgs"));var K=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",m.forClass("wo.routedEventRegistration"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",m.forClass("wo.html"));var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",m.forClass("wo.ko.virtualElements"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",m.forClass("wipeout.utils.ko.array"));var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",m.forClass("wo.ko"),{staticProperties:{virtualElements:E,array:C}});var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",m.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[x,y,A,z,B,D,F,G,I,H,J,K,L,M])})();var j=(function(){var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",m.forClass("wipeout.bindings.itemsControl"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",m.forClass("wipeout.bindings.render"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",m.forClass("wipeout.bindings.wipeout-type"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",m.forClass("wipeout.bindings.wo"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",m.forClass("wipeout.bindings.wipeout"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",m.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[n,q,r,s,p,o])})();var k=(function(){var n=(function(){var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",m.forClass("wo.object"));var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",m.forClass("wo.routedEventModel"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",m.forClass("wo.visual"));var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",m.forClass("wo.view"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",m.forClass("wo.contentControl"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",m.forClass("wo.if"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",m.forClass("wo.itemsControl"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",m.forClass("wo.event"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",m.forClass("wo.routedEvent"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",m.forClass("wo.routedEventArgs"));var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",m.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[w,x,y,z,A,C,B,D,E,F,G])})();var o=(function(){var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",m.forClass("wipeout.bindings.itemsControl"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",m.forClass("wipeout.bindings.render"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",m.forClass("wipeout.bindings.wipeout-type"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",m.forClass("wipeout.bindings.wo"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",m.forClass("wipeout.bindings.wipeout"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",m.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[r,u,v,w,t,s])})();var p=(function(){m.forClass("ko.templateEngine");var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",m.forClass("wipeout.template.engine"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",m.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[r,s])})();var q=(function(){var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",m.forClass("wipeout.utils.html"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",m.forClass("wipeout.utils.ko.virtualElements"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",m.forClass("wipeout.utils.ko.array"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",m.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:u,array:s}});var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",m.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[r,t,v])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[n,o,p,q])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[l,j,k])])}});g.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var j=function(k){this._super();this.classes=[]};j.prototype.getClassDescription=function(k){for(var l=0,m=this.classes.length;l<m;l++){if(this.classes[l].classConstructor===k){return this.classes[l].classDescription}}};j.prototype.forClass=function(l){var k=i(l);var n=this.getClassDescription(k);if(n){return n}var m=new Wipeout.Docs.Models.Descriptions.Class(l,this);this.classes.push({classDescription:m,classConstructor:k});return m};return j});g.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var j=function(m,k,l){this._super(m,k,j.compileBranches(k,l))};j.compileBranches=function(k,l){var m=[];l=l||{};l.staticEvents=l.staticEvents||{};l.staticProperties=l.staticProperties||{};l.staticFunctions=l.staticFunctions||{};l.events=l.events||{};l.properties=l.properties||{};l.functions=l.functions||{};m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));h(k.staticEvents,function(n){if(l.staticEvents[n.eventName]){m.push(l.staticEvents[n.eventName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.eventName,null))}});h(k.staticProperties,function(n){if(l.staticProperties[n.propertyName]){m.push(l.staticProperties[n.propertyName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.propertyName,null))}});h(k.staticFunctions,function(n){if(l.staticFunctions[n.functionName]){m.push(l.staticFunctions[n.functionName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.functionName,null))}});h(k.events,function(n){if(l.events[n.eventName]){m.push(l.events[n.eventName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.eventName,null))}});h(k.properties,function(n){if(l.staticProperties[n.propertyName]){m.push(l.staticProperties[n.propertyName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.propertyName,null))}});h(k.functions,function(n){if(l.functions[n.functionName]){m.push(l.functions[n.functionName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.functionName,null))}});m.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return m};return j});g.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var j=function(l,m,k){this._super(l,k);this.page=m};j.prototype.payload=function(){return this.page};return j});g.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var j=function(l,k){this._super();this.name=l;this.branches=k};j.prototype.payload=function(){return null};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var j=function(l,k){this._super();this.className=j.getClassName(l);this.constructorFunction=i(l);this.classFullName=l;this.api=k;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};j.getClassName=function(k){k=k.split(".");return k[k.length-1]};j.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var q in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(q)){if(this.constructorFunction[q] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,q,this.classFullName))}else{if(this.constructorFunction[q] instanceof Function&&!ko.isObservable(this.constructorFunction[q])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[q],q,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,q,this.classFullName))}}}}for(var q in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(q)){if(this.constructorFunction.prototype[q] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,q,this.classFullName))}else{if(this.constructorFunction.prototype[q] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[q])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[q],q,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,q,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var n=new this.constructorFunction();for(var q in n){if(n.hasOwnProperty(q)){if(n[q] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,q,this.classFullName))}else{if(n[q] instanceof Function&&!ko.isObservable(n[q])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(n[q],q,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,q,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var p=this.constructorFunction;while((p=Object.getPrototypeOf(p.prototype).constructor)!==Object){var s=this.api.getClassDescription(p);if(!s){throw"Class has not been defined yet"}var o=function(k,l){h(s[k],function(m){if(this[k].indexOf(m)!==-1){return}for(var v=0,w=this[k].length;v<w;v++){if(this[k][v][l]===m[l]){if(!this[k][v].overrides){this[k][v].overrides=m}return}}this[k].push(m)},this)};o.call(this,"events","eventName");o.call(this,"properties","propertyName");o.call(this,"functions","functionName")}}var t=function(k){h(this[k],function(m){var l=m;while(l&&l.overrides&&!l.summary){if(l.overrides.summary){l.summary=l.overrides.summary+(l.overrides.summaryInherited?"":" (from "+l.overrides.classFullName+")");l.summaryInherited=true}l=l.overrides}})};t.call(this,"staticProperties");t.call(this,"staticFunctions");t.call(this,"staticEvents");t.call(this,"events");t.call(this,"properties");t.call(this,"functions");for(var q=0,r=this.functions.length;q<r;q++){if(this.functions[q].functionName==="constructor"){this.classConstructor=this.functions.splice(q,1)[0];break}}if(q===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var u=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(u);this.staticEvents.sort(u);this.properties.sort(u);this.staticProperties.sort(u);this.functions.sort(u);this.staticFunctions.sort(u)};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(j,k){this._super();this.name=j;this.summary=k}});g.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var j=function(l,m,k){this._super(m,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(l,m));this.eventName=m;this.classFullName=k};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var j=function(m,l,k){this._super(l,j.getFunctionSummary(m));this["function"]=m;this.functionName=l;this.classFullName=k;this.overrides=null};j.getFunctionSummary=function(o){var k=o.toString();var m=false;var l=false;var n=function(){var q=k.indexOf("//");var p=k.indexOf("/*");var r=k.indexOf("{");if(q===-1){q=Number.MAX_VALUE}if(p===-1){p=Number.MAX_VALUE}if(r<q&&r<p){k=k.substr(r+1).replace(/^\s+|\s+$/g,"")}else{if(q<p){k=k.substr(k.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{k=k.substr(k.indexOf("*/")).replace(/^\s+|\s+$/g,"")}n()}};n();if(k.indexOf("///<summary>")===0){return k.substring(12,k.indexOf("</summary>"))}return""};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var k=function(m,n,l){this._super(n,k.getPropertySummary(m,n,l));this.propertyName=n;this.classFullName=l};var j=/^\/\//;k.getPropertySummary=function(m,n,l){var o;if(o=k.getPropertyDescriptionOverride(l+"."+n)){return o}m=m.toString();var p=function(t){var r=m.search(t);if(r!==-1){var q=m.substring(0,r);var s=q.lastIndexOf("\n");if(s>0){q=q.substring(s)}q=q.replace(/^\s+|\s+$/g,"");if(j.test(q)){return q.substring(2)}else{return null}}};o=p(new RegExp("\\s*this\\s*\\.\\s*"+n+"\\s*="));if(o){return o}return p(new RegExp('\\s*this\\s*\\[\\s*"'+n+'"\\s*\\]\\s*='))};k.getPropertyDescriptionOverride=function(l){var m=k.descriptionOverrides;h(l.split("."),function(n){if(!m){return}m=m[n]});return m};k.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block: "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block: "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return k});g.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(j){this._super();this.title=j}});g.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(j){this._super(j)}});g.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function j(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(k){this.model().content(k.data)},this)}j.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var j=function(k){this._super(k||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};j.prototype.onCodeChanged=function(k){};j.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var j=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};j.prototype.onModelChanged=function(m,k){this._super(m,k);var m=this.content();if(k==null){this.content(null)}else{var l=null;if(k instanceof Wipeout.Docs.Models.Pages.LandingPage){l=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Class){l=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Event){l=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Property){l=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Function){l=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}l.model(k);this.content(l)}};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){this._super.apply(this,arguments)};j.prototype.onCodeChanged=function(k){new Function(k.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){j.staticConstructor();this._super.apply(this,arguments)};var k;j.staticConstructor=function(){if(k){return}k=document.createElement("div");k.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(k)};j.prototype.onCodeChanged=function(l){k.innerHTML+=l.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var j=function(){this._super(j.nullTemplate)};j.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";j.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";j.nullTemplate=wo.visual.getBlankTemplateId();j.prototype.onModelChanged=function(l,k){this._super(l,k);if(k&&(k.branches||k.payload())){this.templateId(j.branchTemplate)}else{if(k){this.templateId(j.leafTemplate)}else{this.templateId(j.nullTemplate)}}};j.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var k=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&k){this.triggerRoutedEvent(j.renderPage,k)}};j.renderPage=new wo.routedEvent();return j});g.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};j.prototype.onCodeChanged=function(k){this.usage(k.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return j});g.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var j=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var k=this.model().classFullName+j.classUsagesTemplateSuffix;if(document.getElementById(k)){return k}}return wo.contentControl.getBlankTemplateId()},this)};j.classUsagesTemplateSuffix="_ClassUsages";return j});g.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});g.compile(window.Wipeout)})();d.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var j=new Wipeout.Docs.Models.Components.Api();var i=(function(){var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",j.forClass("wo.object"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",j.forClass("wo.routedEventModel"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",j.forClass("wo.visual"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",j.forClass("wo.view"));var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",j.forClass("wo.contentControl"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",j.forClass("wo.if"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",j.forClass("wo.itemsControl"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",j.forClass("wo.event"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",j.forClass("wo.routedEvent"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",j.forClass("wo.routedEventArgs"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",j.forClass("wo.routedEventRegistration"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",j.forClass("wo.html"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",j.forClass("wo.ko.virtualElements"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",j.forClass("wipeout.utils.ko.array"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",j.forClass("wo.ko"),{staticProperties:{virtualElements:r,array:p}});var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",j.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[k,l,n,m,o,q,s,t,v,u,w,x,y,z])})();var g=(function(){var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",j.forClass("wipeout.bindings.itemsControl"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",j.forClass("wipeout.bindings.render"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",j.forClass("wipeout.bindings.wipeout-type"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",j.forClass("wipeout.bindings.wo"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",j.forClass("wipeout.bindings.wipeout"));var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",j.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[k,n,o,p,m,l])})();var h=(function(){var k=(function(){var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",j.forClass("wo.object"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",j.forClass("wo.routedEventModel"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",j.forClass("wo.visual"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",j.forClass("wo.view"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",j.forClass("wo.contentControl"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",j.forClass("wo.if"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",j.forClass("wo.itemsControl"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",j.forClass("wo.event"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",j.forClass("wo.routedEvent"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",j.forClass("wo.routedEventArgs"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",j.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[o,p,q,r,s,u,t,v,w,x,y])})();var l=(function(){var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",j.forClass("wipeout.bindings.itemsControl"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",j.forClass("wipeout.bindings.render"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",j.forClass("wipeout.bindings.wipeout-type"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",j.forClass("wipeout.bindings.wo"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",j.forClass("wipeout.bindings.wipeout"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",j.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[o,r,s,t,q,p])})();var m=(function(){j.forClass("ko.templateEngine");var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",j.forClass("wipeout.template.engine"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",j.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[o,p])})();var n=(function(){var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",j.forClass("wipeout.utils.html"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",j.forClass("wipeout.utils.ko.virtualElements"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",j.forClass("wipeout.utils.ko.array"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",j.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:r,array:p}});var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",j.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[o,q,s])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[k,l,m,n])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[i,g,h])])}});d.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var g=function(h){this._super();this.classes=[]};g.prototype.getClassDescription=function(h){for(var j=0,k=this.classes.length;j<k;j++){if(this.classes[j].classConstructor===h){return this.classes[j].classDescription}}};g.prototype.forClass=function(i){var h=f(i);var k=this.getClassDescription(h);if(k){return k}var j=new Wipeout.Docs.Models.Descriptions.Class(i,this);this.classes.push({classDescription:j,classConstructor:h});return j};return g});d.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var g=function(j,h,i){this._super(j,h,g.compileBranches(h,i))};g.compileBranches=function(h,i){var j=[];i=i||{};i.staticEvents=i.staticEvents||{};i.staticProperties=i.staticProperties||{};i.staticFunctions=i.staticFunctions||{};i.events=i.events||{};i.properties=i.properties||{};i.functions=i.functions||{};j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));e(h.staticEvents,function(k){if(i.staticEvents[k.eventName]){j.push(i.staticEvents[k.eventName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.eventName,null))}});e(h.staticProperties,function(k){if(i.staticProperties[k.propertyName]){j.push(i.staticProperties[k.propertyName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.propertyName,null))}});e(h.staticFunctions,function(k){if(i.staticFunctions[k.functionName]){j.push(i.staticFunctions[k.functionName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.functionName,null))}});e(h.events,function(k){if(i.events[k.eventName]){j.push(i.events[k.eventName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.eventName,null))}});e(h.properties,function(k){if(i.staticProperties[k.propertyName]){j.push(i.staticProperties[k.propertyName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.propertyName,null))}});e(h.functions,function(k){if(i.functions[k.functionName]){j.push(i.functions[k.functionName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.functionName,null))}});j.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return j};return g});d.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var g=function(i,j,h){this._super(i,h);this.page=j};g.prototype.payload=function(){return this.page};return g});d.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var g=function(i,h){this._super();this.name=i;this.branches=h};g.prototype.payload=function(){return null};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var g=function(i,h){this._super();this.className=g.getClassName(i);this.constructorFunction=f(i);this.classFullName=i;this.api=h;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};g.getClassName=function(h){h=h.split(".");return h[h.length-1]};g.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var l in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(l)){if(this.constructorFunction[l] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,l,this.classFullName))}else{if(this.constructorFunction[l] instanceof Function&&!ko.isObservable(this.constructorFunction[l])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[l],l,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,l,this.classFullName))}}}}for(var l in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(l)){if(this.constructorFunction.prototype[l] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,l,this.classFullName))}else{if(this.constructorFunction.prototype[l] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[l])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[l],l,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,l,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var h=new this.constructorFunction();for(var l in h){if(h.hasOwnProperty(l)){if(h[l] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,l,this.classFullName))}else{if(h[l] instanceof Function&&!ko.isObservable(h[l])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(h[l],l,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,l,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var k=this.constructorFunction;while((k=Object.getPrototypeOf(k.prototype).constructor)!==Object){var n=this.api.getClassDescription(k);if(!n){throw"Class has not been defined yet"}var j=function(i,q){e(n[i],function(r){if(this[i].indexOf(r)!==-1){return}for(var s=0,t=this[i].length;s<t;s++){if(this[i][s][q]===r[q]){if(!this[i][s].overrides){this[i][s].overrides=r}return}}this[i].push(r)},this)};j.call(this,"events","eventName");j.call(this,"properties","propertyName");j.call(this,"functions","functionName")}}var o=function(i){e(this[i],function(r){var q=r;while(q&&q.overrides&&!q.summary){if(q.overrides.summary){q.summary=q.overrides.summary+(q.overrides.summaryInherited?"":" (from "+q.overrides.classFullName+")");q.summaryInherited=true}q=q.overrides}})};o.call(this,"staticProperties");o.call(this,"staticFunctions");o.call(this,"staticEvents");o.call(this,"events");o.call(this,"properties");o.call(this,"functions");for(var l=0,m=this.functions.length;l<m;l++){if(this.functions[l].functionName==="constructor"){this.classConstructor=this.functions.splice(l,1)[0];break}}if(l===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var p=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(p);this.staticEvents.sort(p);this.properties.sort(p);this.staticProperties.sort(p);this.functions.sort(p);this.staticFunctions.sort(p)};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(g,h){this._super();this.name=g;this.summary=h}});d.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var g=function(i,j,h){this._super(j,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(i,j));this.eventName=j;this.classFullName=h};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var g=function(j,i,h){this._super(i,g.getFunctionSummary(j));this["function"]=j;this.functionName=i;this.classFullName=h;this.overrides=null};g.getFunctionSummary=function(l){var h=l.toString();var j=false;var i=false;var k=function(){var n=h.indexOf("//");var m=h.indexOf("/*");var o=h.indexOf("{");if(n===-1){n=Number.MAX_VALUE}if(m===-1){m=Number.MAX_VALUE}if(o<n&&o<m){h=h.substr(o+1).replace(/^\s+|\s+$/g,"")}else{if(n<m){h=h.substr(h.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{h=h.substr(h.indexOf("*/")).replace(/^\s+|\s+$/g,"")}k()}};k();if(h.indexOf("///<summary>")===0){return h.substring(12,h.indexOf("</summary>"))}return""};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var h=function(j,k,i){this._super(k,h.getPropertySummary(j,k,i));this.propertyName=k;this.classFullName=i};var g=/^\/\//;h.getPropertySummary=function(j,k,i){var l;if(l=h.getPropertyDescriptionOverride(i+"."+k)){return l}j=j.toString();var m=function(q){var o=j.search(q);if(o!==-1){var n=j.substring(0,o);var p=n.lastIndexOf("\n");if(p>0){n=n.substring(p)}n=n.replace(/^\s+|\s+$/g,"");if(g.test(n)){return n.substring(2)}else{return null}}};l=m(new RegExp("\\s*this\\s*\\.\\s*"+k+"\\s*="));if(l){return l}return m(new RegExp('\\s*this\\s*\\[\\s*"'+k+'"\\s*\\]\\s*='))};h.getPropertyDescriptionOverride=function(i){var j=h.descriptionOverrides;e(i.split("."),function(k){if(!j){return}j=j[k]});return j};h.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block: "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block: "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return h});d.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(g){this._super();this.title=g}});d.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(g){this._super(g)}});d.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function g(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(h){this.model().content(h.data)},this)}g.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var g=function(h){this._super(h||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};g.prototype.onCodeChanged=function(h){};g.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var g=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};g.prototype.onModelChanged=function(j,h){this._super(j,h);var j=this.content();if(h==null){this.content(null)}else{var i=null;if(h instanceof Wipeout.Docs.Models.Pages.LandingPage){i=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Class){i=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Event){i=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Property){i=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Function){i=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}i.model(h);this.content(i)}};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){this._super.apply(this,arguments)};g.prototype.onCodeChanged=function(h){new Function(h.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){g.staticConstructor();this._super.apply(this,arguments)};var h;g.staticConstructor=function(){if(h){return}h=document.createElement("div");h.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(h)};g.prototype.onCodeChanged=function(i){h.innerHTML+=i.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var g=function(){this._super(g.nullTemplate)};g.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";g.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";g.nullTemplate=wo.visual.getBlankTemplateId();g.prototype.onModelChanged=function(i,h){this._super(i,h);if(h&&(h.branches||h.payload())){this.templateId(g.branchTemplate)}else{if(h){this.templateId(g.leafTemplate)}else{this.templateId(g.nullTemplate)}}};g.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var h=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&h){this.triggerRoutedEvent(g.renderPage,h)}};g.renderPage=new wo.routedEvent();return g});d.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};g.prototype.onCodeChanged=function(h){this.usage(h.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return g});d.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var g=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var h=this.model().classFullName+g.classUsagesTemplateSuffix;if(document.getElementById(h)){return h}}return wo.contentControl.getBlankTemplateId()},this)};g.classUsagesTemplateSuffix="_ClassUsages";return g});d.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});d.compile(window.Wipeout)})();(function(){window.Wipeout={};Wipeout.compiler=(function(){var i=function(m,l){this.classes=[];for(var n=0,o=m.length;n<o;n++){this.classes.push(m[n])}this.compiled=[];for(var n=0,o=l.length;n<o;n++){this.compiled.push({name:l[n],value:h(l[n])})}};function h(o){var l=window;o=o.split(".");for(var m=0,n=o.length;m<n;m++){l=l[o[m]]}return l}i.prototype.checkDependency=function(k){for(var l=0,m=this.compiled.length;l<m;l++){if(this.compiled[l].name===k){return true}}return false};i.prototype.getClass=function(k){for(var l=0,m=this.compiled.length;l<m;l++){if(this.compiled[l].name===k){return this.compiled[l].value}}return null};i.prototype.checkDependencies=function(k){for(var l=0,m=k.length;l<m;l++){if(!this.checkDependency(k[l])){return false}}return true};i.prototype.compile=function(){while(this.classes.length){var r=this.classes.length;for(var p=0;p<this.classes.length;p++){if(this.checkDependencies(this.classes[p].dependencies)){var j=this.classes[p].className;if(j.indexOf(".")!==-1){j=j.substr(j.lastIndexOf(".")+1)}var s=this.classes[p].constructor();var u={};for(var q in s){u[q]=s[q]}var t=s.prototype;s=this.getClass(this.classes[p].parentClass).extend(s,j);for(q in t){s.prototype[q]=t[q]}for(q in u){s[q]=u[q]}this.compiled.push({name:this.classes[p].className,value:s});this.classes.splice(p,1);p--}}if(r===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function g(l,j,k){this.rootNamespace=l;this.baseClass=j;this.dependencies=k||[];this.classes=[]}g.prototype.namespaceCorrectly=function(j){if(this.rootNamespace&&j&&j.indexOf(this.rootNamespace+".")===0){j=j.substr(this.rootNamespace.length+1)}return j};g.prototype.registerClass=function(o,r,n){var r=!r||r===this.baseClass?this.baseClass:this.namespaceCorrectly(r);var s={className:this.namespaceCorrectly(o),constructor:n,parentClass:r,dependencies:[r]};for(var p=0,q=this.classes.length;p<q;p++){if(this.classes[p].className===s.className){throw"There is already a class named "+o}}for(p=3,q=arguments.length;p<q;p++){s.dependencies.push(this.namespaceCorrectly(arguments[p]))}this.classes.push(s)};g.append=function(m,q){var p=m.name.split(".");for(var n=0,o=p.length-1;n<o;n++){q=q[p[n]]=q[p[n]]||{}}q[p[n]]=m.value};g.prototype.compile=function(q){q=q||{};var m=[this.baseClass];for(var n=0,p=this.dependencies.length;n<p;n++){m.push(this.dependencies[n])}var o=new i(this.classes,m);o.compile();for(n=1,p=o.compiled.length;n<p;n++){g.append(o.compiled[n],q)}return q};return g})();var d=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);var e=function(k,i,j){j=j||window;if(k){for(var l=0,m=k.length;l<m;l++){i.call(j,k[l],l)}}};var f=function(h,i){var g=i||window;e(h.split("."),function(j){g=g[j]});return g};(function(){window.Wipeout={};Wipeout.compiler=(function(){var l=function(o,n){this.classes=[];for(var p=0,q=o.length;p<q;p++){this.classes.push(o[p])}this.compiled=[];for(var p=0,q=n.length;p<q;p++){this.compiled.push({name:n[p],value:k(n[p])})}};function k(q){var n=window;q=q.split(".");for(var o=0,p=q.length;o<p;o++){n=n[q[o]]}return n}l.prototype.checkDependency=function(m){for(var n=0,o=this.compiled.length;n<o;n++){if(this.compiled[n].name===m){return true}}return false};l.prototype.getClass=function(m){for(var n=0,o=this.compiled.length;n<o;n++){if(this.compiled[n].name===m){return this.compiled[n].value}}return null};l.prototype.checkDependencies=function(m){for(var n=0,o=m.length;n<o;n++){if(!this.checkDependency(m[n])){return false}}return true};l.prototype.compile=function(){while(this.classes.length){var u=this.classes.length;for(var s=0;s<this.classes.length;s++){if(this.checkDependencies(this.classes[s].dependencies)){var r=this.classes[s].className;if(r.indexOf(".")!==-1){r=r.substr(r.lastIndexOf(".")+1)}var v=this.classes[s].constructor();var x={};for(var t in v){x[t]=v[t]}var w=v.prototype;v=this.getClass(this.classes[s].parentClass).extend(v,r);for(t in w){v.prototype[t]=w[t]}for(t in x){v[t]=x[t]}this.compiled.push({name:this.classes[s].className,value:v});this.classes.splice(s,1);s--}}if(u===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function j(o,m,n){this.rootNamespace=o;this.baseClass=m;this.dependencies=n||[];this.classes=[]}j.prototype.namespaceCorrectly=function(m){if(this.rootNamespace&&m&&m.indexOf(this.rootNamespace+".")===0){m=m.substr(this.rootNamespace.length+1)}return m};j.prototype.registerClass=function(q,t,p){var t=!t||t===this.baseClass?this.baseClass:this.namespaceCorrectly(t);var u={className:this.namespaceCorrectly(q),constructor:p,parentClass:t,dependencies:[t]};for(var r=0,s=this.classes.length;r<s;r++){if(this.classes[r].className===u.className){throw"There is already a class named "+q}}for(r=3,s=arguments.length;r<s;r++){u.dependencies.push(this.namespaceCorrectly(arguments[r]))}this.classes.push(u)};j.append=function(o,s){var r=o.name.split(".");for(var p=0,q=r.length-1;p<q;p++){s=s[r[p]]=s[r[p]]||{}}s[r[p]]=o.value};j.prototype.compile=function(s){s=s||{};var o=[this.baseClass];for(var p=0,r=this.dependencies.length;p<r;p++){o.push(this.dependencies[p])}var q=new l(this.classes,o);q.compile();for(p=1,r=q.compiled.length;p<r;p++){j.append(q.compiled[p],s)}return s};return j})();var g=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);window.NS=function(o){o=o.split(".");var l=window;for(var m=0,n=o.length;m<n;m++){l=l[o[m]]||(l[o[m]]={})}return l};window.vmChooser=function(j){j=ko.unwrap(j);if(j==null){return null}throw"Unknown model type"};g.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function j(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(k){this.model().content(k.data)},this)}j.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var j=function(k){this._super(k||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};j.prototype.onCodeChanged=function(k){};j.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var j=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};j.prototype.onModelChanged=function(m,k){this._super(m,k);var m=this.content();if(k==null){this.content(null)}else{var l=null;if(k instanceof Wipeout.Docs.Models.Pages.LandingPage){l=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Class){l=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Event){l=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Property){l=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Function){l=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}l.model(k);this.content(l)}};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){this._super.apply(this,arguments)};j.prototype.onCodeChanged=function(k){new Function(k.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){j.staticConstructor();this._super.apply(this,arguments)};var k;j.staticConstructor=function(){if(k){return}k=document.createElement("div");k.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(k)};j.prototype.onCodeChanged=function(l){k.innerHTML+=l.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var j=function(){this._super(j.nullTemplate)};j.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";j.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";j.nullTemplate=wo.visual.getBlankTemplateId();j.prototype.onModelChanged=function(l,k){this._super(l,k);if(k&&(k.branches||k.payload())){this.templateId(j.branchTemplate)}else{if(k){this.templateId(j.leafTemplate)}else{this.templateId(j.nullTemplate)}}};j.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var k=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&k){this.triggerRoutedEvent(j.renderPage,k)}};j.renderPage=new wo.routedEvent();return j});g.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};j.prototype.onCodeChanged=function(k){this.usage(k.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return j});g.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var j=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var k=this.model().classFullName+j.classUsagesTemplateSuffix;if(document.getElementById(k)){return k}}return wo.contentControl.getBlankTemplateId()},this)};j.classUsagesTemplateSuffix="_ClassUsages";return j});g.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});g.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var n=new Wipeout.Docs.Models.Components.Api();var m=(function(){var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",n.forClass("wo.object"));var L=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",n.forClass("wo.routedEventModel"));var O=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",n.forClass("wo.visual"));var N=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",n.forClass("wo.view"));var j=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",n.forClass("wo.contentControl"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",n.forClass("wo.if"));var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",n.forClass("wo.itemsControl"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",n.forClass("wo.event"));var K=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",n.forClass("wo.routedEvent"));var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",n.forClass("wo.routedEventArgs"));var M=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",n.forClass("wo.routedEventRegistration"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",n.forClass("wo.html"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",n.forClass("wo.ko.virtualElements"));var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",n.forClass("wipeout.utils.ko.array"));var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",n.forClass("wo.ko"),{staticProperties:{virtualElements:G,array:E}});var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",n.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[j,A,C,B,D,F,H,I,K,J,L,M,N,O])})();var k=(function(){var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",n.forClass("wipeout.bindings.itemsControl"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",n.forClass("wipeout.bindings.render"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",n.forClass("wipeout.bindings.wipeout-type"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",n.forClass("wipeout.bindings.wo"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",n.forClass("wipeout.bindings.wipeout"));var j=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",n.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[j,s,t,u,r,q])})();var l=(function(){var j=(function(){var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",n.forClass("wo.object"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",n.forClass("wo.routedEventModel"));var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",n.forClass("wo.visual"));var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",n.forClass("wo.view"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",n.forClass("wo.contentControl"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",n.forClass("wo.if"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",n.forClass("wo.itemsControl"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",n.forClass("wo.event"));var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",n.forClass("wo.routedEvent"));var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",n.forClass("wo.routedEventArgs"));var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",n.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[z,A,B,C,D,F,E,G,H,I,J])})();var o=(function(){var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",n.forClass("wipeout.bindings.itemsControl"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",n.forClass("wipeout.bindings.render"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",n.forClass("wipeout.bindings.wipeout-type"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",n.forClass("wipeout.bindings.wo"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",n.forClass("wipeout.bindings.wipeout"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",n.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[u,x,y,z,w,v])})();var p=(function(){n.forClass("ko.templateEngine");var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",n.forClass("wipeout.template.engine"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",n.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[r,s])})();var q=(function(){var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",n.forClass("wipeout.utils.html"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",n.forClass("wipeout.utils.ko.virtualElements"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",n.forClass("wipeout.utils.ko.array"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",n.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:w,array:u}});var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",n.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[t,v,x])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[j,o,p,q])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[m,k,l])])}});var h=function(o,m,n){n=n||window;if(o){for(var p=0,q=o.length;p<q;p++){m.call(n,o[p],p)}}};var i=function(k,l){var j=l||window;h(k.split("."),function(m){j=j[m]});return j};g.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var j=function(k){this._super();this.classes=[]};j.prototype.getClassDescription=function(l){for(var m=0,n=this.classes.length;m<n;m++){if(this.classes[m].classConstructor===l){return this.classes[m].classDescription}}};j.prototype.forClass=function(m){var l=i(m);var o=this.getClassDescription(l);if(o){return o}var n=new Wipeout.Docs.Models.Descriptions.Class(m,this);this.classes.push({classDescription:n,classConstructor:l});return n};return j});g.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var j=function(m,k,l){this._super(m,k,j.compileBranches(k,l))};j.compileBranches=function(k,l){var m=[];l=l||{};l.staticEvents=l.staticEvents||{};l.staticProperties=l.staticProperties||{};l.staticFunctions=l.staticFunctions||{};l.events=l.events||{};l.properties=l.properties||{};l.functions=l.functions||{};m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));h(k.staticEvents,function(n){if(l.staticEvents[n.eventName]){m.push(l.staticEvents[n.eventName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.eventName,null))}});h(k.staticProperties,function(n){if(l.staticProperties[n.propertyName]){m.push(l.staticProperties[n.propertyName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.propertyName,null))}});h(k.staticFunctions,function(n){if(l.staticFunctions[n.functionName]){m.push(l.staticFunctions[n.functionName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.functionName,null))}});h(k.events,function(n){if(l.events[n.eventName]){m.push(l.events[n.eventName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.eventName,null))}});h(k.properties,function(n){if(l.staticProperties[n.propertyName]){m.push(l.staticProperties[n.propertyName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.propertyName,null))}});h(k.functions,function(n){if(l.functions[n.functionName]){m.push(l.functions[n.functionName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.functionName,null))}});m.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return m};return j});g.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var j=function(l,m,k){this._super(l,k);this.page=m};j.prototype.payload=function(){return this.page};return j});g.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var j=function(l,k){this._super();this.name=l;this.branches=k};j.prototype.payload=function(){return null};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var j=function(l,k){this._super();this.className=j.getClassName(l);this.constructorFunction=i(l);this.classFullName=l;this.api=k;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};j.getClassName=function(k){k=k.split(".");return k[k.length-1]};j.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var t in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(t)){if(this.constructorFunction[t] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,t,this.classFullName))}else{if(this.constructorFunction[t] instanceof Function&&!ko.isObservable(this.constructorFunction[t])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[t],t,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,t,this.classFullName))}}}}for(var t in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(t)){if(this.constructorFunction.prototype[t] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,t,this.classFullName))}else{if(this.constructorFunction.prototype[t] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[t])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[t],t,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,t,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var q=new this.constructorFunction();for(var t in q){if(q.hasOwnProperty(t)){if(q[t] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,t,this.classFullName))}else{if(q[t] instanceof Function&&!ko.isObservable(q[t])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(q[t],t,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,t,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var s=this.constructorFunction;while((s=Object.getPrototypeOf(s.prototype).constructor)!==Object){var v=this.api.getClassDescription(s);if(!v){throw"Class has not been defined yet"}var r=function(k,l){h(v[k],function(m){if(this[k].indexOf(m)!==-1){return}for(var n=0,o=this[k].length;n<o;n++){if(this[k][n][l]===m[l]){if(!this[k][n].overrides){this[k][n].overrides=m}return}}this[k].push(m)},this)};r.call(this,"events","eventName");r.call(this,"properties","propertyName");r.call(this,"functions","functionName")}}var w=function(k){h(this[k],function(m){var l=m;while(l&&l.overrides&&!l.summary){if(l.overrides.summary){l.summary=l.overrides.summary+(l.overrides.summaryInherited?"":" (from "+l.overrides.classFullName+")");l.summaryInherited=true}l=l.overrides}})};w.call(this,"staticProperties");w.call(this,"staticFunctions");w.call(this,"staticEvents");w.call(this,"events");w.call(this,"properties");w.call(this,"functions");for(var t=0,u=this.functions.length;t<u;t++){if(this.functions[t].functionName==="constructor"){this.classConstructor=this.functions.splice(t,1)[0];break}}if(t===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var x=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(x);this.staticEvents.sort(x);this.properties.sort(x);this.staticProperties.sort(x);this.functions.sort(x);this.staticFunctions.sort(x)};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(j,k){this._super();this.name=j;this.summary=k}});g.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var j=function(l,m,k){this._super(m,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(l,m));this.eventName=m;this.classFullName=k};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var j=function(m,l,k){this._super(l,j.getFunctionSummary(m));this["function"]=m;this.functionName=l;this.classFullName=k;this.overrides=null};j.getFunctionSummary=function(q){var m=q.toString();var o=false;var n=false;var p=function(){var l=m.indexOf("//");var k=m.indexOf("/*");var r=m.indexOf("{");if(l===-1){l=Number.MAX_VALUE}if(k===-1){k=Number.MAX_VALUE}if(r<l&&r<k){m=m.substr(r+1).replace(/^\s+|\s+$/g,"")}else{if(l<k){m=m.substr(m.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{m=m.substr(m.indexOf("*/")).replace(/^\s+|\s+$/g,"")}p()}};p();if(m.indexOf("///<summary>")===0){return m.substring(12,m.indexOf("</summary>"))}return""};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var k=function(m,n,l){this._super(n,k.getPropertySummary(m,n,l));this.propertyName=n;this.classFullName=l};var j=/^\/\//;k.getPropertySummary=function(o,p,n){var q;if(q=k.getPropertyDescriptionOverride(n+"."+p)){return q}o=o.toString();var r=function(t){var m=o.search(t);if(m!==-1){var l=o.substring(0,m);var s=l.lastIndexOf("\n");if(s>0){l=l.substring(s)}l=l.replace(/^\s+|\s+$/g,"");if(j.test(l)){return l.substring(2)}else{return null}}};q=r(new RegExp("\\s*this\\s*\\.\\s*"+p+"\\s*="));if(q){return q}return r(new RegExp('\\s*this\\s*\\[\\s*"'+p+'"\\s*\\]\\s*='))};k.getPropertyDescriptionOverride=function(l){var m=k.descriptionOverrides;h(l.split("."),function(n){if(!m){return}m=m[n]});return m};k.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block. "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block. "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return k});g.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(j){this._super();this.title=j}});g.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(j){this._super(j)}});g.compile(window.Wipeout)})();(function(){window.Wipeout={};Wipeout.compiler=(function(){var l=function(q,p){this.classes=[];for(var r=0,s=q.length;r<s;r++){this.classes.push(q[r])}this.compiled=[];for(var r=0,s=p.length;r<s;r++){this.compiled.push({name:p[r],value:k(p[r])})}};function k(s){var p=window;s=s.split(".");for(var q=0,r=s.length;q<r;q++){p=p[s[q]]}return p}l.prototype.checkDependency=function(n){for(var o=0,p=this.compiled.length;o<p;o++){if(this.compiled[o].name===n){return true}}return false};l.prototype.getClass=function(n){for(var o=0,p=this.compiled.length;o<p;o++){if(this.compiled[o].name===n){return this.compiled[o].value}}return null};l.prototype.checkDependencies=function(n){for(var o=0,p=n.length;o<p;o++){if(!this.checkDependency(n[o])){return false}}return true};l.prototype.compile=function(){while(this.classes.length){var v=this.classes.length;for(var n=0;n<this.classes.length;n++){if(this.checkDependencies(this.classes[n].dependencies)){var m=this.classes[n].className;if(m.indexOf(".")!==-1){m=m.substr(m.lastIndexOf(".")+1)}var w=this.classes[n].constructor();var y={};for(var o in w){y[o]=w[o]}var x=w.prototype;w=this.getClass(this.classes[n].parentClass).extend(w,m);for(o in x){w.prototype[o]=x[o]}for(o in y){w[o]=y[o]}this.compiled.push({name:this.classes[n].className,value:w});this.classes.splice(n,1);n--}}if(v===this.classes.length){throw {message:"Cannot compile remainig classes. They all have dependencies not registered with this constructor",classes:this.classes}}}};function j(o,m,n){this.rootNamespace=o;this.baseClass=m;this.dependencies=n||[];this.classes=[]}j.prototype.namespaceCorrectly=function(m){if(this.rootNamespace&&m&&m.indexOf(this.rootNamespace+".")===0){m=m.substr(this.rootNamespace.length+1)}return m};j.prototype.registerClass=function(t,w,m){var w=!w||w===this.baseClass?this.baseClass:this.namespaceCorrectly(w);var x={className:this.namespaceCorrectly(t),constructor:m,parentClass:w,dependencies:[w]};for(var u=0,v=this.classes.length;u<v;u++){if(this.classes[u].className===x.className){throw"There is already a class named "+t}}for(u=3,v=arguments.length;u<v;u++){x.dependencies.push(this.namespaceCorrectly(arguments[u]))}this.classes.push(x)};j.append=function(r,v){var u=r.name.split(".");for(var s=0,t=u.length-1;s<t;s++){v=v[u[s]]=v[u[s]]||{}}v[u[s]]=r.value};j.prototype.compile=function(v){v=v||{};var r=[this.baseClass];for(var s=0,u=this.dependencies.length;s<u;s++){r.push(this.dependencies[s])}var t=new l(this.classes,r);t.compile();for(s=1,u=t.compiled.length;s<u;s++){j.append(t.compiled[s],v)}return v};return j})();var g=new Wipeout.compiler("Wipeout","wo.object",["wo.visual","wo.view","wo.contentControl","wo.itemsControl","wo.if"]);window.NS=function(o){o=o.split(".");var l=window;for(var m=0,n=o.length;m<n;m++){l=l[o[m]]||(l[o[m]]={})}return l};window.vmChooser=function(j){j=ko.unwrap(j);if(j==null){return null}throw"Unknown model type"};g.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function j(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(k){this.model().content(k.data)},this)}j.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var j=function(k){this._super(k||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};j.prototype.onCodeChanged=function(k){};j.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var j=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};j.prototype.onModelChanged=function(m,k){this._super(m,k);var m=this.content();if(k==null){this.content(null)}else{var l=null;if(k instanceof Wipeout.Docs.Models.Pages.LandingPage){l=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Class){l=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Event){l=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Property){l=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(k instanceof Wipeout.Docs.Models.Descriptions.Function){l=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}l.model(k);this.content(l)}};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){this._super.apply(this,arguments)};j.prototype.onCodeChanged=function(k){new Function(k.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){j.staticConstructor();this._super.apply(this,arguments)};var k;j.staticConstructor=function(){if(k){return}k=document.createElement("div");k.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(k)};j.prototype.onCodeChanged=function(l){k.innerHTML+=l.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return j});g.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var j=function(){this._super(j.nullTemplate)};j.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";j.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";j.nullTemplate=wo.visual.getBlankTemplateId();j.prototype.onModelChanged=function(l,k){this._super(l,k);if(k&&(k.branches||k.payload())){this.templateId(j.branchTemplate)}else{if(k){this.templateId(j.leafTemplate)}else{this.templateId(j.nullTemplate)}}};j.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var k=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&k){this.triggerRoutedEvent(j.renderPage,k)}};j.renderPage=new wo.routedEvent();return j});g.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var j=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};j.prototype.onCodeChanged=function(k){this.usage(k.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return j});g.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var j=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var k=this.model().classFullName+j.classUsagesTemplateSuffix;if(document.getElementById(k)){return k}}return wo.contentControl.getBlankTemplateId()},this)};j.classUsagesTemplateSuffix="_ClassUsages";return j});g.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});g.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});g.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var o=new Wipeout.Docs.Models.Components.Api();var n=(function(){var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",o.forClass("wo.object"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",o.forClass("wo.routedEventModel"));var O=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",o.forClass("wo.visual"));var N=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",o.forClass("wo.view"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",o.forClass("wo.contentControl"));var R=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",o.forClass("wo.if"));var j=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",o.forClass("wo.itemsControl"));var P=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",o.forClass("wo.event"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",o.forClass("wo.routedEvent"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",o.forClass("wo.routedEventArgs"));var M=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",o.forClass("wo.routedEventRegistration"));var Q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",o.forClass("wo.html"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",o.forClass("wo.ko.virtualElements"));var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",o.forClass("wipeout.utils.ko.array"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",o.forClass("wo.ko"),{staticProperties:{virtualElements:q,array:k}});var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",o.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[t,P,R,Q,j,p,r,s,v,u,w,M,N,O])})();var l=(function(){var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",o.forClass("wipeout.bindings.itemsControl"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",o.forClass("wipeout.bindings.render"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",o.forClass("wipeout.bindings.wipeout-type"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",o.forClass("wipeout.bindings.wo"));var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",o.forClass("wipeout.bindings.wipeout"));var j=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",o.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[j,t,u,v,s,k])})();var m=(function(){var j=(function(){var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",o.forClass("wo.object"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",o.forClass("wo.routedEventModel"));var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",o.forClass("wo.visual"));var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",o.forClass("wo.view"));var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",o.forClass("wo.contentControl"));var L=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",o.forClass("wo.if"));var M=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",o.forClass("wo.itemsControl"));var K=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",o.forClass("wo.event"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",o.forClass("wo.routedEvent"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",o.forClass("wo.routedEventArgs"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",o.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[J,K,L,M,r,t,s,u,v,H,I])})();var k=(function(){var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",o.forClass("wipeout.bindings.itemsControl"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",o.forClass("wipeout.bindings.render"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",o.forClass("wipeout.bindings.wipeout-type"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",o.forClass("wipeout.bindings.wo"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",o.forClass("wipeout.bindings.wipeout"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",o.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[x,A,B,C,z,y])})();var p=(function(){o.forClass("ko.templateEngine");var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",o.forClass("wipeout.template.engine"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",o.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[r,s])})();var q=(function(){var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",o.forClass("wipeout.utils.html"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",o.forClass("wipeout.utils.ko.virtualElements"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",o.forClass("wipeout.utils.ko.array"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",o.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:y,array:w}});var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",o.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[v,x,z])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[j,k,p,q])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[n,l,m])])}});var h=function(p,n,o){o=o||window;if(p){for(var q=0,r=p.length;q<r;q++){n.call(o,p[q],q)}}};var i=function(k,l){var j=l||window;h(k.split("."),function(m){j=j[m]});return j};g.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var j=function(k){this._super();this.classes=[]};j.prototype.getClassDescription=function(k){for(var l=0,m=this.classes.length;l<m;l++){if(this.classes[l].classConstructor===k){return this.classes[l].classDescription}}};j.prototype.forClass=function(n){var m=i(n);var p=this.getClassDescription(m);if(p){return p}var o=new Wipeout.Docs.Models.Descriptions.Class(n,this);this.classes.push({classDescription:o,classConstructor:m});return o};return j});g.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var j=function(m,k,l){this._super(m,k,j.compileBranches(k,l))};j.compileBranches=function(k,l){var m=[];l=l||{};l.staticEvents=l.staticEvents||{};l.staticProperties=l.staticProperties||{};l.staticFunctions=l.staticFunctions||{};l.events=l.events||{};l.properties=l.properties||{};l.functions=l.functions||{};m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));h(k.staticEvents,function(n){if(l.staticEvents[n.eventName]){m.push(l.staticEvents[n.eventName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.eventName,null))}});h(k.staticProperties,function(n){if(l.staticProperties[n.propertyName]){m.push(l.staticProperties[n.propertyName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.propertyName,null))}});h(k.staticFunctions,function(n){if(l.staticFunctions[n.functionName]){m.push(l.staticFunctions[n.functionName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.functionName,null))}});h(k.events,function(n){if(l.events[n.eventName]){m.push(l.events[n.eventName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.eventName,null))}});h(k.properties,function(n){if(l.staticProperties[n.propertyName]){m.push(l.staticProperties[n.propertyName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.propertyName,null))}});h(k.functions,function(n){if(l.functions[n.functionName]){m.push(l.functions[n.functionName])}else{m.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(n.functionName,null))}});m.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return m};return j});g.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var j=function(l,m,k){this._super(l,k);this.page=m};j.prototype.payload=function(){return this.page};return j});g.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var j=function(l,k){this._super();this.name=l;this.branches=k};j.prototype.payload=function(){return null};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var j=function(l,k){this._super();this.className=j.getClassName(l);this.constructorFunction=i(l);this.classFullName=l;this.api=k;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};j.getClassName=function(k){k=k.split(".");return k[k.length-1]};j.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var u in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(u)){if(this.constructorFunction[u] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,u,this.classFullName))}else{if(this.constructorFunction[u] instanceof Function&&!ko.isObservable(this.constructorFunction[u])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[u],u,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,u,this.classFullName))}}}}for(var u in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(u)){if(this.constructorFunction.prototype[u] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,u,this.classFullName))}else{if(this.constructorFunction.prototype[u] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[u])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[u],u,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,u,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var k=new this.constructorFunction();for(var u in k){if(k.hasOwnProperty(u)){if(k[u] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,u,this.classFullName))}else{if(k[u] instanceof Function&&!ko.isObservable(k[u])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(k[u],u,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,u,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var m=this.constructorFunction;while((m=Object.getPrototypeOf(m.prototype).constructor)!==Object){var w=this.api.getClassDescription(m);if(!w){throw"Class has not been defined yet"}var l=function(n,o){h(w[n],function(p){if(this[n].indexOf(p)!==-1){return}for(var q=0,r=this[n].length;q<r;q++){if(this[n][q][o]===p[o]){if(!this[n][q].overrides){this[n][q].overrides=p}return}}this[n].push(p)},this)};l.call(this,"events","eventName");l.call(this,"properties","propertyName");l.call(this,"functions","functionName")}}var x=function(n){h(this[n],function(p){var o=p;while(o&&o.overrides&&!o.summary){if(o.overrides.summary){o.summary=o.overrides.summary+(o.overrides.summaryInherited?"":" (from "+o.overrides.classFullName+")");o.summaryInherited=true}o=o.overrides}})};x.call(this,"staticProperties");x.call(this,"staticFunctions");x.call(this,"staticEvents");x.call(this,"events");x.call(this,"properties");x.call(this,"functions");for(var u=0,v=this.functions.length;u<v;u++){if(this.functions[u].functionName==="constructor"){this.classConstructor=this.functions.splice(u,1)[0];break}}if(u===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var y=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(y);this.staticEvents.sort(y);this.properties.sort(y);this.staticProperties.sort(y);this.functions.sort(y);this.staticFunctions.sort(y)};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(j,k){this._super();this.name=j;this.summary=k}});g.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var j=function(l,m,k){this._super(m,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(l,m));this.eventName=m;this.classFullName=k};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var j=function(m,l,k){this._super(l,j.getFunctionSummary(m));this["function"]=m;this.functionName=l;this.classFullName=k;this.overrides=null};j.getFunctionSummary=function(s){var o=s.toString();var q=false;var p=false;var r=function(){var l=o.indexOf("//");var k=o.indexOf("/*");var m=o.indexOf("{");if(l===-1){l=Number.MAX_VALUE}if(k===-1){k=Number.MAX_VALUE}if(m<l&&m<k){o=o.substr(m+1).replace(/^\s+|\s+$/g,"")}else{if(l<k){o=o.substr(o.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{o=o.substr(o.indexOf("*/")).replace(/^\s+|\s+$/g,"")}r()}};r();if(o.indexOf("///<summary>")===0){return o.substring(12,o.indexOf("</summary>"))}return""};return j});g.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var k=function(m,n,l){this._super(n,k.getPropertySummary(m,n,l));this.propertyName=n;this.classFullName=l};var j=/^\/\//;k.getPropertySummary=function(q,r,p){var s;if(s=k.getPropertyDescriptionOverride(p+"."+r)){return s}q=q.toString();var t=function(o){var m=q.search(o);if(m!==-1){var l=q.substring(0,m);var n=l.lastIndexOf("\n");if(n>0){l=l.substring(n)}l=l.replace(/^\s+|\s+$/g,"");if(j.test(l)){return l.substring(2)}else{return null}}};s=t(new RegExp("\\s*this\\s*\\.\\s*"+r+"\\s*="));if(s){return s}return t(new RegExp('\\s*this\\s*\\[\\s*"'+r+'"\\s*\\]\\s*='))};k.getPropertyDescriptionOverride=function(l){var m=k.descriptionOverrides;h(l.split("."),function(n){if(!m){return}m=m[n]});return m};k.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block. "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block. "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return k});g.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(j){this._super();this.title=j}});g.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(j){this._super(j)}});g.compile(window.Wipeout)})();d.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var k=new Wipeout.Docs.Models.Components.Api();var j=(function(){var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",k.forClass("wo.object"));var I=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",k.forClass("wo.routedEventModel"));var L=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",k.forClass("wo.visual"));var K=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",k.forClass("wo.view"));var g=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",k.forClass("wo.contentControl"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",k.forClass("wo.if"));var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",k.forClass("wo.itemsControl"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",k.forClass("wo.event"));var H=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",k.forClass("wo.routedEvent"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",k.forClass("wo.routedEventArgs"));var J=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",k.forClass("wo.routedEventRegistration"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",k.forClass("wo.html"));var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",k.forClass("wo.ko.virtualElements"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",k.forClass("wipeout.utils.ko.array"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",k.forClass("wo.ko"),{staticProperties:{virtualElements:D,array:B}});var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",k.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[g,x,z,y,A,C,E,F,H,G,I,J,K,L])})();var h=(function(){var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",k.forClass("wipeout.bindings.itemsControl"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",k.forClass("wipeout.bindings.render"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",k.forClass("wipeout.bindings.wipeout-type"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",k.forClass("wipeout.bindings.wo"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",k.forClass("wipeout.bindings.wipeout"));var g=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",k.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[g,p,q,r,o,n])})();var i=(function(){var g=(function(){var A=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",k.forClass("wo.object"));var D=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",k.forClass("wo.routedEventModel"));var G=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",k.forClass("wo.visual"));var F=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",k.forClass("wo.view"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",k.forClass("wo.contentControl"));var y=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",k.forClass("wo.if"));var z=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",k.forClass("wo.itemsControl"));var x=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",k.forClass("wo.event"));var C=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",k.forClass("wo.routedEvent"));var B=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",k.forClass("wo.routedEventArgs"));var E=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",k.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[w,x,y,z,A,C,B,D,E,F,G])})();var l=(function(){var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",k.forClass("wipeout.bindings.itemsControl"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",k.forClass("wipeout.bindings.render"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",k.forClass("wipeout.bindings.wipeout-type"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",k.forClass("wipeout.bindings.wo"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",k.forClass("wipeout.bindings.wipeout"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",k.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[r,u,v,w,t,s])})();var m=(function(){k.forClass("ko.templateEngine");var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",k.forClass("wipeout.template.engine"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",k.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[o,p])})();var n=(function(){var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",k.forClass("wipeout.utils.html"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",k.forClass("wipeout.utils.ko.virtualElements"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",k.forClass("wipeout.utils.ko.array"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",k.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:t,array:r}});var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",k.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[q,s,u])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[g,l,m,n])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[j,h,i])])}});d.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var g=function(h){this._super();this.classes=[]};g.prototype.getClassDescription=function(h){for(var i=0,j=this.classes.length;i<j;i++){if(this.classes[i].classConstructor===h){return this.classes[i].classDescription}}};g.prototype.forClass=function(j){var i=f(j);var l=this.getClassDescription(i);if(l){return l}var k=new Wipeout.Docs.Models.Descriptions.Class(j,this);this.classes.push({classDescription:k,classConstructor:i});return k};return g});d.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var g=function(j,h,i){this._super(j,h,g.compileBranches(h,i))};g.compileBranches=function(h,i){var j=[];i=i||{};i.staticEvents=i.staticEvents||{};i.staticProperties=i.staticProperties||{};i.staticFunctions=i.staticFunctions||{};i.events=i.events||{};i.properties=i.properties||{};i.functions=i.functions||{};j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));e(h.staticEvents,function(k){if(i.staticEvents[k.eventName]){j.push(i.staticEvents[k.eventName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.eventName,null))}});e(h.staticProperties,function(k){if(i.staticProperties[k.propertyName]){j.push(i.staticProperties[k.propertyName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.propertyName,null))}});e(h.staticFunctions,function(k){if(i.staticFunctions[k.functionName]){j.push(i.staticFunctions[k.functionName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.functionName,null))}});e(h.events,function(k){if(i.events[k.eventName]){j.push(i.events[k.eventName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.eventName,null))}});e(h.properties,function(k){if(i.staticProperties[k.propertyName]){j.push(i.staticProperties[k.propertyName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.propertyName,null))}});e(h.functions,function(k){if(i.functions[k.functionName]){j.push(i.functions[k.functionName])}else{j.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(k.functionName,null))}});j.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return j};return g});d.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var g=function(i,j,h){this._super(i,h);this.page=j};g.prototype.payload=function(){return this.page};return g});d.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var g=function(i,h){this._super();this.name=i;this.branches=h};g.prototype.payload=function(){return null};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var g=function(i,h){this._super();this.className=g.getClassName(i);this.constructorFunction=f(i);this.classFullName=i;this.api=h;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};g.getClassName=function(h){h=h.split(".");return h[h.length-1]};g.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var p in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(p)){if(this.constructorFunction[p] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,p,this.classFullName))}else{if(this.constructorFunction[p] instanceof Function&&!ko.isObservable(this.constructorFunction[p])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[p],p,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,p,this.classFullName))}}}}for(var p in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(p)){if(this.constructorFunction.prototype[p] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,p,this.classFullName))}else{if(this.constructorFunction.prototype[p] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[p])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[p],p,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,p,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var i=new this.constructorFunction();for(var p in i){if(i.hasOwnProperty(p)){if(i[p] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,p,this.classFullName))}else{if(i[p] instanceof Function&&!ko.isObservable(i[p])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(i[p],p,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,p,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var o=this.constructorFunction;while((o=Object.getPrototypeOf(o.prototype).constructor)!==Object){var r=this.api.getClassDescription(o);if(!r){throw"Class has not been defined yet"}var n=function(h,j){e(r[h],function(k){if(this[h].indexOf(k)!==-1){return}for(var l=0,m=this[h].length;l<m;l++){if(this[h][l][j]===k[j]){if(!this[h][l].overrides){this[h][l].overrides=k}return}}this[h].push(k)},this)};n.call(this,"events","eventName");n.call(this,"properties","propertyName");n.call(this,"functions","functionName")}}var s=function(h){e(this[h],function(k){var j=k;while(j&&j.overrides&&!j.summary){if(j.overrides.summary){j.summary=j.overrides.summary+(j.overrides.summaryInherited?"":" (from "+j.overrides.classFullName+")");j.summaryInherited=true}j=j.overrides}})};s.call(this,"staticProperties");s.call(this,"staticFunctions");s.call(this,"staticEvents");s.call(this,"events");s.call(this,"properties");s.call(this,"functions");for(var p=0,q=this.functions.length;p<q;p++){if(this.functions[p].functionName==="constructor"){this.classConstructor=this.functions.splice(p,1)[0];break}}if(p===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var t=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(t);this.staticEvents.sort(t);this.properties.sort(t);this.staticProperties.sort(t);this.functions.sort(t);this.staticFunctions.sort(t)};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(g,h){this._super();this.name=g;this.summary=h}});d.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var g=function(i,j,h){this._super(j,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(i,j));this.eventName=j;this.classFullName=h};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var g=function(j,i,h){this._super(i,g.getFunctionSummary(j));this["function"]=j;this.functionName=i;this.classFullName=h;this.overrides=null};g.getFunctionSummary=function(n){var j=n.toString();var l=false;var k=false;var m=function(){var i=j.indexOf("//");var h=j.indexOf("/*");var o=j.indexOf("{");if(i===-1){i=Number.MAX_VALUE}if(h===-1){h=Number.MAX_VALUE}if(o<i&&o<h){j=j.substr(o+1).replace(/^\s+|\s+$/g,"")}else{if(i<h){j=j.substr(j.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{j=j.substr(j.indexOf("*/")).replace(/^\s+|\s+$/g,"")}m()}};m();if(j.indexOf("///<summary>")===0){return j.substring(12,j.indexOf("</summary>"))}return""};return g});d.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var h=function(j,k,i){this._super(k,h.getPropertySummary(j,k,i));this.propertyName=k;this.classFullName=i};var g=/^\/\//;h.getPropertySummary=function(l,m,k){var n;if(n=h.getPropertyDescriptionOverride(k+"."+m)){return n}l=l.toString();var o=function(q){var j=l.search(q);if(j!==-1){var i=l.substring(0,j);var p=i.lastIndexOf("\n");if(p>0){i=i.substring(p)}i=i.replace(/^\s+|\s+$/g,"");if(g.test(i)){return i.substring(2)}else{return null}}};n=o(new RegExp("\\s*this\\s*\\.\\s*"+m+"\\s*="));if(n){return n}return o(new RegExp('\\s*this\\s*\\[\\s*"'+m+'"\\s*\\]\\s*='))};h.getPropertyDescriptionOverride=function(i){var j=h.descriptionOverrides;e(i.split("."),function(k){if(!j){return}j=j[k]});return j};h.descriptionOverrides={wo:{"if":{woInvisibleDefault:"The default value for woInvisible for the wo.if class."},html:{specialTags:"A list of html tags which cannot be placed inside a div element."},ko:{array:"Utils for operating on observableArrays",virtualElements:"Utils for operating on knockout virtual elements"},object:{useVirtualCache:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."},view:{objectParser:"Used to parse string values into a given type",reservedPropertyNames:"Properties which cannot be set on a wipeout object via the template"},visual:{reservedTags:"A list of names which cannot be used as wipeout object names. These are mostly html tag names",woInvisibleDefault:"The default value for woInvisible for the wo.visual class."}},wipeout:{template:{engine:{closeCodeTag:'Signifies the end of a wipeout code block: "'+wipeout.template.engine.closeCodeTag+'".',instance:"An instance of a wipeout.template.engine which is used by the render binding.",openCodeTag:'Signifies the beginning of a wipeout code block: "'+wipeout.template.engine.openCodeTag+'".',scriptCache:"A placeholder for precompiled scripts.",scriptHasBeenReWritten:"TODO"}}}};return h});d.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(g){this._super();this.title=g}});d.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(g){this._super(g)}});d.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function g(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(h){this.model().content(h.data)},this)}g.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var g=function(h){this._super(h||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};g.prototype.onCodeChanged=function(h){};g.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var g=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};g.prototype.onModelChanged=function(j,h){this._super(j,h);var j=this.content();if(h==null){this.content(null)}else{var i=null;if(h instanceof Wipeout.Docs.Models.Pages.LandingPage){i=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Class){i=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Event){i=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Property){i=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(h instanceof Wipeout.Docs.Models.Descriptions.Function){i=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}i.model(h);this.content(i)}};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){this._super.apply(this,arguments)};g.prototype.onCodeChanged=function(h){new Function(h.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){g.staticConstructor();this._super.apply(this,arguments)};var h;g.staticConstructor=function(){if(h){return}h=document.createElement("div");h.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(h)};g.prototype.onCodeChanged=function(i){h.innerHTML+=i.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return g});d.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var g=function(){this._super(g.nullTemplate)};g.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";g.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";g.nullTemplate=wo.visual.getBlankTemplateId();g.prototype.onModelChanged=function(i,h){this._super(i,h);if(h&&(h.branches||h.payload())){this.templateId(g.branchTemplate)}else{if(h){this.templateId(g.leafTemplate)}else{this.templateId(g.nullTemplate)}}};g.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var h=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&h){this.triggerRoutedEvent(g.renderPage,h)}};g.renderPage=new wo.routedEvent();return g});d.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var g=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};g.prototype.onCodeChanged=function(h){this.usage(h.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return g});d.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var g=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var h=this.model().classFullName+g.classUsagesTemplateSuffix;if(document.getElementById(h)){return h}}return wo.contentControl.getBlankTemplateId()},this)};g.classUsagesTemplateSuffix="_ClassUsages";return g});d.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});d.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});d.compile(window.Wipeout)})();a.registerClass("Wipeout.Docs.Models.Application","wo.object",function(){return function(){this.content=ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());var g=new Wipeout.Docs.Models.Components.Api();var f=(function(){var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",g.forClass("wo.object"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",g.forClass("wo.routedEventModel"));var w=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",g.forClass("wo.visual"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",g.forClass("wo.view"));var h=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",g.forClass("wo.contentControl"));var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",g.forClass("wo.if"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",g.forClass("wo.itemsControl"));var i=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",g.forClass("wo.event"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",g.forClass("wo.routedEvent"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",g.forClass("wo.routedEventArgs"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",g.forClass("wo.routedEventRegistration"));var j=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",g.forClass("wo.html"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",g.forClass("wo.ko.virtualElements"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",g.forClass("wipeout.utils.ko.array"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",g.forClass("wo.ko"),{staticProperties:{virtualElements:o,array:m}});var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",g.forClass("wo.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("wo",[h,i,k,j,l,n,p,q,s,r,t,u,v,w])})();var d=(function(){var k=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",g.forClass("wipeout.bindings.itemsControl"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",g.forClass("wipeout.bindings.render"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",g.forClass("wipeout.bindings.wipeout-type"));var j=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",g.forClass("wipeout.bindings.wo"));var i=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",g.forClass("wipeout.bindings.wipeout"));var h=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",g.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[h,k,l,m,j,i])})();var e=(function(){var h=(function(){var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object",g.forClass("wo.object"));var s=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel",g.forClass("wo.routedEventModel"));var v=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual",g.forClass("wo.visual"));var u=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view",g.forClass("wo.view"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl",g.forClass("wo.contentControl"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if",g.forClass("wo.if"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",g.forClass("wo.itemsControl"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event",g.forClass("wo.event"));var r=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent",g.forClass("wo.routedEvent"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs",g.forClass("wo.routedEventArgs"));var t=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration",g.forClass("wo.routedEventRegistration"));return new Wipeout.Docs.Models.Components.TreeViewBranch("base",[l,m,n,o,p,r,q,s,t,u,v])})();var i=(function(){var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl",g.forClass("wipeout.bindings.itemsControl"));var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render",g.forClass("wipeout.bindings.render"));var q=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type",g.forClass("wipeout.bindings.wipeout-type"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo",g.forClass("wipeout.bindings.wo"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout",g.forClass("wipeout.bindings.wipeout"));var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render",g.forClass("wipeout.bindings.ic-render"));return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings",[l,o,p,q,n,m])})();var j=(function(){g.forClass("ko.templateEngine");var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine",g.forClass("wipeout.template.engine"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder",g.forClass("wipeout.template.htmlBuilder"));return new Wipeout.Docs.Models.Components.TreeViewBranch("template",[l,m])})();var k=(function(){var l=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html",g.forClass("wipeout.utils.html"));var o=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements",g.forClass("wipeout.utils.ko.virtualElements"));var m=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array",g.forClass("wipeout.utils.ko.array"));var n=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko",g.forClass("wipeout.utils.ko"),{staticProperties:{virtualElements:o,array:m}});var p=new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj",g.forClass("wipeout.utils.obj"));return new Wipeout.Docs.Models.Components.TreeViewBranch("utils",[l,n,p])})();return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)",[h,i,j,k])})();this.menu=new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout",[new Wipeout.Docs.Models.Components.TreeViewBranch("API",[f,d,e])])}});a.registerClass("Wipeout.Docs.Models.Components.Api","wo.object",function(){var d=function(e){this._super();this.classes=[]};d.prototype.getClassDescription=function(e){for(var f=0,g=this.classes.length;f<g;f++){if(this.classes[f].classConstructor===e){return this.classes[f].classDescription}}};d.prototype.forClass=function(f){var e=c(f);var h=this.getClassDescription(e);if(h){return h}var g=new Wipeout.Docs.Models.Descriptions.Class(f,this);this.classes.push({classDescription:g,classConstructor:e});return g};return d});a.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch","Wipeout.Docs.Models.Components.PageTreeViewBranch",function(){var d=function(g,e,f){this._super(g,e,d.compileBranches(e,f))};d.compileBranches=function(e,f){var g=[];f=f||{};f.staticEvents=f.staticEvents||{};f.staticProperties=f.staticProperties||{};f.staticFunctions=f.staticFunctions||{};f.events=f.events||{};f.properties=f.properties||{};f.functions=f.functions||{};g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));b(e.staticEvents,function(h){if(f.staticEvents[h.eventName]){g.push(f.staticEvents[h.eventName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.eventName,null))}});b(e.staticProperties,function(h){if(f.staticProperties[h.propertyName]){g.push(f.staticProperties[h.propertyName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.propertyName,null))}});b(e.staticFunctions,function(h){if(f.staticFunctions[h.functionName]){g.push(f.staticFunctions[h.functionName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.functionName,null))}});b(e.events,function(h){if(f.events[h.eventName]){g.push(f.events[h.eventName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.eventName,null))}});b(e.properties,function(h){if(f.staticProperties[h.propertyName]){g.push(f.staticProperties[h.propertyName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.propertyName,null))}});b(e.functions,function(h){if(f.functions[h.functionName]){g.push(f.functions[h.functionName])}else{g.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(h.functionName,null))}});g.sort(function(){return arguments[0].name==="constructor"?-1:arguments[0].name.localeCompare(arguments[1].name)});return g};return d});a.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch","Wipeout.Docs.Models.Components.TreeViewBranch",function(){var d=function(f,g,e){this._super(f,e);this.page=g};d.prototype.payload=function(){return this.page};return d});a.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch","wo.object",function(){var d=function(f,e){this._super();this.name=f;this.branches=e};d.prototype.payload=function(){return null};return d});a.registerClass("Wipeout.Docs.Models.Descriptions.Class","wo.object",function(){var d=function(f,e){this._super();this.className=d.getClassName(f);this.constructorFunction=c(f);this.classFullName=f;this.api=e;this.classConstructor=null;this.events=[];this.staticEvents=[];this.properties=[];this.staticProperties=[];this.functions=[];this.staticFunctions=[];this.rebuild()};d.getClassName=function(e){e=e.split(".");return e[e.length-1]};d.prototype.rebuild=function(){this.classConstructor=null;this.events.length=0;this.staticEvents.length=0;this.properties.length=0;this.staticProperties.length=0;this.functions.length=0;this.staticFunctions.length=0;for(var h in this.constructorFunction){if(this.constructorFunction.hasOwnProperty(h)){if(this.constructorFunction[h] instanceof wo.event){this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,h,this.classFullName))}else{if(this.constructorFunction[h] instanceof Function&&!ko.isObservable(this.constructorFunction[h])){this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[h],h,this.classFullName))}else{this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,h,this.classFullName))}}}}for(var h in this.constructorFunction.prototype){if(this.constructorFunction.prototype.hasOwnProperty(h)){if(this.constructorFunction.prototype[h] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,h,this.classFullName))}else{if(this.constructorFunction.prototype[h] instanceof Function&&!ko.isObservable(this.constructorFunction.prototype[h])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[h],h,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,h,this.classFullName))}}}}if(this.constructorFunction.constructor===Function){var e=new this.constructorFunction();for(var h in e){if(e.hasOwnProperty(h)){if(e[h] instanceof wo.event){this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction,h,this.classFullName))}else{if(e[h] instanceof Function&&!ko.isObservable(e[h])){this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(e[h],h,this.classFullName))}else{this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction,h,this.classFullName))}}}}}if(this.constructorFunction.constructor===Function){var g=this.constructorFunction;while((g=Object.getPrototypeOf(g.prototype).constructor)!==Object){var k=this.api.getClassDescription(g);if(!k){throw"Class has not been defined yet"}var f=function(i,n){b(k[i],function(o){if(this[i].indexOf(o)!==-1){return}for(var p=0,q=this[i].length;p<q;p++){if(this[i][p][n]===o[n]){if(!this[i][p].overrides){this[i][p].overrides=o}return}}this[i].push(o)},this)};f.call(this,"events","eventName");f.call(this,"properties","propertyName");f.call(this,"functions","functionName")}}var l=function(i){b(this[i],function(o){var n=o;while(n&&n.overrides&&!n.summary){if(n.overrides.summary){n.summary=n.overrides.summary+(n.overrides.summaryInherited?"":" (from "+n.overrides.classFullName+")");n.summaryInherited=true}n=n.overrides}})};l.call(this,"staticProperties");l.call(this,"staticFunctions");l.call(this,"staticEvents");l.call(this,"events");l.call(this,"properties");l.call(this,"functions");for(var h=0,j=this.functions.length;h<j;h++){if(this.functions[h].functionName==="constructor"){this.classConstructor=this.functions.splice(h,1)[0];break}}if(h===this.functions.length){this.classConstructor=new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction,this.className,this.classFullName)}var m=function(){return arguments[0].name.localeCompare(arguments[1].name)};this.events.sort(m);this.staticEvents.sort(m);this.properties.sort(m);this.staticProperties.sort(m);this.functions.sort(m);this.staticFunctions.sort(m)};return d});a.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem","wo.object",function(){return function(d,e){this._super();this.name=d;this.summary=e}});a.registerClass("Wipeout.Docs.Models.Descriptions.Event","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var d=function(f,g,e){this._super(g,Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(f,g));this.eventName=g;this.classFullName=e};return d});a.registerClass("Wipeout.Docs.Models.Descriptions.Function","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var d=function(g,f,e){this._super(f,d.getFunctionSummary(g));this["function"]=g;this.functionName=f;this.classFullName=e;this.overrides=null};d.getFunctionSummary=function(i){var e=i.toString();var g=false;var f=false;var h=function(){var k=e.indexOf("//");var j=e.indexOf("/*");var l=e.indexOf("{");if(k===-1){k=Number.MAX_VALUE}if(j===-1){j=Number.MAX_VALUE}if(l<k&&l<j){e=e.substr(l+1).replace(/^\s+|\s+$/g,"")}else{if(k<j){e=e.substr(e.indexOf("\n")).replace(/^\s+|\s+$/g,"")}else{e=e.substr(e.indexOf("*/")).replace(/^\s+|\s+$/g,"")}h()}};h();if(e.indexOf("///<summary>")===0){return e.substring(12,e.indexOf("</summary>"))}return""};return d});a.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription","Wipeout.Docs.Models.Descriptions.ClassItem",function(){var e=function(g,h,f){this._super(h,e.getPropertySummary(g,h,f));this.propertyName=h;this.classFullName=f};var d=/^\/\//;e.getPropertySummary=function(g,h,f){var i;if(i=e.getPropertyDescriptionOverride(f+"."+h)){return i.description}g=g.toString();var j=function(n){var l=g.search(n);if(l!==-1){var k=g.substring(0,l);var m=k.lastIndexOf("\n");if(m>0){k=k.substring(m)}k=k.replace(/^\s+|\s+$/g,"");if(d.test(k)){return k.substring(2)}else{return null}}};i=j(new RegExp("\\s*this\\s*\\.\\s*"+h+"\\s*="));if(i){return i}return j(new RegExp('\\s*this\\s*\\[\\s*"'+h+'"\\s*\\]\\s*='))};e.getPropertyDescriptionOverride=function(f){var g=e.descriptionOverrides;b(f.split("."),function(h){if(!g){return}g=g[h]});return g};e.descriptionOverrides={wo:{"if":{woInvisibleDefault:{description:"The default value for woInvisible for the wo.if class."}},html:{specialTags:{description:"A list of html tags which cannot be placed inside a div element."}},ko:{array:{description:"Utils for operating on observableArrays"},virtualElements:{description:"Utils for operating on knockout virtual elements"}},object:{useVirtualCache:{description:"When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."}},view:{objectParser:{description:"Used to parse string values into a given type"},reservedPropertyNames:{description:"Properties which cannot be set on a wipeout object via the template"}},visual:{reservedTags:{description:"A list of names which cannot be used as wipeout object names. These are mostly html tag names"},woInvisibleDefault:{description:"The default value for woInvisible for the wo.visual class."}}},wipeout:{template:{engine:{closeCodeTag:{description:'Signifies the end of a wipeout code block: "'+wipeout.template.engine.closeCodeTag+'".'},instance:{description:"An instance of a wipeout.template.engine which is used by the render binding."},openCodeTag:{description:'Signifies the beginning of a wipeout code block: "'+wipeout.template.engine.openCodeTag+'".'},scriptCache:{description:"A placeholder for precompiled scripts."},scriptHasBeenReWritten:{description:"TODO"}}}}};return e});a.registerClass("Wipeout.Docs.Models.Pages.DisplayItem","wo.object",function(){return function(d){this._super();this.title=d}});a.registerClass("Wipeout.Docs.Models.Pages.LandingPage","Wipeout.Docs.Models.Pages.DisplayItem",function(){return function(d){this._super(d)}});a.registerClass("Wipeout.Docs.ViewModels.Application","wo.view",function(){function d(){this._super("Wipeout.Docs.ViewModels.Application");this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage,function(e){this.model().content(e.data)},this)}d.prototype.onRendered=function(){this._super.apply(this,arguments);this.templateItems.treeView.select()};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock","wo.view",function(){var d=function(e){this._super(e||"Wipeout.Docs.ViewModels.Components.CodeBlock");this.code=ko.observable();this.code.subscribe(this.onCodeChanged,this)};d.prototype.onCodeChanged=function(e){};d.prototype.onRendered=function(){this._super.apply(this,arguments);prettyPrint(null,this.templateItems.codeBlock)};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender","wo.contentControl",function(){var d=function(){this._super();this.content=ko.observable();this.template("<!-- ko render: content --><!-- /ko -->")};d.prototype.onModelChanged=function(g,e){this._super(g,e);var g=this.content();if(e==null){this.content(null)}else{var f=null;if(e instanceof Wipeout.Docs.Models.Pages.LandingPage){f=new Wipeout.Docs.ViewModels.Pages.LandingPage()}else{if(e instanceof Wipeout.Docs.Models.Descriptions.Class){f=new Wipeout.Docs.ViewModels.Pages.ClassPage()}else{if(e instanceof Wipeout.Docs.Models.Descriptions.Event){f=new Wipeout.Docs.ViewModels.Pages.EventPage()}else{if(e instanceof Wipeout.Docs.Models.Descriptions.Property){f=new Wipeout.Docs.ViewModels.Pages.PropertyPage()}else{if(e instanceof Wipeout.Docs.Models.Descriptions.Function){f=new Wipeout.Docs.ViewModels.Pages.FunctionPage()}else{throw"Unknown model type"}}}}}f.model(e);this.content(f)}};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var d=function(){this._super.apply(this,arguments)};d.prototype.onCodeChanged=function(e){new Function(e.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))()};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var d=function(){d.staticConstructor();this._super.apply(this,arguments)};var e;d.staticConstructor=function(){if(e){return}e=document.createElement("div");e.setAttribute("style","display: none");document.getElementsByTagName("body")[0].appendChild(e)};d.prototype.onCodeChanged=function(f){e.innerHTML+=f.replace(/\&lt;/g,"<").replace(/\&gt;/g,">")};return d});a.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch","wo.view",function(){var d=function(){this._super(d.nullTemplate)};d.branchTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";d.leafTemplate="Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";d.nullTemplate=wo.visual.getBlankTemplateId();d.prototype.onModelChanged=function(f,e){this._super(f,e);if(e&&(e.branches||e.payload())){this.templateId(d.branchTemplate)}else{if(e){this.templateId(d.leafTemplate)}else{this.templateId(d.nullTemplate)}}};d.prototype.select=function(){if(this.model().branches){$(this.templateItems.content).toggle()}var e=this.model().payload();if($(this.templateItems.content).filter(":visible").length&&e){this.triggerRoutedEvent(d.renderPage,e)}};d.renderPage=new wo.routedEvent();return d});a.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock","Wipeout.Docs.ViewModels.Components.CodeBlock",function(){var d=function(){this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");this.usage=ko.observable()};d.prototype.onCodeChanged=function(e){this.usage(e.replace(/\&lt;/g,"<").replace(/\&amp;/g,"&").replace(/\&gt;/g,">"))};return d});a.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable","wo.itemsControl",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable","Wipeout.Docs.ViewModels.Pages.ClassItemRow")}});a.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage","wo.view",function(){var d=function(){this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");this.usagesTemplateId=ko.computed(function(){if(this.model()){var e=this.model().classFullName+d.classUsagesTemplateSuffix;if(document.getElementById(e)){return e}}return wo.contentControl.getBlankTemplateId()},this)};d.classUsagesTemplateSuffix="_ClassUsages";return d});a.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage")}});a.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.LandingPage")}});a.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage","wo.view",function(){return function(){this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage")}});a.compile(window.Wipeout)})();

compiler.registerClass("Wipeout.Docs.Models.Application", "wo.object", function() {
    
    return function() {
        
        this.content = ko.observable(new Wipeout.Docs.Models.Pages.LandingPage());
        
        var currentApi = new Wipeout.Docs.Models.Components.Api();
                
        //wo
        var _wo = (function() {
            var objectBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object", currentApi.forClass("wo.object"));
            var routedEventModelBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel", currentApi.forClass("wo.routedEventModel"));
            var visualBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual", currentApi.forClass("wo.visual"));
            var viewBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view", currentApi.forClass("wo.view"));
            var contentControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl", currentApi.forClass("wo.contentControl"));
            var ifBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if", currentApi.forClass("wo.if"));
            var itemsControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wo.itemsControl"));
            var eventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event", currentApi.forClass("wo.event"));
            var routedEventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent", currentApi.forClass("wo.routedEvent"));
            var routedEventArgsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs", currentApi.forClass("wo.routedEventArgs"));
            var routedEventRegistrationBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration", currentApi.forClass("wo.routedEventRegistration"));
            
            var htmlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html", currentApi.forClass("wo.html"));
            var koVirtualElementsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements", currentApi.forClass("wo.ko.virtualElements"));
            var koArrayBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array", currentApi.forClass("wipeout.utils.ko.array"));
            var koBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko", currentApi.forClass("wo.ko"), {staticProperties: {"virtualElements": koVirtualElementsBranch, "array": koArrayBranch}});
            var objBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj", currentApi.forClass("wo.obj"));
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("wo", [
                contentControlBranch,
                eventBranch,
                ifBranch,
                htmlBranch,
                itemsControlBranch,
                koBranch,
                objBranch,
                objectBranch,
                routedEventBranch,
                routedEventArgsBranch,
                routedEventModelBranch,
                routedEventRegistrationBranch,
                viewBranch,
                visualBranch
            ]);
        })();
        
        // bindings
        var _bindings = (function() {
            
            var itemsControl = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wipeout.bindings.itemsControl"));
            var render = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render", currentApi.forClass("wipeout.bindings.render"));
            var wipeout_type = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type", currentApi.forClass("wipeout.bindings.wipeout-type"));
            var _wo = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo", currentApi.forClass("wipeout.bindings.wo"));
            var _wipeout = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout", currentApi.forClass("wipeout.bindings.wipeout"));
            var _icRender = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render", currentApi.forClass("wipeout.bindings.ic-render"));
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings", [
                _icRender,
                itemsControl,
                render,
                wipeout_type,
                _wo,
                _wipeout
            ]);
        })();
                                     
        //wipeout
        var _wipeout = (function() {
            
            var _base = (function() {
                var objectBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("object", currentApi.forClass("wo.object"));
                var routedEventModelBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventModel", currentApi.forClass("wo.routedEventModel"));
                var visualBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("visual", currentApi.forClass("wo.visual"));
                var viewBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("view", currentApi.forClass("wo.view"));
                var contentControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("contentControl", currentApi.forClass("wo.contentControl"));
                var ifBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("if", currentApi.forClass("wo.if"));
                var itemsControlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wo.itemsControl"));
                var eventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("event", currentApi.forClass("wo.event"));
                var routedEventBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEvent", currentApi.forClass("wo.routedEvent"));
                var routedEventArgsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventArgs", currentApi.forClass("wo.routedEventArgs"));
                var routedEventRegistrationBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("routedEventRegistration", currentApi.forClass("wo.routedEventRegistration"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("base", [
                    contentControlBranch,
                    eventBranch,
                    ifBranch,
                    itemsControlBranch,
                    objectBranch,
                    routedEventBranch,
                    routedEventArgsBranch,
                    routedEventModelBranch,
                    routedEventRegistrationBranch,
                    viewBranch,
                    visualBranch
                ]);
            })();
            
            var _bindings = (function() {
                
                var itemsControl = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("itemsControl", currentApi.forClass("wipeout.bindings.itemsControl"));
                var render = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("render", currentApi.forClass("wipeout.bindings.render"));
                var wipeout_type = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout-type", currentApi.forClass("wipeout.bindings.wipeout-type"));
                var _wo = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wo", currentApi.forClass("wipeout.bindings.wo"));
                var _wipeout = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("wipeout", currentApi.forClass("wipeout.bindings.wipeout"));
                var _icRender = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ic-render", currentApi.forClass("wipeout.bindings.ic-render"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("bindings", [
                    _icRender,
                    itemsControl,
                    render,
                    wipeout_type,
                    _wo,
                    _wipeout
                ]);
            })();
            
            var _template = (function() {
                currentApi.forClass("ko.templateEngine");
                var engine = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("engine", currentApi.forClass("wipeout.template.engine"));
                var htmlBuilder = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("htmlBuilder", currentApi.forClass("wipeout.template.htmlBuilder"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("template", [
                    engine,
                    htmlBuilder
                ]);
            })();
            
            var _utils = (function() {
                
                var htmlBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("html", currentApi.forClass("wipeout.utils.html"));
                var koVirtualElementsBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("virtualElements", currentApi.forClass("wipeout.utils.ko.virtualElements"));
                var koArrayBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("array", currentApi.forClass("wipeout.utils.ko.array"));
                var koBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("ko", currentApi.forClass("wipeout.utils.ko"), {staticProperties: {"virtualElements": koVirtualElementsBranch, "array": koArrayBranch}});
                var objBranch = new Wipeout.Docs.Models.Components.ClassTreeViewBranch("obj", currentApi.forClass("wipeout.utils.obj"));
                
                return new Wipeout.Docs.Models.Components.TreeViewBranch("utils", [
                    htmlBranch,
                    koBranch,
                    objBranch
                ]);
            })();
            
            return new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout (debug mode only)", [
                _base,
                _bindings,
                _template,
                _utils
            ]);
        })();
        
        this.menu =
            new Wipeout.Docs.Models.Components.TreeViewBranch("wipeout", [
                new Wipeout.Docs.Models.Components.TreeViewBranch("API", [
                    _wo,
                    _bindings,
                    _wipeout
                ])
        ]);        
    };
});

compiler.registerClass("Wipeout.Docs.Models.Components.Api", "wo.object", function() {    
    
    var api = function(rootNamespace) {
        this._super();
        
        this.classes = [];
    };
    
    api.prototype.getClassDescription = function(classConstructor) {
        for(var i = 0, ii = this.classes.length; i < ii; i++)            
            if(this.classes[i].classConstructor === classConstructor)
                return this.classes[i].classDescription;
    };
    
    api.prototype.forClass = function(className) {
        
        var classConstructor = get(className);
        var result = this.getClassDescription(classConstructor);
        if(result)
            return result;
        
        var desc = new Wipeout.Docs.Models.Descriptions.Class(className, this);
        this.classes.push({
            classDescription: desc,
            classConstructor: classConstructor
        });
        
        return desc;
    };
    
    return api;
});

compiler.registerClass("Wipeout.Docs.Models.Components.ClassTreeViewBranch", "Wipeout.Docs.Models.Components.PageTreeViewBranch", function() {
    var classTreeViewBranch = function(name, classDescription, customBranches) {
        this._super(name, classDescription, classTreeViewBranch.compileBranches(classDescription, customBranches));
    };
    
    classTreeViewBranch.compileBranches = function(classDescription, customBranches /*optional*/) {
        var output = [];
        
        customBranches = customBranches || {};
        customBranches.staticEvents = customBranches.staticEvents || {};
        customBranches.staticProperties = customBranches.staticProperties || {};
        customBranches.staticFunctions = customBranches.staticFunctions || {};
        customBranches.events = customBranches.events || {};
        customBranches.properties = customBranches.properties || {};
        customBranches.functions = customBranches.functions || {};
        
        output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch("constructor"));    
        
        enumerate(classDescription.staticEvents, function(event) {
            if(customBranches.staticEvents[event.eventName])
                output.push(customBranches.staticEvents[event.eventName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(event.eventName, null));            
        });
        
        enumerate(classDescription.staticProperties, function(property) {
            if(customBranches.staticProperties[property.propertyName])
                output.push(customBranches.staticProperties[property.propertyName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(property.propertyName, null));
        });
        
        enumerate(classDescription.staticFunctions, function(_function) {
            if(customBranches.staticFunctions[_function.functionName])
                output.push(customBranches.staticFunctions[_function.functionName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(_function.functionName, null));            
        });
        
        enumerate(classDescription.events, function(event) {
            if(customBranches.events[event.eventName])
                output.push(customBranches.events[event.eventName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(event.eventName, null));            
        });
        
        enumerate(classDescription.properties, function(property) {
            if(customBranches.staticProperties[property.propertyName])
                output.push(customBranches.staticProperties[property.propertyName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(property.propertyName, null));            
        });
        
        enumerate(classDescription.functions, function(_function) {
            if(customBranches.functions[_function.functionName])
                output.push(customBranches.functions[_function.functionName]);
            else
                output.push(new Wipeout.Docs.Models.Components.PageTreeViewBranch(_function.functionName, null));            
        });
        
        output.sort(function() { return arguments[0].name === "constructor" ? -1 : arguments[0].name.localeCompare(arguments[1].name); });
        return output;
    };
    
    return classTreeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Components.PageTreeViewBranch", "Wipeout.Docs.Models.Components.TreeViewBranch", function() {
    var pageTreeViewBranch = function(name, page, branches) {
        this._super(name, branches);
            
        this.page = page;
    };
    
    pageTreeViewBranch.prototype.payload = function() {
        return this.page;
    };
    
    return pageTreeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Components.TreeViewBranch", "wo.object", function() {
    var treeViewBranch = function(name, branches) {
        this._super();
            
        this.name = name;
        this.branches = branches;
    };
    
    treeViewBranch.prototype.payload = function() {
        return null;
    };
    
    return treeViewBranch;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Class", "wo.object", function() {
    var classDescription = function(classFullName, api) {
        this._super();
        
        this.className = classDescription.getClassName(classFullName);
        this.constructorFunction = get(classFullName);
        this.classFullName = classFullName;
        this.api = api;
        
        this.classConstructor = null;
        this.events = [];
        this.staticEvents = [];
        this.properties = [];
        this.staticProperties = [];
        this.functions = [];
        this.staticFunctions = [];
        
        this.rebuild();
    };
    
    classDescription.getClassName = function(classFullName) {
        classFullName = classFullName.split(".");
        return classFullName[classFullName.length - 1];
    };
    
    classDescription.prototype.rebuild = function() {
        this.classConstructor = null;
        this.events.length = 0;
        this.staticEvents.length = 0;
        this.properties.length = 0;
        this.staticProperties.length = 0;
        this.functions.length = 0;
        this.staticFunctions.length = 0;
                
        for(var i in this.constructorFunction) {
            if(this.constructorFunction.hasOwnProperty(i)) {
                if(this.constructorFunction[i] instanceof wo.event) {
                    this.staticEvents.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                } else if(this.constructorFunction[i] instanceof Function && !ko.isObservable(this.constructorFunction[i])) {
                    this.staticFunctions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction[i], i, this.classFullName));
                } else {
                    this.staticProperties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                }
            }
        }
        
        for(var i in this.constructorFunction.prototype) {
            if(this.constructorFunction.prototype.hasOwnProperty(i)) {                    
                if(this.constructorFunction.prototype[i] instanceof wo.event) { 
                    this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                } else if(this.constructorFunction.prototype[i] instanceof Function && !ko.isObservable(this.constructorFunction.prototype[i])) {
                    this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction.prototype[i], i, this.classFullName));
                } else {
                    this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                }
            }
        }
        
        if(this.constructorFunction.constructor === Function) {
            var anInstance = new this.constructorFunction();        
            for(var i in anInstance) {
                if(anInstance.hasOwnProperty(i)) {                    
                    if(anInstance[i] instanceof wo.event) { 
                        this.events.push(new Wipeout.Docs.Models.Descriptions.Event(this.constructorFunction, i, this.classFullName));
                    } else if(anInstance[i] instanceof Function && !ko.isObservable(anInstance[i])) { 
                        this.functions.push(new Wipeout.Docs.Models.Descriptions.Function(anInstance[i], i, this.classFullName));
                    } else {
                        this.properties.push(new Wipeout.Docs.Models.Descriptions.PropertyDescription(this.constructorFunction, i, this.classFullName));
                    }
                }
            }
        }
        
        if(this.constructorFunction.constructor === Function) {
            var current = this.constructorFunction;
            while((current = Object.getPrototypeOf(current.prototype).constructor) !== Object) {  
                var parentClass = this.api.getClassDescription(current);
                if(!parentClass)
                    throw "Class has not been defined yet";
                
                var copy = function(fromTo, nameProperty) {
                    enumerate(parentClass[fromTo], function(fn) { 
                        if(this[fromTo].indexOf(fn) !== -1) return;
                        
                        for(var i = 0, ii = this[fromTo].length; i < ii; i++) {                    
                            if(this[fromTo][i][nameProperty] === fn[nameProperty]) {
                                if(!this[fromTo][i].overrides)
                                    this[fromTo][i].overrides = fn;
                                
                                return;
                            }
                        }
                        
                        this[fromTo].push(fn);
                    }, this);
                };
                
                // instance items only (no statics)
                copy.call(this, "events", "eventName");
                copy.call(this, "properties", "propertyName");
                copy.call(this, "functions", "functionName");
            }
        }
        
        var pullSummaryFromOverride = function(fromTo) {
            enumerate(this[fromTo], function(item) {
                var current = item;
                while (current && current.overrides && !current.summary) {
                    if(current.overrides.summary) {
                        current.summary = current.overrides.summary + 
                            (current.overrides.summaryInherited ? "" : " (from " + current.overrides.classFullName + ")");
                        current.summaryInherited = true;
                    }
                    
                    current = current.overrides;
                }
            });
        };
        
        pullSummaryFromOverride.call(this, "staticProperties");
        pullSummaryFromOverride.call(this, "staticFunctions");
        pullSummaryFromOverride.call(this, "staticEvents");
        pullSummaryFromOverride.call(this, "events");
        pullSummaryFromOverride.call(this, "properties");
        pullSummaryFromOverride.call(this, "functions");
        
        for(var i = 0, ii = this.functions.length; i < ii; i++) {
            if(this.functions[i].functionName === "constructor") {
                this.classConstructor = this.functions.splice(i, 1)[0];
                break;
            }
        }
        
        if(i === this.functions.length)
            this.classConstructor = new Wipeout.Docs.Models.Descriptions.Function(this.constructorFunction, this.className, this.classFullName);
        
        var sort = function() { return arguments[0].name.localeCompare(arguments[1].name); };
        
        this.events.sort(sort);
        this.staticEvents.sort(sort);
        this.properties.sort(sort);
        this.staticProperties.sort(sort);
        this.functions.sort(sort);
        this.staticFunctions.sort(sort);
    };
    
    return classDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.ClassItem", "wo.object", function() {
    return function(itemName, itemSummary) {
        this._super();
        
        this.name = itemName;
        this.summary = itemSummary;
    }
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Event", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    var eventDescription = function(constructorFunction, eventName, classFullName) {
        this._super(eventName, Wipeout.Docs.Models.Descriptions.PropertyDescription.getPropertySummary(constructorFunction, eventName));
        
        this.eventName = eventName;
        this.classFullName = classFullName;
    };
    
    return eventDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.Function", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    
    var functionDescription = function(theFunction, functionName, classFullName) {
        this._super(functionName, functionDescription.getFunctionSummary(theFunction));
        
        this["function"] = theFunction;
        this.functionName = functionName;
        this.classFullName = classFullName;
        
        this.overrides = null;
    };
        
    functionDescription.getFunctionSummary = function(theFunction) {
        var functionString = theFunction.toString();
        
        var isInlineComment = false;
        var isBlockComment = false;
        
        var removeFunctionDefinition = function() {
            var firstInline = functionString.indexOf("//");
            var firstBlock = functionString.indexOf("/*");
            var openFunction = functionString.indexOf("{");
            
            if(firstInline === -1) firstInline = Number.MAX_VALUE;
            if(firstBlock === -1) firstBlock = Number.MAX_VALUE;
                    
            if(openFunction < firstInline && openFunction < firstBlock) {
                functionString = functionString.substr(openFunction + 1).replace(/^\s+|\s+$/g, '');
            } else { 
                if(firstInline < firstBlock) {
                    functionString = functionString.substr(functionString.indexOf("\n")).replace(/^\s+|\s+$/g, '');
                } else {
                    functionString = functionString.substr(functionString.indexOf("*/")).replace(/^\s+|\s+$/g, '');
                }
                
                removeFunctionDefinition();
            }
        };
        
        removeFunctionDefinition();
        
        if (functionString.indexOf("///<summary>") === 0) {
            return functionString.substring(12, functionString.indexOf("</summary>"));
        }
        
        return "";   
    };  
    
    return functionDescription;
});

compiler.registerClass("Wipeout.Docs.Models.Descriptions.PropertyDescription", "Wipeout.Docs.Models.Descriptions.ClassItem", function() {
    var property = function(constructorFunction, propertyName, classFullName) {
        this._super(propertyName, property.getPropertySummary(constructorFunction, propertyName, classFullName));
        
        this.propertyName = propertyName;
        this.classFullName = classFullName;
    };
    
    var inlineCommentOnly = /^\/\//;
    property.getPropertySummary = function(constructorFunction, propertyName, classFullName) {
        var result;
        if(result = property.getPropertyDescriptionOverride(classFullName + "." + propertyName))
            return result.description;
        
        constructorFunction = constructorFunction.toString();
                
        var search = function(regex) {
            var i = constructorFunction.search(regex);
            if(i !== -1) {
                var func = constructorFunction.substring(0, i);
                var lastLine = func.lastIndexOf("\n");
                if(lastLine > 0) {
                    func = func.substring(lastLine);
                } 
                
                func = func.replace(/^\s+|\s+$/g, '');
                if(inlineCommentOnly.test(func))
                    return func.substring(2);
                else
                    return null;
            }
        }
        
        result = search(new RegExp("\\s*this\\s*\\.\\s*" + propertyName + "\\s*="));
        if(result)
            return result;
                
        return search(new RegExp("\\s*this\\s*\\[\\s*\"" + propertyName + "\"\\s*\\]\\s*="));        
    };
    
    property.getPropertyDescriptionOverride = function(classDelimitedPropertyName) {
        
        var current = property.descriptionOverrides;
        enumerate(classDelimitedPropertyName.split("."), function(item) {
            if(!current) return;
            current = current[item];
        });
        
        return current;
    };
        
    property.descriptionOverrides = {
        wo: {
            'if': {
                woInvisibleDefault: { 
                    description: "The default value for woInvisible for the wo.if class."
                }
            },
            html: {
                specialTags: { 
                    description: "A list of html tags which cannot be placed inside a div element."
                }
            },
            ko: {
                array: { 
                    description: "Utils for operating on observableArrays"
                },
                virtualElements: { 
                    description: "Utils for operating on knockout virtual elements"
                }
            },
            object: {
                useVirtualCache: { 
                    description: "When _super methods are called, the result of the lookup is cached for next time. Set this to false and call clearVirtualCache() to disable this feature."
                }
            },
            view: {
                //TODO: give this a page
                objectParser: { 
                    description: "Used to parse string values into a given type"
                },
                //TODO: give this a page
                reservedPropertyNames: { 
                    description: "Properties which cannot be set on a wipeout object via the template"
                }
            },
            visual: {
                reservedTags: { 
                    description: "A list of names which cannot be used as wipeout object names. These are mostly html tag names"
                },
                woInvisibleDefault: { 
                    description: "The default value for woInvisible for the wo.visual class."
                }
            }
        },
        wipeout: {
            template: {
                engine: {
                    closeCodeTag: { 
                        description: "Signifies the end of a wipeout code block: \"" + wipeout.template.engine.closeCodeTag + "\"."
                    },
                    instance: { 
                        description: "An instance of a wipeout.template.engine which is used by the render binding."
                    },
                    openCodeTag: { 
                        description: "Signifies the beginning of a wipeout code block: \"" + wipeout.template.engine.openCodeTag + "\"."
                    },
                    scriptCache: { 
                        description: "A placeholder for precompiled scripts."
                    },
                    scriptHasBeenReWritten: { 
                        description: "TODO"
                    }
                }
            }
        }
    };
    
    return property;
});

compiler.registerClass("Wipeout.Docs.Models.Pages.DisplayItem", "wo.object", function() {
    return function(name) {
        this._super();
        
        this.title = name;
    };
});

compiler.registerClass("Wipeout.Docs.Models.Pages.LandingPage", "Wipeout.Docs.Models.Pages.DisplayItem", function() {
    return function(title) {
       this._super(title); 
    }
});


compiler.registerClass("Wipeout.Docs.ViewModels.Application", "wo.view", function() {
    
    function application() {
        this._super("Wipeout.Docs.ViewModels.Application");
        
        this.registerRoutedEvent(Wipeout.Docs.ViewModels.Components.TreeViewBranch.renderPage, function (args) {
            this.model().content(args.data);
        }, this);
    };
    
    application.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        
        //TODO: this
        this.templateItems.treeView.select();
    };
    
    return application;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.CodeBlock", "wo.view", function() {
    var codeBlock = function(templateId) {
        this._super(templateId || "Wipeout.Docs.ViewModels.Components.CodeBlock");        
        this.code = ko.observable();
        
        this.code.subscribe(this.onCodeChanged, this);
    };
    
    codeBlock.prototype.onCodeChanged = function(newVal) {
    };
    
    codeBlock.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        prettyPrint(null, this.templateItems.codeBlock);
    };
    
    return codeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.DynamicRender", "wo.contentControl", function() {
    var dynamicRender = function() {
        this._super();
        
        this.content = ko.observable();
        
        this.template("<!-- ko render: content --><!-- /ko -->");
    };
    
    dynamicRender.prototype.onModelChanged = function(oldVal, newVal) {
        this._super(oldVal, newVal);
               
        var oldVal = this.content();
        
        if(newVal == null) {
            this.content(null);
        } else {
            var newVm = null;
            if(newVal instanceof Wipeout.Docs.Models.Pages.LandingPage) {
                newVm = new Wipeout.Docs.ViewModels.Pages.LandingPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Class) {
                newVm = new Wipeout.Docs.ViewModels.Pages.ClassPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Event) {
                newVm = new Wipeout.Docs.ViewModels.Pages.EventPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Property) {
                newVm = new Wipeout.Docs.ViewModels.Pages.PropertyPage();
            } else if(newVal instanceof Wipeout.Docs.Models.Descriptions.Function) {
                newVm = new Wipeout.Docs.ViewModels.Pages.FunctionPage();
            } else {
                throw "Unknown model type";
            }
            
            newVm.model(newVal);
            this.content(newVm);
        }
    };  
    
    return dynamicRender
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.JsCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function () {
    var jsCodeBlock = function() {
        this._super.apply(this, arguments);
    };
    
    jsCodeBlock.prototype.onCodeChanged = function(newVal) {  
        new Function(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"))();
    };

    return jsCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.TemplateCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function() {
    var templateCodeBlock = function() {
        templateCodeBlock.staticConstructor();
        this._super.apply(this, arguments);
    };
    
    var templateDiv;
    templateCodeBlock.staticConstructor = function() {
        if(templateDiv) return;
        
        templateDiv = document.createElement("div");
        templateDiv.setAttribute("style", "display: none");
        document.getElementsByTagName("body")[0].appendChild(templateDiv);
    };
    
    templateCodeBlock.prototype.onCodeChanged = function(newVal) {  
        templateDiv.innerHTML += newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&gt;/g, ">");
    };
    
    return templateCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Components.TreeViewBranch", "wo.view", function() {
    var treeViewBranch = function() {
        this._super(treeViewBranch.nullTemplate);  
    };
    
    treeViewBranch.branchTemplate = "Wipeout.Docs.ViewModels.Components.TreeViewBranch_branch";
    treeViewBranch.leafTemplate = "Wipeout.Docs.ViewModels.Components.TreeViewBranch_leaf";
    treeViewBranch.nullTemplate = wo.visual.getBlankTemplateId();
    
    treeViewBranch.prototype.onModelChanged = function(oldVal, newVal) {  
        this._super(oldVal, newVal);
        if(newVal && (newVal.branches || newVal.payload())) {
            this.templateId(treeViewBranch.branchTemplate);
        } else if(newVal) {
            this.templateId(treeViewBranch.leafTemplate);
        } else {
            this.templateId(treeViewBranch.nullTemplate);
        }
    };
    
    treeViewBranch.prototype.select = function() {
        if(this.model().branches)
            $(this.templateItems.content).toggle();
        
        var payload = this.model().payload();
        if ($(this.templateItems.content).filter(":visible").length && payload) {
            this.triggerRoutedEvent(treeViewBranch.renderPage, payload);
        }
    };
    
    treeViewBranch.renderPage = new wo.routedEvent(); 
    
    return treeViewBranch;
});


compiler.registerClass("Wipeout.Docs.ViewModels.Components.UsageCodeBlock", "Wipeout.Docs.ViewModels.Components.CodeBlock", function() {
    var usageCodeBlock = function() {
        this._super("Wipeout.Docs.ViewModels.Components.UsageCodeBlock");
        
        this.usage = ko.observable();
    };
    
    usageCodeBlock.prototype.onCodeChanged = function(newVal) {  
        this.usage(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"));
    };
    
    return usageCodeBlock;
});

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.ClassItemTable", "wo.itemsControl", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.ClassItemTable", "Wipeout.Docs.ViewModels.Pages.ClassItemRow");
    };
});


    compiler.registerClass("Wipeout.Docs.ViewModels.Pages.ClassPage", "wo.view", function() {
        var classPage = function() {
            this._super("Wipeout.Docs.ViewModels.Pages.ClassPage");

            this.usagesTemplateId = ko.computed(function() {
                if(this.model()) {
                    var className = this.model().classFullName + classPage.classUsagesTemplateSuffix;
                    if(document.getElementById(className))
                        return className;
                }

                return wo.contentControl.getBlankTemplateId();
            }, this);
        };

        classPage.classUsagesTemplateSuffix = "_ClassUsages";
        
        return classPage;
    });

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.FunctionPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.FunctionPage");
    };
});


compiler.registerClass("Wipeout.Docs.ViewModels.Pages.LandingPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.LandingPage");
    };
});

compiler.registerClass("Wipeout.Docs.ViewModels.Pages.PropertyPage", "wo.view", function() {
    return function() {
        this._super("Wipeout.Docs.ViewModels.Pages.PropertyPage");
    };
});

compiler.compile(window.Wipeout);


//window.Wipeout = Wipeout;



})();

compiler.registerClass("wipeoutDocs.models.components.treeViewBranch", "orienteer", function() {
    var treeViewBranch = function(name, href, branches) {
        this._super();
            
        this.name = name;
        this.href = href;
        this.branches = branches;
    };
    
    return treeViewBranch;
});
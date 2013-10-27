
(function () {
    
    rootView = wpfko.base.view.extend(function() {
        this._super("rootView");
        
        this.justDone = ko.observable("");
    });
    
    rootView.prototype.next = function() {
        this.current = this.current || 0;
        
        if(actions.length - 1 < this.current) {
            this.justDone("FINISHED");
            return;
        }
        
        this.justDone(actions[this.current++](this.model()));
    };
        
    model = {
        rootTitle: ko.observable("People"),
        items: ko.observableArray([{itemId: ko.observable(22), itemName: ko.observable("John")}, {itemId: ko.observable(25), itemName: ko.observable("Barry")}]),
        deepItem: ko.observable({
            item: ko.observable({
                value: ko.observable("the value")
            })
        })
    };
    
    model.totalOfIds = ko.computed(function() { 
        var allIds = model.items();
        var total = 0;
        for(var i = 0, ii = allIds.length; i < ii; i++) {
            total += ko.utils.unwrapObservable(allIds[i].itemId);
        }
        
        return total;
    });
    
    ko.applyBindings(model);
})();

var actions = [
    function(model) {
        model.rootTitle("Persons");
        return "Changed title";
    }, function(model) {
        model.items.push({itemId: ko.observable(66), itemName: ko.observable("Paddy")});
        return "Added person";
    }, function(model) {
        model.items.splice(1, 1);
        return "Removed person";
    }, function(model) {
        model.items()[0].itemId(55);
        return "Changed first person id, total ids should also be updated";
    }, function(model) {
        model.items()[0] = {itemId: ko.observable(99), itemName: ko.observable("LJBLKJB")};
        model.items.valueHasMutated();
        return "Changed first person.";
    }, function(model) {
        model.items()[0].itemId(55);
        return "Changed first person id, total ids should also be updated";
    }, function(model) {
        model.items()[0] = {itemId: 99, itemName: "someone else"};
        model.items.valueHasMutated();
        return "Changed first person, destroyed observables";
    }, function(model) {
        model.deepItem().item().value("value 1");
        return "Changed value 1";
    }, function(model) {
        model.deepItem().item({ value: "value 2" });
        return "Changed value 2";
    }, function(model) {
        model.deepItem({item: ko.observable({ value: ko.observable("value 3") })});
        return "Changed value 3";
    }, function(model) {
        model.deepItem().item().value("value 4");
        return "Changed value 4";
    }
];
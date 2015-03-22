
module("integration: wipeout.viewModels.itemsControl", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("removeItem routed event", function() {
    
    // arrange    
    var item = {};
    application.items = new obsjs.array([{}, item]);
    application.template = '<wo.items-control id="cc" items--tw="$parent.items"></wo.items-control>';
    
    // act
	application.onRendered = function () {		
		var d = application.items.observe(function () {
    		strictEqual(application.items.indexOf(item), -1);
			d.dispose();
			start();
		});
		
    	application.templateItems.cc.triggerRoutedEvent(wo.itemsControl.removeItem, item);
	};
    
    // assert
	stop();
});

test("getViewModel/getViewModels", function() {
    
    // arrange    
    var item = {};
    application.items = [{}, {}, {}];
    application.template = '<wo.items-control id="cc" items="$parent.items"></wo.items-control>';
    
    // act
	application.onRendered = function () {
		
		var item = application.templateItems.cc.getItemViewModel(1);
		var items = application.templateItems.cc.getItemViewModels();
		
		strictEqual(item.model, application.items[1]);
		for (var i = 0, ii = application.items.length; i < ii; i++)
			strictEqual(application.items[i], items[i].model);
		
		start();
	};
    
    // assert
	stop();
});

test("basic items control. initial, add, remove, re-arrange", function() {
    // arrange
    var id1 = "JBKJBLKJBKJLBLKJB";
    var id2 = "oidshfp9usodnf";
    var item1 = "item1", item2 = "item2", item3 = "item3";
    application.model.items = new obsjs.array([item1, item2, item3]);
    
    var bound = {};
    var assert = function() {
        var reBound = {};
        var $items = $("." + id2);
        strictEqual($items.length, arguments.length, "html length");
        strictEqual(application.templateItems[id1].items.length, arguments.length, "items length");
        for(var i = 0, ii = arguments.length; i < ii; i++) {            
            strictEqual($items[i].innerHTML, arguments[i], "html value");           
            strictEqual(application.templateItems[id1].getItemViewModel(i).model, arguments[i], "item model value");
            reBound[arguments[i]] = $items[i];
            
            if(bound[arguments[i]])
                strictEqual(bound[arguments[i]], $items[i], "template was not re-drawn");
            else
                bound[arguments[i]] = $items[i];
        }
        
        for(var i in bound) {
            if(!reBound[i]) {
                ok(!bound[i].parentElement, "deleted item was removed");
                delete bound[i];
            }
        }
    }
    
    // act
    application.template =
"<wo.items-control items='$this.model.items' id='" + id1 + "'>\
    <item-template>\
        <div class='" + id2 + "' wo-content='$this.model'></div>\
    </item-template>\
</wo.items-control>";
	
	application.onRendered = function () {
		// assert
		assert(item1, item2, item3);

		// re-act
		var item4  = "item4";
		var destroy = application.templateItems[id1].items.observe(function () {
			
			destroy.dispose();
					
			// re-assert
			ok(true, "added item");
			assert(item1, item2, item3, item4);
			
			// re-act
			destroy = application.templateItems[id1].items.observe(function () {
				destroy.dispose();

				// re-assert
				ok(true, "removed item");
				assert(item1, item3, item4);
				
				
				// re-act
				destroy = application.templateItems[id1].items.observe(function () {
					destroy.dispose();
					
					ok(true, "reversed items");
					assert(item4, item3, item1);
									
					start();
				});
				application.model.items.reverse();
			});
			application.model.items.splice(1, 1);
		});
		
		application.model.items.push(item4);
	};
	
	stop();
});

test("advanced items control, creating/destroying", function() {
	
    // arrange
    var itemTemplateId = wo.contentControl.createAnonymousTemplate('<div wo-attr-id="$this.model"></div>');
    
    var itemsControl1 = new wo.itemsControl();
    itemsControl1.itemTemplateId = itemTemplateId;
    itemsControl1.items = ["a", "b", "c"];
    
    var itemsControl2 = new wo.itemsControl();
    itemsControl2.itemTemplateId = itemTemplateId;
    itemsControl2.items = ["d", "e", "f"];
    
    application.template = '{{$this.content}}';
    
    // act
    // assert
	var d = application.observe("content", function () {
		d.dispose();
		setTimeout(function () {
			strictEqual($("#a").length, 1);
			strictEqual($("#b").length, 1);
			strictEqual($("#c").length, 1);
			
			application.observe("content", function () {
				setTimeout(function () {
					strictEqual($("#a").length, 0);
					strictEqual($("#b").length, 0);
					strictEqual($("#c").length, 0);
					strictEqual($("#d").length, 1);
					strictEqual($("#e").length, 1);
					strictEqual($("#f").length, 1);

					start();
				}, 50);
			});
			
			application.content = itemsControl2;
		}, 50);
	});
	
    application.content = itemsControl1;
	
	stop();
});

test("items control, $index", function() {
	
    // arrange
    var itemTemplateId = wo.contentControl.createAnonymousTemplate('<div wo-attr-id="$this.model" wo-attr-data-index="$index.value"></div><wo.view id="item" index="$parentContext.$index.value" />');
    
    var itemsControl = new wo.itemsControl();
    itemsControl.itemTemplateId = itemTemplateId;
    itemsControl.items = ["a", "b", "c"];
    application.content = itemsControl;
    
    application.template = '{{$this.content}}';
    
    // act
    // assert
	application.onRendered = function () {
		strictEqual($("#a").attr("data-index"), "0");
		strictEqual(itemsControl.getItemViewModel(0).templateItems.item.index, 0);
		strictEqual($("#b").attr("data-index"), "1");
		strictEqual(itemsControl.getItemViewModel(1).templateItems.item.index, 1);
		strictEqual($("#c").attr("data-index"), "2");
		strictEqual(itemsControl.getItemViewModel(2).templateItems.item.index, 2);
		
		start();
	};
	
	stop();
});
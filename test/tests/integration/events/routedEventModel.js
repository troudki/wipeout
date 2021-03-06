
module("integration: wipeout.events.routedEventModel", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("routed event, from model", function() {
    // arrange
    var eventArgs = {}, triggered1 = false, triggered2 = false;
    var aRoutedEvent = {};
    application.model = {child:{child:{child:new wipeout.events.routedEventModel()}}};
    var open1 = "<wo.content name='", open2 = "' id='item' model='$this.model.child'><set-template>", close = "</set-template></wo.content>";
    application.setTemplate = open1 + "1" + open2 + open1 + "2" + open2 + open1 + "3" + open2 + "<div>hi</div>" + close + close + close;
	
	application.onRendered = function () {

		// arrange
		var secondDeepest = application.templateItems.item.templateItems.item;
		var deepest = secondDeepest.templateItems.item;

		ok(deepest);
		strictEqual(deepest.model.constructor, wipeout.events.routedEventModel);

		deepest.registerRoutedEvent(aRoutedEvent, function() {
			triggered1 = true;
		});

		secondDeepest.registerRoutedEvent(aRoutedEvent, function() {
			triggered2 = true;
		});
			
		// act
		deepest.observe("model", function () {
			setTimeout(function () {
				deepest.model.triggerRoutedEvent(aRoutedEvent, eventArgs);

				// assert
				ok(triggered2);
				ok(triggered1);

				start();
			});
		}, {activateImmediately: true});
	};
	
	stop();
});

test("routed event, to model", function() {
    // arrange
    var model = new wipeout.events.routedEventModel();
    var aRoutedEvent = {};
    var open = "<wo.content id='item'><set-template>", close = "</set-template></wo.content>";
    application.setTemplate = open + open + open + "<div>hi</div>" + close + close + close;
	
	application.onRendered = function () {
	
		application.registerRoutedEvent(aRoutedEvent, function() { this.__caught = true; }, application);
		model.registerRoutedEvent(aRoutedEvent, function() { this.__caught = true; }, model);
		application.templateItems.item.model = model;

		// act
		application.templateItems.item.templateItems.item.templateItems.item.triggerRoutedEvent(aRoutedEvent, {});

		// assert
		ok(application.__caught);
		ok(model.__caught);
		
		start();
	};
	
	stop();
});

module("wipeout.htmlBindingTypes.ow, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding, nb", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		setter = new wipeout.template.initialization.propertySetter(new wipeout.wml.wmlAttribute("true", null)),
		name = "KJBKJBKJB",
		renderContext = new wipeout.template.context(new obsjs.observable()).childContext(viewModel);
	
	// act
	wipeout.htmlBindingTypes.ow(viewModel, setter, name, renderContext);
	
	// assert
	strictEqual(viewModel[name], true);
	viewModel.observe(name, function () {
		ok(false, "nothing should trigger change after initial set");
	});
});
	
test("binding, bindOneWay", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		setter = new wipeout.template.initialization.propertySetter(new wipeout.wml.wmlAttribute("$parent.val", null)),
		name = "KJBKJBKJB",
		renderContext = new wipeout.template.context(new obsjs.observable()).childContext(viewModel);
	
	var val1 = renderContext.$parent.val = {}, val2 = {};
	
	// act
	var disp = wipeout.htmlBindingTypes.ow(viewModel, setter, name, renderContext);
	
	// assert
	strictEqual(viewModel[name], val1);
	
	
	viewModel.observe(name, function () {
		strictEqual(viewModel[name], val2);
		start();
		
		disp.dispose();
		renderContext.$parent.val = {};
	});
	
	// re-act 
	renderContext.$parent.val = val2;
	stop();
});
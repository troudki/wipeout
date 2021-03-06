module("integration: wipeout.template.initialization.htmlAttributes.wo-style", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("smoke test", function() {
	// arrange
	application.val = "none";
	
	// act
	application.setTemplate = '<input id="element" wo-style-display="$this.val" />';
	
	// assert
	application.onRendered = function () {
		strictEqual(application.templateItems.element.style.display, application.val);
		start();
	};
	
	stop();
});

test("class, add remove test", function() {
	clearIntegrationStuff();
	
	$("#qunit-fixture").html("<input type='text' id='hello' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: "none"});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-style-display", "$this.theVal", null, "wo-style");

	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model));

	// assert
	strictEqual(input.style.display, model.theVal);
	var d2 = busybody.observe(model, "theVal", function () {
		d2.dispose();

		setTimeout(function () {
			strictEqual(input.style.display, model.theVal);
			d2 = busybody.observe(model, "theVal", function () {
				d2.dispose();

				setTimeout(function () {
					strictEqual(input.style.display, model.theVal);
					enumerateArr(disp, function (d) { d.dispose(); });
					d2 = busybody.observe(model, "theVal", function () {
						d2.dispose();
						setTimeout(function () {
							strictEqual(input.style.display, "none");
							start();
						});
					});
					model.theVal = "inline";
				});
			});

			model.theVal = "none";
		});
	});

	model.theVal = "inline";
	stop();
});
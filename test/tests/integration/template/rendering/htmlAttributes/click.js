module("wipeout.template.initialization.htmlAttributes.wo-click, integration", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("standard call", function() {
	// arrange
	$("#qunit-fixture").html("<button id='hello'></button>")
	var button = document.getElementById("hello"), called = false;
	var disp = wipeout.template.rendering.htmlAttributes["wo-click"]("$this.method", button, new wipeout.template.context({
		method: function (e, el) {
			strictEqual(button, el);
			ok(e);
			ok(!called);
			called = true;
		}
	}));
	
	// act
	button.click();
	disp();
	button.click();
	
	// assert
	ok(called);
});

test("standard call", function() {
	// arrange
	$("#qunit-fixture").html("<button id='hello'></button>")
	var button = document.getElementById("hello"), called = false;
	var disp = wipeout.template.rendering.htmlAttributes["wo-click"]("$this.method(e, element, 333)", button, new wipeout.template.context({
		method: function (e, el, number) {
			strictEqual(button, el);
			strictEqual(number, 333);
			ok(e);
			ok(!called);
			called = true;
		}
	}));
	
	// act
	button.click();
	disp();
	button.click();
	
	// assert
	ok(called);
});
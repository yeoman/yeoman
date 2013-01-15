describe("Events", function(){
  var EventTest;
  var spy;

  beforeEach(function(){
    EventTest = Spine.Class.create();
    EventTest.extend(Spine.Events);

    var noop = {spy: function(){}};
    spyOn(noop, "spy");
    spy = noop.spy;
  });

  it("can bind/trigger events", function(){
    EventTest.bind("daddyo", spy);
    EventTest.trigger("daddyo");
    expect(spy).toHaveBeenCalled();
  });

  it("should trigger correct events", function(){
    EventTest.bind("daddyo", spy);
    EventTest.trigger("motherio");
    expect(spy).not.toHaveBeenCalled();
  });

  it("can bind/trigger multiple events", function(){
    EventTest.bind("house car windows", spy);
    EventTest.trigger("car");
    expect(spy).toHaveBeenCalled();
  });

  it("can pass data to triggered events", function(){
    EventTest.bind("yoyo", spy);
    EventTest.trigger("yoyo", 5, 10);
    expect(spy).toHaveBeenCalledWith(5, 10);
  });

  it("can unbind events", function(){
    EventTest.bind("daddyo", spy);
    EventTest.unbind("daddyo");
    EventTest.trigger("daddyo");
    expect(spy).not.toHaveBeenCalled();
  });

  it("can bind to a single event", function(){
    EventTest.one("indahouse", spy);
    EventTest.trigger("indahouse");
    expect(spy).toHaveBeenCalled();

    spy.reset();
    EventTest.trigger("indahouse");
    expect(spy).not.toHaveBeenCalled();
  });

  it("should allow a callback unbind itself", function(){
    var a = jasmine.createSpy("a");
    var b = jasmine.createSpy("b");
    var c = jasmine.createSpy("c");

    b.andCallFake(function () {
        EventTest.unbind("once", b);
    });

    EventTest.bind("once", a);
    EventTest.bind("once", b);
    EventTest.bind("once", c);
    EventTest.trigger("once");

    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
    expect(c).toHaveBeenCalled();

    EventTest.trigger("once");

    expect(a.callCount).toBe(2);
    expect(b.callCount).toBe(1);
    expect(c.callCount).toBe(2);
  });

  it("can cancel propogation", function(){
    EventTest.bind("motherio", function(){ return false; });
    EventTest.bind("motherio", spy);

    EventTest.trigger("motherio");
    expect(spy).not.toHaveBeenCalled();
  });

  it("should clear events on inherited objects", function(){
    EventTest.bind("yoyo", spy);
    var Sub = EventTest.sub();
    Sub.trigger("yoyo");
    expect(spy).not.toHaveBeenCalled();
  });
});

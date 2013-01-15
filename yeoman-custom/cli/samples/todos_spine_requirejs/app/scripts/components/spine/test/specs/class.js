describe("Class", function(){
  var User;

  beforeEach(function(){
    User = Spine.Class.create();
  });

  it("is sane", function(){
    expect(Spine).toBeTruthy();
  });

  it("can create subclasses", function(){
    User.extend({classProperty: true});

    var Friend = User.create();
    expect(Friend).toBeTruthy();
    expect(Friend.classProperty).toBeTruthy();
  });

  it("can create instance", function(){
    User.include({instanceProperty: true});

    var Bob = new User();
    expect(Bob).toBeTruthy();
    expect(Bob.instanceProperty).toBeTruthy();
  });

  it("can be extendable", function(){
    User.extend({classProperty: true});

    expect(User.classProperty).toBeTruthy();
  });

  it("can be includable", function(){
    User.include({instanceProperty: true});

    expect(User.prototype.instanceProperty).toBeTruthy();
    expect((new User()).instanceProperty).toBeTruthy();
  });

  it("should trigger module callbacks", function(){
    var module = {
      included: function(){},
      extended: function(){}
    };

    spyOn(module, "included");
    User.include(module);
    expect(module.included).toHaveBeenCalled();

    spyOn(module, "extended");
    User.extend(module);
    expect(module.extended).toHaveBeenCalled();
  });

  it("include/extend should raise without arguments", function(){
    expect(function(){ User.include(); }).toThrow();
    expect(function(){ User.extend(); }).toThrow();
  });

  it("can proxy functions in class/instance context", function(){
    var func = function(){
      return this;
    };

    expect(User.proxy(func)()).toBe(User);

    var user = new User();
    expect(user.proxy(func)()).toBe(user);
  });
});

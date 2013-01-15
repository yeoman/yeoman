describe("Model.Local", function(){
  var User;

  beforeEach(function(){
    User = Spine.Model.setup("User", ["name"]);
  });

  it("should persist attributes", function(){
    User.extend(Spine.Model.Local);
    User.create({name: "Bob"});
    User.fetch();

    expect(User.first()).toBeTruthy();
    expect(User.first().name).toEqual("Bob");
  });

  it("should work with cIDs", function(){
    User.refresh([
      {name: "Bob", id: "c-1"},
      {name: "Bob", id: "c-3"},
      {name: "Bob", id: "c-2"}
    ]);
    expect(User.idCounter).toEqual(3);
  });

  it("should work with a blank refresh", function(){
    User.refresh([]);
    expect(User.idCounter).toEqual(0);
  });
});
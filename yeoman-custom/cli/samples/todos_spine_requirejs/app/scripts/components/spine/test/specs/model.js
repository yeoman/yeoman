describe("Model", function(){
  var Asset;

  beforeEach(function(){
    Asset = Spine.Model.setup("Asset", ["name"]);
  });

  it("can create records", function(){
    var asset = Asset.create({name: "test.pdf"});
    expect(Asset.first()).toEqual(asset);
  });

  it("can update records", function(){
    var asset = Asset.create({name: "test.pdf"});

    expect(Asset.first().name).toEqual("test.pdf");

    asset.name = "wem.pdf";
    asset.save();

    expect(Asset.first().name).toEqual("wem.pdf");
  });

  it("can destroy records", function(){
    var asset = Asset.create({name: "test.pdf"});

    expect(Asset.first()).toEqual(asset);
    asset.destroy();
    expect(Asset.first()).toBeFalsy();
  });

  it("can find records", function(){
    var asset = Asset.create({name: "test.pdf"});
    expect(Asset.find(asset.id)).toBeTruthy();

    asset.destroy();
    expect(function(){
      Asset.find(asset.id);
    }).toThrow();
  });

  it("can check existence", function(){
    var asset = Asset.create({name: "test.pdf"});

    expect(asset.exists()).toBeTruthy();
    expect(Asset.exists(asset.id)).toBeTruthy();

    asset.destroy();

    expect(asset.exists()).toBeFalsy();
    expect(Asset.exists(asset.id)).toBeFalsy();
  });

  it("can reload", function(){
    var asset = Asset.create({name: "test.pdf"}).dup(false);

    Asset.find(asset.id).updateAttributes({name: "foo.pdf"});

    expect(asset.name).toEqual("test.pdf");
    var original = asset.reload();
    expect(asset.name).toEqual("foo.pdf");

    // Reload should return a clone, more useful that way
    expect(original.__proto__.__proto__).toEqual(Asset.prototype)
  });

  it("can select records", function(){
    var asset1 = Asset.create({name: "test.pdf"});
    var asset2 = Asset.create({name: "foo.pdf"});

    var selected = Asset.select(function(rec){ return rec.name == "foo.pdf" });

    expect(selected).toEqual([asset2]);
  });

  it("can return all records", function(){
    var asset1 = Asset.create({name: "test.pdf"});
    var asset2 = Asset.create({name: "foo.pdf"});

    expect(Asset.all()).toEqual([asset1, asset2]);
  });

  it("can find records by attribute", function(){
    var asset = Asset.create({name: "foo.pdf"});
    Asset.create({name: "test.pdf"});

    var findOne = Asset.findByAttribute("name", "foo.pdf");
    expect(findOne).toEqual(asset);

    var findAll = Asset.findAllByAttribute("name", "foo.pdf");
    expect(findAll).toEqual([asset]);
  });

  it("can find first/last record", function(){
    var first = Asset.create({name: "foo.pdf"});
    Asset.create({name: "test.pdf"});
    var last = Asset.create({name: "wem.pdf"});

    expect(Asset.first()).toEqual(first);
    expect(Asset.last()).toEqual(last);
  });

  it("can destroy all records", function(){
    Asset.create({name: "foo.pdf"});
    Asset.create({name: "foo.pdf"});

    expect(Asset.count()).toEqual(2);
    Asset.destroyAll();
    expect(Asset.count()).toEqual(0);
  });

  it("can delete all records", function(){
    Asset.create({name: "foo.pdf"});
    Asset.create({name: "foo.pdf"});

    expect(Asset.count()).toEqual(2);
    Asset.deleteAll();
    expect(Asset.count()).toEqual(0);
  });

  it("can be serialized into JSON", function(){
    var asset = new Asset({name: "Johnson me!"});

    expect(JSON.stringify(asset)).toEqual('{"name":"Johnson me!"}');
  });

  it("can be deserialized from JSON", function(){
    var asset = Asset.fromJSON('{"name":"Un-Johnson me!"}')
    expect(asset.name).toEqual("Un-Johnson me!");

    var assets = Asset.fromJSON('[{"name":"Un-Johnson me!"}]')
    expect(assets[0] && assets[0].name).toEqual("Un-Johnson me!");
  });

  it("can be instantiated from a form", function(){
    var form = $('<form />');
    form.append('<input name="name" value="bar" />');
    var asset = Asset.fromForm(form);
    expect(asset.name).toEqual("bar");
  });

  it("can validate", function(){
    Asset.include({
      validate: function(){
        if ( !this.name )
          return "Name required";
      }
    });

    expect(Asset.create({name: ""})).toBeFalsy();
    expect(new Asset({name: ""}).isValid()).toBeFalsy();

    expect(Asset.create({name: "Yo big dog"})).toBeTruthy();
    expect(new Asset({name: "Yo big dog"}).isValid()).toBeTruthy();
  });

  it("validation can be disabled", function(){
    Asset.include({
      validate: function(){
        if ( !this.name )
          return "Name required";
      }
    });

    var asset = new Asset;
    expect(asset.save()).toBeFalsy();
    expect(asset.save({validate: false})).toBeTruthy();
  });

  it("has attribute hash", function(){
    var asset = new Asset({name: "wazzzup!"});
    expect(asset.attributes()).toEqual({name: "wazzzup!"});
  });

  it("attributes() should not return undefined atts", function(){
    var asset = new Asset();
    expect(asset.attributes()).toEqual({});
  });

  it("can load attributes()", function(){
    var asset = new Asset();
    var result = asset.load({name: "In da' house"});
    expect(result).toBe(asset);
    expect(asset.name).toEqual("In da' house");
  });

  it("can load() attributes respecting getters/setters", function(){
    Asset.include({
      name: function(value){
        var ref = value.split(' ', 2);
        this.first_name = ref[0];
        this.last_name  = ref[1];
      }
    })

    var asset = new Asset();
    asset.load({name: "Alex MacCaw"});
    expect(asset.first_name).toEqual("Alex");
    expect(asset.last_name).toEqual("MacCaw");
  });

  it("attributes() respecting getters/setters", function(){
    Asset.include({
      name: function(){
        return "Bob";
      }
    })

    var asset = new Asset();
    expect(asset.attributes()).toEqual({name: "Bob"});
  });

  it("can generate ID", function(){
    var asset = Asset.create({name: "who's in the house?"});
    expect(asset.id).toBeTruthy();
  });

  it("can be duplicated", function(){
    var asset = Asset.create({name: "who's your daddy?"});
    expect(asset.dup().__proto__).toBe(Asset.prototype);

    expect(asset.name).toEqual("who's your daddy?");
    asset.name = "I am your father";
    expect(asset.reload().name).toBe("who's your daddy?");

    expect(asset).not.toBe(Asset.records[asset.id]);
  });

  it("can be cloned", function(){
    var asset = Asset.create({name: "what's cooler than cool?"}).dup(false);
    expect(asset.clone().__proto__).not.toBe(Asset.prototype);
    expect(asset.clone().__proto__.__proto__).toBe(Asset.prototype);

    expect(asset.name).toEqual("what's cooler than cool?");
    asset.name = "ice cold";
    expect(asset.reload().name).toBe("what's cooler than cool?");
  });

  it("clones are dynamic", function(){
    var asset = Asset.create({name: "hotel california"});

    // reload reference
    var clone = Asset.find(asset.id);

    asset.name = "checkout anytime";
    asset.save();

    expect(clone.name).toEqual("checkout anytime");
  });

  it("create or save should return a clone", function(){
    var asset = Asset.create({name: "what's cooler than cool?"});
    expect(asset.__proto__).not.toBe(Asset.prototype);
    expect(asset.__proto__.__proto__).toBe(Asset.prototype);
  });

  it("should be able to be subclassed", function(){
    Asset.extend({
      aProperty: true
    });

    var File = Asset.setup("File");

    expect(File.aProperty).toBeTruthy();
    expect(File.className).toBe("File");

    expect(File.attributes).toEqual(Asset.attributes);
  });

  it("dup should take a newRecord argument, which controls if a new record is returned", function(){
    var asset = Asset.create({name: "hotel california"});
    expect(asset.dup().id).toBeUndefined();
    expect(asset.dup().isNew()).toBeTruthy();

    expect(asset.dup(false).id).toBe(asset.id);
    expect(asset.dup(false).newRecord).toBeFalsy();
  });

  it("should be able to change ID", function(){
    var asset = Asset.create({name: "hotel california"});
    expect(asset.id).toBeTruthy();
    asset.changeID("foo");
    expect(asset.id).toBe("foo");

    expect(Asset.exists("foo")).toBeTruthy();
  });

  it("eql should respect ID changes", function(){
    var asset1 = Asset.create({name: "hotel california", id: "bar"});
    var asset2 = asset1.dup(false);

    asset1.changeID("foo");
    expect(asset1.eql(asset2)).toBeTruthy();
  });

  it("new records should not be eql", function(){
    var asset1 = new Asset;
    var asset2 = new Asset;
    expect(asset1.eql(asset2)).not.toBeTruthy();
  });

  it("should generate unique cIDs", function(){
      Asset.refresh({name: "Bob", id: 3});
      Asset.refresh({name: "Bob", id: 2});
      Asset.refresh({name: "Bob", id: 1});
      expect(Asset.find(2).eql(Asset.find(1))).not.toBeTruthy();
  });

  it("should handle more than 10 cIDs correctly", function(){
      for (i=0; i < 12; i++) {
        Asset.refresh({name: "Bob", id: i});    
      }
      expect(Asset.idCounter).toEqual(12);
  });


  describe("with spy", function(){
    var spy;

    beforeEach(function(){
      var noop = {spy: function(){}};
      spyOn(noop, "spy");
      spy = noop.spy;
    });

    it("can interate over records", function(){
      var asset1 = Asset.create({name: "test.pdf"});
      var asset2 = Asset.create({name: "foo.pdf"});

      Asset.each(spy);
      expect(spy).toHaveBeenCalledWith(asset1);
      expect(spy).toHaveBeenCalledWith(asset2);
    });

    it("can fire create events", function(){
      Asset.bind("create", spy);
      var asset = Asset.create({name: "cartoon world.png"});
      expect(spy).toHaveBeenCalledWith(asset, {});
    });

    it("can fire save events", function(){
      Asset.bind("save", spy);
      var asset = Asset.create({name: "cartoon world.png"});
      expect(spy).toHaveBeenCalledWith(asset, {});

      asset.save();
      expect(spy).toHaveBeenCalled();
    });

    it("can fire update events", function(){
      Asset.bind("update", spy);

      var asset = Asset.create({name: "cartoon world.png"});
      expect(spy).not.toHaveBeenCalledWith(asset);

      asset.save();
      expect(spy).toHaveBeenCalledWith(asset, {});
    });

    it("can fire destroy events", function(){
      Asset.bind("destroy", spy);
      var asset = Asset.create({name: "cartoon world.png"});
      asset.destroy();
      expect(spy).toHaveBeenCalledWith(asset, {});
    });

    it("can fire events on record", function(){
      var asset = Asset.create({name: "cartoon world.png"});
      asset.bind("save", spy);
      asset.save();
      expect(spy).toHaveBeenCalledWith(asset, {});
    });

    it("can fire change events on record", function(){
      Asset.bind("change", spy);

      var asset = Asset.create({name: "cartoon world.png"});
      expect(spy).toHaveBeenCalledWith(asset, "create", {});

      asset.save();
      expect(spy).toHaveBeenCalledWith(asset, "update", {});

      asset.destroy();
      expect(spy).toHaveBeenCalledWith(asset, "destroy", {});
    });

    it("can fire error events", function(){
      Asset.bind("error", spy);

      Asset.include({
        validate: function(){
          if ( !this.name )
            return "Name required";
        }
      });

      var asset = new Asset({name: ""});
      expect(asset.save()).toBeFalsy();
      expect(spy).toHaveBeenCalledWith(asset, "Name required");
    });

    it("should be able to bind once", function(){
      Asset.one("save", spy);

      var asset = new Asset({name: "cartoon world.png"});
      asset.save();

      expect(spy).toHaveBeenCalledWith(asset, {});
      spy.reset();

      asset.save();
      expect(spy).not.toHaveBeenCalled();
    });
    
    it("should be able to bind once on instance", function(){
      var asset = Asset.create({name: "cartoon world.png"});

      asset.one("save", spy);
      asset.save();

      expect(spy).toHaveBeenCalledWith(asset, {});
      spy.reset();

      asset.save();
      expect(spy).not.toHaveBeenCalled();
    });

    it("it should pass clones with events", function(){
      Asset.bind("create", function(asset){
        expect(asset.__proto__).not.toBe(Asset.prototype);
        expect(asset.__proto__.__proto__).toBe(Asset.prototype);
      });

      Asset.bind("update", function(asset){
        expect(asset.__proto__).not.toBe(Asset.prototype);
        expect(asset.__proto__.__proto__).toBe(Asset.prototype);
      });
      var asset = Asset.create({name: "cartoon world.png"});
      asset.updateAttributes({name: "lonely heart.png"});
    });

    it("should be able to unbind instance events", function(){
      var asset = Asset.create({name: "cartoon world.png"});

      asset.bind("save", spy);
      asset.unbind();
      asset.save();

      expect(spy).not.toHaveBeenCalled();
    });

    it("should unbind events on instance destroy", function(){
      var asset = Asset.create({name: "cartoon world.png"});

      asset.bind("save", spy);
      asset.destroy();

      asset.trigger("save", asset);
      expect(spy).not.toHaveBeenCalled();
    });

    it("callbacks should still work on ID changes", function(){
      var asset = Asset.create({name: "hotel california", id: "bar"});
      asset.bind("test", spy);
      asset.changeID("foo");

      asset = Asset.find("foo");
      asset.trigger("test", asset);
      expect(spy).toHaveBeenCalled();
    })
  });
});
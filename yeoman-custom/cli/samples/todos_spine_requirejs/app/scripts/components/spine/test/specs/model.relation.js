describe("Model.Relation", function(){
  var Album;
  var Photo;

  beforeEach(function(){
    Album = Spine.Model.setup("Album", ["name"]);
    Photo = Spine.Model.setup("Photo", ["name"]);
  });

  it("should honour hasMany associations", function(){
    Album.hasMany("photos", Photo);
    Photo.belongsTo("album", Album);

    var album = Album.create();

    expect( album.photos() ).toBeTruthy();
    expect( album.photos().all() ).toEqual([]);

    album.photos().create({name: "First Photo"});

    expect( Photo.first() ).toBeTruthy();
    expect( Photo.first().name ).toBe("First Photo");
    expect( Photo.first().album_id ).toBe(album.id);
  });

  it("should honour belongsTo associations", function(){
    Album.hasMany("photos", Photo);
    Photo.belongsTo("album", Album);

    expect(Photo.attributes).toEqual(["name", "album_id"]);

    var album = Album.create({name: "First Album"});
    var photo = Photo.create({album: album});

    expect( photo.album() ).toBeTruthy();
    expect( photo.album().name ).toBe("First Album");
  });

  it("should load nested Singleton record", function(){
    Album.hasOne("photo", Photo);
    Photo.belongsTo("album", Album);

    var album = new Album();
    album.load({id: "1", name: "Beautiful album",
                photo: {id: "2", name: "Beautiful photo", album_id: "1"}});

    expect( album.photo() ).toBeTruthy();
    expect( album.photo().name ).toBe("Beautiful photo");
  });

  it("should load nested Collection records", function(){
    Album.hasMany("photos", Photo);
    Photo.belongsTo("album", Album);

    var album = new Album();
    album.load({
                id: "1", name: "Beautiful album",
                photos: [{id: "1", name: "Beautiful photo 1", album_id: "1"},
                         {id: "2", name: "Beautiful photo 2", album_id: "1"}]
               });

    expect( album.photos() ).toBeTruthy();
    expect( album.photos().all().length ).toBe(2);
    expect( album.photos().first().name ).toBe("Beautiful photo 1");
    expect( album.photos().last().name ).toBe("Beautiful photo 2");
  });
});

module.exports = function(app){

  app.get('/api/<%=name%>s', function(req, res) {
    res.send('You hit an ExpressJS route!');
  });

  app.get('/api/<%=name%>/:id', function(req, res) {
    res.send('You hit an ExpressJS route with ' + req.params.id);
  });

  app.post('/api/<%=name%>s', function(req, res) {
    
  });

  app.put('/api/<%=name%>/:id', function(req, res) {

  });

  app.delete('/api/<%=name%>/:id', function(req, res) {

  });

};

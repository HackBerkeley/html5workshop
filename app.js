require.paths.unshift('./node_modules')

var express = require('express');
var fs = require('fs');
var app =  express.createServer();
app.use(express.bodyParser());

var htmlCode = fs.readFileSync('template/index.html');
var cssCode = fs.readFileSync('template/style.css');



makePage = function(name) {
  fs.mkdirSync("public/user/" + name, 0755);
  writeToPageCSS(name, cssCode);
  writeToPageHTML(name, htmlCode);
}

writeToPageCSS = function(name, c) {
  var path = "public/user/" + name;
  fs.writeFile(path + '/style.css', c, function(err) {});  
}

writeToPageHTML = function(name, h) {
  var path = "public/user/" + name;
  fs.writeFile(path + '/index.html', h, function(err) {}); 
}

// Initialize main server
app.use(express.bodyParser());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.get('/edit/:username/css', function(req, res){
  var user = req.params.username;
  var path = "public/user/" + user;
  fs.readFile(path + "/style.css", function(err, css){
    if (err) {
      makePage(user);
      css = cssCode;
    }
    
    res.render('editcss', {user: user, css: css});
  });
  
  
});

app.get('/edit/:username/html', function(req, res){
  var user = req.params.username;
  var path = "public/user/" + user;
  fs.readFile(path + "/index.html", function(err, html){
    if (err) {
      makePage(user);
      html = htmlCode;
    }
    res.render('edithtml', {user: user, html: html});
  });
  
  
});

app.get('/:username', function(req, res){
  res.redirect('/user/' + req.params.username + '/index.html');
});

app.post('/updateHTML', function(req, res){
  writeToPageHTML(req.body.user, req.body.html);
  res.send('done');
});

app.post('/updateCSS', function(req, res){
  writeToPageCSS(req.body.user, req.body.css);
  res.send('done');
});

app.listen(80);

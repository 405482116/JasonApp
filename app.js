var express = require('express');
var path = require("path")
var fs = require('fs')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var exphbs = require('express-handlebars')



var app = express();


app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'view'))  



app.engine('.hbs', exphbs({  
  defaultLayout: 'index',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'view/layouts')
}))




app.use(cookieParser())
app.use(session({
  secret: 'WBLOG',
  resave: false,
  saveUninitialized: true,
}))

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})

app.post('/login', urlencodedParser, function (req, res, next) {
  if (req.body.username === 'admin' && req.body.password === 'admin') {
    res.cookie('password', req.body.password, {
      maxAge: 600000,
      httpOnly: true,
      path: '/'
    });
    req.session.user = {
      'name': req.body.username,
      'pass': req.body.password
    }
    res.sendFile(__dirname + "/view/" + "reade.html");
  } else {
    res.status(404).send('user name or password wrong!')
  }
})
app.get('/readFile', urlencodedParser, function (req, res, next) {
  var username = req.session.user ? req.session.user.name : '';
  var password = req.session.user ? req.session.user.name : '';

  if (username === 'admin' && password === 'admin') {
    fs.readFile('./README.md', 'utf-8', function (err, data) {
      res.send(data.toString());
    })
  } else {
    res.redirect(303, '/');

  }

})

app.set('view index', 'hbs');

app.get('/hbs', function (req, res) {
  res.render('home', {
    name: 'John'
  })
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
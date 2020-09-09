var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cons = require('consolidate'),
  dust = require('dustjs-helpers'),
  pg = require('pg'),
  Pool = require('pg-pool')
  app = express();

// DB Connect String
//var connect = "postgres://eduonix:123456@localhost/recipebookdb";

// Assign Dust Engine To .dust Files
app.engine('dust', cons.dust);

// Set Default Ext .dust
//app.set('port', process.env.PORT || 96);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const config = {
    user: 'postgres',
    database: 'recipebookdb',
    password: 'hrithika5',
    port: 5432 ,  
    //ssl: true,
    //max: 20, // set pool max size to 20
    //idleTimeoutMillis: 1000, // close idle clients after 1 second
    //connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    //maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)               //Default port, change it if needed
};

// pool takes the object above -config- as parameter
const pool = new pg.Pool(config);

app.get('/', (req, res, next) => {
// console.log('checking')
 /**  */
   pool.connect(function(err, client, done) {
       if (err) {
         //console.log('checking1')
 
           console.log("Can not connect to the DB" + err);
       }
       client.query('SELECT * FROM recipes', function (err, result) {
         //console.log('checking2')
 
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.render('index', {recipes: result.rows});
           // res.status(200).render('result.rows');
       })
   })

  /** */
});

app.post('/add',function(req,res){
 pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query("INSERT INTO recipes(name,ingredients,directions) VALUES($1,$2,$3)",
        [req.body.name,req.body.ingredients,req.body.directions]);
   
        done();
        res.redirect('/');
   });
});
//sir maybe something is wrong in javascript or jquery files? i am just checking syntx of params where is javascript file?
app.delete('/delete/:id',function(req,res){
  console.log(req.params)
  pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query("DELETE FROM recipes WHERE id = $1",
        [req.params.id]);
        done();
        res.sendStatus(200);
   });
});


app.post('/edit',function(req,res){
 pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query("UPDATE recipes SET name=$1,ingredients=$2,directions=$3 WHERE id =$4",
        [req.body.name,req.body.ingredients,req.body.directions,req.body.id]);
   
        done();
        res.redirect('/');
   });
});


// Server
app.listen(96, function(){
  console.log('Server Started On Port 96');
});
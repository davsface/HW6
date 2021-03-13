// Course: CS290 - Web Development
// Student Name: Dave Huston
// Assignment: HW6: GET and POST checker
// Description:
//require express, express-handlebars, and body-parser

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

//allow app to be able to accept request bodies formatted as BOTH URL encoded query strings or JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

//set port
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 6950);

app.get('/reset-table', (req, res, next) => {
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
        if(err) {
            next(err);
            return;
        }
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function(err){
            if(err) {
                next(err);
                return;
            }
            mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
                if(err){
                    next(err);
                    return;
                }
                res.send(rows);
            });
        });
    });
});

app.get('/',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.rows = rows;
        res.render('home',context);
    });
});

app.post('/', (req, res, next) => {
    var payload = []
    for (key in req.body) {
        payload.push(req.body[key]);
    }
    //insert into table
    mysql.pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)", [req.body.name,req.body.reps,req.body.weight,req.body.date,req.body.lbs], function(err, result){
        if(err){
            next(err);
            return;
        }
        //get updated table
        mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            //send table
            res.json(rows);
        });
    });
});
/*
app.delete('/', (req, res, next) => {
    //delete row
    mysql.pool.query("DELETE FROM workouts WHERE id = ?", [req.body.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        //get updated table data
        mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            //send
            res.json(rows);
        });
    });
});
*/
app.get('/safe-update',function(req,res,next){
    var context = {};
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        if(result.length == 1){
            var curVals = result[0];
            mysql.pool.query("UPDATE workouts SET name=?, done=?, due=? WHERE id=? ",
                [req.query.name || curVals.name, req.query.done || curVals.done, req.query.due || curVals.due, req.query.id],
                function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    context.results = "Updated " + result.changedRows + " rows.";
                    res.render('home',context);
                });
        }
    });
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
/**
 * New node file
 */
var ejs = require("ejs");
var mysql = require('./mysql'); // './mysql' point to mysql,js file
//var mysqltime = require('./mysql');

var crypt = require ('crypto');

/*
function signin(req,res) {
  return res.render('signin'); 
}
*/

/*
function afterSignIn(req,res)
{
	// check user already exists
	var getUser="select * from user where username='"+req.param("inputUsername")+"' and password='" + req.param("inputPassword") +"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				return res.render('successLogin', {data: results}); 				
			}
			else {				
				console.log("Invalid Login");
				return res.render('failLogin'); 				
			}
		}  
	},getUser);
}
*/

function login(req,res){
	var email = req.body.email;
	var password = req.body.password;
	
	var getUser="select * from user where email='"+ email +"' and password='" + password +"'";
	console.log("Query is:"+getUser);
	
	if (email && password){		
		password = crypt.createHash('md5').update(password).digest('hex');
		mysql.fetchData(function(err,results){
			if(err){
				console.log(err);
				//return res.render('index');
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("valid Login");
					req.session.user = results[0];
					//return res.render('userhome');  //login successfully, return to user's homepage
					return res.redirect('/userhome');
					//res.send(); //label
					//return res.render('successLogin', {data: results}); 				
				}
				else {				
					console.log("user not found");
					return res.render('index');
					//return res.redirect('/');
					//return res.render('failLogin'); 				
				}
			}  
		},getUser); //mysql.fetchData(function(err,results),query)
	}else{	
		console.log('please input the email and password');
		return res.redirect('/');
	}	
}

function register(req,res){
	var email = req.body.email;
	var name = req.body.name;
	var password = req.body.password;
	var password_r = req.body.password_r;
	//register label
	/*
	function getConnection(){
		var connection = mysql.createConnection({
		    host     : 'localhost',
		    user     : 'root',
		    password : '23001288',
		    database : 'twitter_db',
		    port	 : 3306
		});
		return connection;
	}*/
	
	//connect to database
	//use connection pool	
	var database = mysql.getConnection();
	//no connection pool
	//var database = mysql.getConnection();
	
	database.query('select * from user where email= "273_student01@sjsu.edu" ', function(err, rows, fields) {
			if(err){
				console.log("ERROR: " + err.message);
			}
			else 
			{	// result
				console.log("Oh yes!:"+rows);
				//callback(err, rows);
			}
		});		
	
	if(email && name && password && password_r){
		if(password==password_r){
			password = crypt.createHash('md5').update(password).digest('hex');
		}
		database.query('select * from user where email=?', [email], function(error,result){
			if(error){
				console.log(error);
				return res.render('index');
			} 
			if(result.length>0){
				return res.render('index', {message: 'email exists'});
			}else{
				var mysqldate ='';
				mysql.datetime(function(time) {
					mysqldate=time;					
				});
				
				var user={
						email: email,
						username: name,
						password: password,
						create_at: mysqldate
				}
				
				database.query('insert into user set ?', user, function(error){
					if(error){
						console.log(error);
						return res.render('index');	
					}
					database.query('select * from user where email=? and password = ?', [email, password], function(error,result){
						if(error){
							console.log(error);
							return res.render('index');	
						}
						if(result.length ==1){
							req.session.user = result[0]; //register successfully, return to user's homepage
							//return res.render('userhome');	
							return res.redirect('/userhome');
						}else{
							return res.render('index');
						}						
					});
				});				
			}		
		});		
	}else{
		return res.render('index', {message:'fields are required'}); // pass value from js to page
	}
	
}
	
/*
exports.login = function(database){
	return function(req,res){
		var email = req.body.email;
		var password = req.body.password;
		if (email && password){
			database.query('select * from user where email=? and password=?',[email,password], function(error,result){
				if(error){
					console.log(error);
					return res.redirect('/');					
				}else{
					if(result.length==1){
						console.log('user found');
					}else{
						console.log('user or password error');
					}
				}
			});//end query
		}else{	
			return res.redirect('/');
		}
	}
}
*/

function logout(req,res){
	req.session.destroy();
	res.redirect('/');
	//res.render('index');
	//res.render('/');
	//res.redirect('/');
}
exports.logout=logout;
exports.register=register;
exports.login=login;
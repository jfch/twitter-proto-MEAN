/**
 * New node file
 */
var mysql = require('./mysql');


function get_user(req,res){
	//res.render('index');	
	var database = mysql.getConnection(); //connect to database
	var user = req.params.user; //label - correspond to app.js :user, which pass data(posts.user_id) on webpage to server(:user)
	
	database.query('select * from user where id=?', [user], function(error,user_result){
		if(error){
			console.log(error);
			return res.redirect('/userhome');
		}
		
		if(user_result.length ==1){
			database.query('select * from posts where user_id=?', [user], function(error,posts){
				if(error){
					console.log(error);
					return res.redirect('/userhome');
				}
				//label add 'if(req.session.user.id)' to avoid directly visit 'http://localhost:3000/user/1'
				database.query('select * from follow where user_id=? and follow_user_id=?', [req.session.user.id, user], function(error,result){
					if(error){
						console.log(error);
						return res.redirect('/userhome');
					}
					var follow = false;
					if(result.length >0){
						follow=true;
					}else{
						follow=false;
					}
					res.render('user',{posts: posts, user_open: user_result[0], follow: follow}) //result[0]	
				});
							
			});
		}else{
			return res.redirect('/userhome');
		}
	});
	
}

function get_follow(req,res){
	//res.render('index');	
	var user_id = req.params.id;//label - correspond to app.js :user, which pass data(posts.user_id) on webpage to server(:user)
	var follow = {
			user_id: req.session.user.id,
			follow_user_id: user_id	
	};
	
	var database = mysql.getConnection(); //connect to database
	database.query('insert into follow set ?', follow, function(error){
		if(error){
			console.log(error);
			return res.redirect('/user/' + user_id);
		}
		res.redirect('/userhome');		
	});
}
		
function get_unfollow(req,res){
	//res.render('index');	
	var user_id = req.params.id;//label - correspond to app.js :user, which pass data(posts.user_id) on webpage to server(:user)
		
	var database = mysql.getConnection(); //connect to database
	database.query('delete from follow where user_id=? and follow_user_id=?', [req.session.user.id, user_id], function(error){
		if(error){
			console.log(error);
			return res.redirect('/user/' + user_id);
		}
		res.redirect('/userhome');		
	});
}		

exports.get_follow=get_follow;
exports.get_unfollow=get_unfollow;
exports.get_user=get_user;
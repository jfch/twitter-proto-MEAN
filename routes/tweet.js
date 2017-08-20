/**
 * New node file
 */

var mysql = require('./mysql');


function post_tweet(req,res){
	//res.render('index');	
	var text = req.body.tweet_content; //pass value from page(name) to js
	var database = mysql.getConnection(); //connect to database
	//tweet_time
	var mysqldate='';
	mysql.datetime(function(time){
		mysqldate = time;
	});
	
	var post={
			user_id: req.session.user.id,
			tweets: text, //label tweet variable
			create_at: mysqldate
	}
	if(text){
		if(text.length <=140){
			// 140> length >0, post to server's database, and show on the page.
			database.query('insert into posts set ?', post, function(error) {
				if(error){	
					console.log(error);
				}
				return res.redirect('/userhome'); //return res.redirect('/home')
			});			
		}else {
			//lenth too long, show error, angular version
			//length too long
			return res.render('userhome',{message:'tweet cannot be longer than 140 characters'});
		}		
	}else{
		return res.render('userhome',{message:'tweet is empty'});
	}
	
	
}

exports.post_tweet= post_tweet;


	
	
	
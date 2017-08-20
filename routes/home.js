/**
 * New node file
 */
var mysql =require('./mysql');

function userhome(req,res){
	var database = mysql.getConnection();
	//label, find the username through table( user) key : [req.session.user.id]
	//database.query('select * from posts where user_id=?', [req.session.user.id], function(error, result) {
	database.query('select \
						user.username, \
						posts.user_id, \
						posts.tweets, \
						posts.create_at \
					from posts \
						inner join user on \
						 posts.user_id =user.id where posts.user_id=?', [req.session.user.id], function(error, result) {
		if(error){
			console.log(error);
			return res.redirect('/userhome');
		}
		res.render('userhome', {posts: result});
	});

	//res.render('userhome');	
}

function red_index(req,res){
	res.render('index');	
}
exports.userhome=userhome;
exports.red_index=red_index;
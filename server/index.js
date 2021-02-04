const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mysql = require('mysql');
const cors = require('cors')

var app = express();
app.use(cors());

var schema = buildSchema(`
	scalar Date
  type Article{
      id	: Int,
      name	: String,
      price : Float,
      active : Boolean
  }

  type Guestorder{
      id : String,
    	id_table : Int,
      status : String,
      price : Float,
      ordertime : Date,
			archieved : Int
  }

  type Articleinorder{
    id_order : String,
    id_article	 : Int,
    quantity : Int,
    price_article : Float,
    price_total  : Float,
		name : String
  }

	type Employee{
		email : String,
		password : String
	}

	type Query{
    getArticles: [Article],
	  getArticle(id: Int) : Article,
    getGuestorder(id: String) : Guestorder,
    getAllArticlesinorder(id: Int) : [Articleinorder],
		getGuestordersOnTable(id_table: Int) : [Guestorder],
		getEmployee(email: String, password: String) : Employee,
		getGuestorders : [Guestorder],
		getArticlesinorders : [Articleinorder],
    }

	type Mutation{
			createGuestOrder(id: String!, id_table : Int, price : Float): Boolean,
			createArticleInOrder(id_order : String!, id_article : Int!, quantity : Int!, price_article : Float!, price_total : Float!, name: String!): Boolean,
			updateGuestOrderStatus(id: String!, status: String!): Boolean
			updateGuestOrderArchieved(id: String!, archieved: Int!): Boolean
		}
`);

const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
     req.mysqlDb.query(sql, args, (err, rows) => {
         if (err)	return reject(err);
         rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
         console.log("[query]>> " + sql + " [agrument(s)]>> " + args);
     });
 });

 var root = {
   getArticles: (args, req) => queryDB(req, "select * from article").then(data => data),
   getArticle:  (args, req) => queryDB(req, "select * from article where id = ?", [args.id]).then(data => data[0]),
   getGuestorder: (args, req) => queryDB(req, "select * from guestorder where id = ?", [args.id]).then(data => data[0]),
   getAllArticlesinorder : (args, req) => queryDB(req, "select * from articleinorder where id_order = ?", [args.id]).then(data => data),
	 createGuestOrder: (args, req) => queryDB(req, "insert into guestorder SET ?", args).then(data => data),
	 createArticleInOrder: (args, req) => queryDB(req, "insert into articleinorder SET ?", args).then(data => data),
	 getGuestordersOnTable:(args, req) => queryDB(req, "select * from guestorder where archieved = 0 and id_table = ?", [args.id_table]).then(data => data),
	 getEmployee: (args, req) => queryDB(req, "select * from employee WHERE email = ? and password = ?", [args.email, args.password]).then(data => data[0]),
	 getGuestorders: (args, req) => queryDB(req, "select * from guestorder").then(data => data),
	 getArticlesinorders: (args, req) => queryDB(req, "select * from articleinorder").then(data => data),
	 updateGuestOrderStatus: (args, req) => queryDB(req, "update guestorder set status = ? WHERE id = ?", [args.status, args.id]).then(data => data),
	 updateGuestOrderArchieved: (args, req) => queryDB(req, "update guestorder set archieved = ? WHERE id = ?", [args.archieved, args.id]).then(data => data),
 };

 app.use((req, res, next) => {
   req.mysqlDb = mysql.createConnection({
     host     : 'localhost',
     user     : 'root',
     password : '',
     database : 'smallcafedb'
   });
   req.mysqlDb.connect();
   next();
 });

 app.use('/graphql', graphqlHTTP({
   schema: schema,
   rootValue: root,
   graphiql: true
 }));

 app.listen(4000);

 console.log('Running a GraphQL API server at localhost:4000/graphql');

const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mysql = require('mysql');
const cors = require('cors')

var app = express();
app.use(cors());
var schema = buildSchema(`

	scalar Date

  type User{
      userid	: Int,
      username	: String
  }

	type Room{
	  roomid		: Int,
	  roomname		: String,
    roomcapacity	: Int,
	  roomwifi		: Boolean,
	  roomminibar	: Boolean
	}

	type Reservation{
	  reservationid	: Int,
	  roomid		: Int,
	  userid		: Int,
	  reservationstartdate	: Date,
	  reservationenddate	: Date
	}

	type Query{
    getUsers: [User],
	  getUserInfo(userid: Int) : User,
	  getRooms: [Room],
	  getRoomInfo(roomid: Int) : Room,
	  getReservations: [Reservation],
	  getReservationInfo(reservationid: Int) : Reservation,
		getFirstRoom(roomid: Int) : String,
		getFreeRooms(wsd: Date, wed: Date) : [Room],
    }

	type Mutation{
		createReservation(roomid : Int, userid : Int, reservationstartdate : Date, reservationenddate : Date): Boolean
	}
`);

 const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
      req.mysqlDb.query(sql, args, (err, rows) => {
          if (err)	return reject(err);
          rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
					console.log("q >> " + sql + " a>> " + args);
      });
  });

  var root = {
  getUsers: (args, req) => queryDB(req, "select * from user").then(data => data),
	getUserInfo: (args, req) => queryDB(req, "select * from user where userid = ?", [args.userid]).then(data => data[0]),
	getRooms: (args, req) => queryDB(req, "select * from room").then(data => data),
	getRoomInfo: (args, req) => queryDB(req, "select * from room where roomid = ?", [args.roomid]).then(data => data[0]),
	getReservations: (args, req) => queryDB(req, "select * from reservation").then(data => data),
	getReservationInfo: (args, req) => queryDB(req, "select * from reservation where reservationid = ?", [args.reservationid]).then(data => data[0]),
	createReservation: (args, req) => queryDB(req, "insert into reservation SET ?", args).then(data => data),
	getFirstRoom: (args, req) => queryDB(req, "select roomname from room where roomid = ?", [args.roomid]).then(data => data[0]),
	getFreeRooms: (args, req) => queryDB(req,
		"SELECT * FROM `room` where `roomid` in (SELECT DISTINCT `roomid` FROM `room` WHERE `roomid` NOT IN (SELECT roomid FROM `reservation` WHERE (? < `reservationenddate` AND `reservationstartdate` < ?)))", [args.wsd, args.wed])
		 .then(data => data),
  };


app.use((req, res, next) => {
  req.mysqlDb = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'smallhoteldb'
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

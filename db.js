import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

// const Conn = new Sequelize(
//   'rocket_elevators_db_development',
//   'spire',
//   'yes',
//   {
//     dialect: 'mysql',
//     host: 'codeboxx.cq6zrczewpu2.us-east-1.rds.amazonaws.com'
//   }
// );


var mysql = require('mysql');
//const { resolve } = require('path');
var connectio = mysql.createConnection({
    host: 'HOST NAME',
    user: 'USER NAME',
    password: 'PASS',
    database: ''  

});
connectio.connect(function(error){
  if (!!error) {
      console.log("Unable to connect to mySQL database.");
  } else {
      console.log("You are connected to mySQL database.");
  }
});

// const Person = Conn.define('person', {
//   firstName: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   lastName: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   email: {
//     type: Sequelize.STRING,
//     validate: {
//       isEmail: true
//     }
//   }
// });

// const Post = Conn.define('post', {
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   content: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// // Relations
// Person.hasMany(Post);
// Post.belongsTo(Person);

// Conn.sync({ force: true }).then(()=> {
//   _.times(10, ()=> {
//     return Person.create({
//       firstName: "yes",
//       lastName: "no",
//       email: "waw@gmail.com"
//     }).then(person => {
//       return person.createPost({
//         title: `Sample post by ${person.firstName}`,
//         content: 'here is some content'
//       });
//     });
//   });
// });


export default connectio;

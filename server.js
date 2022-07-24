//Dependencies

var express = require("express");
var { graphqlHTTP } = require("express-graphql");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const PORT = process.env.PORT || 3000;

//SEQUELIZE
const { Sequelize, Model, DataTypes } = require("sequelize");

const {Client} = require('pg')
const pg = new Client({
    host: 'codeboxx-postgresql.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
    user: 'codeboxx',
    password: 'Codeboxx1!',
    database: 'MarcosLopez'
});
pg.connect(function (error) {
  if (!!error) {
    console.log("Unable to connect to PG database.");
  } else {
    console.log("You are connected TO PG database.");
  }
});


var mysql = require('mysql2');
const { json } = require("express");
//const { resolve } = require('path');
var connection = mysql.createConnection({
    host: 'codeboxx.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
    user: 'codeboxx',
    password: 'Codeboxx1!',
    database: 'Tanim_Khondaker_development'  

});
connection.connect(function(error){
  if (!!error) {
      console.log("Unable to connect to mySQL database.");
  } else {
      console.log("You are connected to mySQL database.");
  }
});

let connectio = connection.promise();



//Type creation
// const InterventionOBJ = new GraphQLObjectType({
//   name: "Intervention",
//   description: "This is an intervention",
//   fields: () => ({
//     id: { type: GraphQLInt },
//     building_id: { type: GraphQLString },
//     employee_id: { type: GraphQLString },
//     battery_id: { type: GraphQLString },
//     column_id: { type: GraphQLString },
//     elevator_id: { type: GraphQLString },
//     interventionDateStart: { type: GraphQLString },
//    interventionDateEnd: { type: GraphQLString },
//     intervention_start: { type: GraphQLDateTime },
//     intervention_end: { type: GraphQLDateTime },
//     result: { type: GraphQLString },
//     report: { type: GraphQLString },
//     status: { type: GraphQLString },
//     building: {
//       type: BuildingOBJ,
//       resolve: async (intervention, args) => {
//         const [rows, fields] = await connectio.query(
//           `SELECT * FROM buildings WHERE id = ${intervention.building_id}`
//         );
//         return rows[0];
//       },
//     },
//   }),
// });

const addresse = new GraphQLObjectType({
  name: "Address",
  description: "This is an address",
  fields: () => ({
    id: { type: GraphQLInt },
    address_type: { type: GraphQLString },
    status: { type: GraphQLString },
    entity: { type: GraphQLString },
    numberAndStreet: { type: GraphQLString },
    suiteOrApartment: { type: GraphQLString },
    city: { type: GraphQLString },
    postal_code: { type: GraphQLString },
    country: { type: GraphQLString },
    notes: { type: GraphQLString },
  }),
});

const BuildingOBJ = new GraphQLObjectType({
  name: "Building",
  description: "This is a building",
  fields: () => ({
    id: { type: GraphQLInt },
    addressOfBuilding: { type: GraphQLString },
    full_name_building_admin: { type: GraphQLString },
    email_building_admin: { type: GraphQLString },
    phone_building_admin: { type: GraphQLString },
    full_name_technical_authority: { type: GraphQLString },
    email_technical_authority: { type: GraphQLString },
    phone_technical_authority: { type: GraphQLString },
    interventionDateStart: { type: GraphQLString },
    interventionDateEnd: { type: GraphQLString },
    customer_id: {type: GraphQLInt }
  }),
});

const CustomerOBJ  = new GraphQLObjectType({
  name: "Customer",
  description: "This is a customer",
  fields: () => ({
    id: { type: GraphQLInt },
    companyName: { type: GraphQLString },
    fullName: { type: GraphQLString },
    contactPhone: { type: GraphQLString },
    email: { type: GraphQLString },
    description: { type: GraphQLString },
    companyHqAddresse: { type: GraphQLString },
    fullNameTechnicalAuthority: { type: GraphQLString },
    technicalAuthorityPhone: { type: GraphQLString },
    technicalAuthorityEmail: {type: GraphQLString },
    user_id: { type: GraphQLInt }
  }),
});



const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
   
    address: {
      type: addresse,
      description: "An Address",

      args: {
        id: { type: GraphQLInt },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM addresses WHERE id = ${args.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    },

    building: {
      type: BuildingOBJ,
      description: "A building",

      args: {
        id: { type: GraphQLInt },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM buildings WHERE id = ${args.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    },
    customer: {
      type: CustomerOBJ,
      description: "A customer",

      args: {
        id: { type: GraphQLInt },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM customers WHERE id = ${args.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    },

    
  

    // connectio.connect(function(err) {
    //   if (err) throw err;
    // //   connectio.query("SELECT * FROM addresses", function (err, result, fields) {
    // //     if (err) throw err;
    // //     console.log(result);
    //   });
    // });
    
  }),
});



//Schema creation
const schema = new GraphQLSchema({
  query: Query,
  // mutation: RootMutationType,
});

//Express Server
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log("Server is running");
});
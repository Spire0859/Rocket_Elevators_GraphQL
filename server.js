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
    host: 'HOST',
    user: 'USER',
    password: 'PASS WORD!',
    database: ''
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
    host: 'HOST',
    user: 'USER',
    password: 'PASS WORD!',
    database: ''  

});
connection.connect(function(error){
  if (!!error) {
      console.log("Unable to connect to mySQL database.");
  } else {
      console.log("You are connected to mySQL database.");
  }
});

let connectio = connection.promise();



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
    customer_id: {type: GraphQLInt },
    intervention: { 
      type:  new GraphQLList(InterventionOBJ),
      resolve: async (parent) => {
        const rows = await connectio.query(
          `SELECT * FROM interventions WHERE building_id = ${parent.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },

    },

    battery: { 
      type:  new GraphQLList(BatteryOBJ),
      resolve: async (parent) => {
        const rows = await connectio.query(
          `SELECT * FROM batteries WHERE building_id = ${parent.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },

    },

    building_details: { 
      type:  new GraphQLList(building_detailsOBJ),
      resolve: async (parent) => {
        const rows = await connectio.query(
          `SELECT * FROM building_details WHERE building_id = ${parent.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },

    }
  }),
});


const BatteryOBJ = new GraphQLObjectType({
  name: "Battery",
  description: "This is a battery",
  fields: () => ({
    id: { type: GraphQLInt },
    types: { type: GraphQLString},
    status: { type: GraphQLString },
    date_commissioning: { type: GraphQLDateTime },
    date_last_inspection: { type: GraphQLDateTime },
    certificate_of_operations: { type: GraphQLString },
    building_id: { type: GraphQLInt },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    culumn: { 
      type:  new GraphQLList(ColumnOBJ),
      resolve: async (parent) => {
        const rows = await connectio.query(
          `SELECT * FROM columns WHERE battery_id = ${parent.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    }
  }),
});

const ColumnOBJ = new GraphQLObjectType({
  name: "Column",
  description: "This is a column",
  fields: () => ({
    id: { type: GraphQLInt },
    types: { type: GraphQLString},
    model: { type: GraphQLString },
    numberFloorServed: { type: GraphQLString },
    status: { type: GraphQLString },
    information: { type: GraphQLString },
    notes: { type: GraphQLString },
    battery_id: { type: GraphQLInt },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    elevator: { 
      type:  new GraphQLList(ElevatorOBJ),
      resolve: async (parent) => {
        const rows = await connectio.query(
          `SELECT * FROM elevators WHERE column_id = ${parent.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    }
  }),
});

const ElevatorOBJ = new GraphQLObjectType({
  name: "Elevator",
  description: "This is an elevator",
  fields: () => ({
    id: { type: GraphQLInt },
    serial_number: { type: GraphQLInt},
    companyName: { type: GraphQLString },
    model: { type: GraphQLString },
    fullName: { type: GraphQLString },
    email: { type: GraphQLString },
    types: { type: GraphQLString },
    status: { type: GraphQLString },
    dateCommissioning: { type: GraphQLDateTime },
    dateLastInspection: { type: GraphQLDateTime },
    certificateOperations: { type: GraphQLString },
    information: { type: GraphQLString },
    notes: { type: GraphQLString },
    column_id: { type: GraphQLInt },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  }),
});

const building_detailsOBJ = new GraphQLObjectType({
  name: "building_details",
  description: "This is a building_detail",
  fields: () => ({
    id: { type: GraphQLInt },
    InformationKey: { type: GraphQLString },
    Value: { type: GraphQLString },
    building_id: { type: GraphQLInt },
  }),
});



const InterventionOBJ = new GraphQLObjectType({
  name: "Intervention",
  description: "This is an intervention",
  fields: () => ({
    id: { type: GraphQLInt },
    interventionDateStart: { type: GraphQLString},
    interventionDateEnd: { type: GraphQLString },
    result: { type: GraphQLString },
    report: { type: GraphQLString },
    status: { type: GraphQLString },
    employee_id: { type: GraphQLInt },
    building_id: { type: GraphQLInt },
    batterie_id: { type: GraphQLInt },
    column_id: { type: GraphQLInt },
    elevator_id: { type: GraphQLInt },
    building: { 
      type:  new GraphQLList(BuildingOBJ),
      resolve: async (parent) => {
        const rows = await connectio.query(
          `SELECT * FROM buildings WHERE id = ${parent.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    }
  }),
});

const EmployeeOBJ = new GraphQLObjectType({
  name: "Employee",
  description: "This is an employee",
  fields: () => ({
    id: { type: GraphQLInt },
    firstNname: { type: GraphQLString },
    lastName: { type: GraphQLString },
    title: { type: GraphQLString },
    user_id: { type: GraphQLInt },
    intervention: { 
      type:  new GraphQLList(InterventionOBJ),
      resolve: async (parent) => {
        const rows = await connectio.query(
          `SELECT * FROM interventions WHERE employee_id = ${parent.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },

    }
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
    user_id: { type: GraphQLInt },
    building: { 
      type:  new GraphQLList(BuildingOBJ),
      resolve: async (parent) => {
        const rows = await connectio.query(
          `SELECT * FROM buildings WHERE customer_id = ${parent.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },

    }
  }),
});



const Query = new GraphQLObjectType({
  name: "Query",
  description: "Query",
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

    intervention: {
      type: InterventionOBJ,
      description: "An intervention",

      args: {
        id: { type: GraphQLInt },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM interventions WHERE id = ${args.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    },

    buildings: {
      type: new GraphQLList(BuildingOBJ),
      description: "List of all buildings",
      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM buildings`
        );
        console.log(rows);
        return rows;
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

    battery: {
      type: BatteryOBJ,
      description: "A Battery",

      args: {
        id: { type: GraphQLInt },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM batteries WHERE id = ${args.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    },

    column: {
      type: ColumnOBJ,
      description: "A column",

      args: {
        id: { type: GraphQLInt },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM columns WHERE id = ${args.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    },

    elevator: {
      type: ElevatorOBJ,
      description: "An elevator",

      args: {
        id: { type: GraphQLInt },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM elevators WHERE id = ${args.id}`
        );
        console.log(rows[0]);
        return rows[0];
      },
    },
    
    employee: {
      type: EmployeeOBJ,
      description: "A building",

      args: {
        id: { type: GraphQLInt },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM employees WHERE id = ${args.id}`
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

    customerEmail: {
      type: CustomerOBJ,
      description: "A customer",

      args: {
        email: { type: GraphQLString },
      },

      resolve: async (parent, args) => {
        const [rows, fields] = await connectio.query(
          `SELECT * FROM customers WHERE email = "${args.email}"`
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

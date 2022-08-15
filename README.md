# Rocket_Elevators_GraphQL
 
TO use the program, you must write queries. 
 
this program answers three main questions, being :

1.Retrieving the address of the building, the beginning and the end of the intervention for a specific intervention.
 
2.Retrieving customer information and the list of interventions that took place for a specific building

3.Retrieval of all interventions carried out by a specified employee with the buildings associated with these interventions including the details (Table BuildingDetails) associated with these buildings.

in order you may answer the question by writing the following query @ https://rocketelevatorsgraphqlspireee.herokuapp.com/graphql

```
1. {
      building(id:1){
        addressOfBuilding
        intervention{
          interventionDateStart
          interventionDateEnd
        }
      }
    }

2. {
    customer(id:1){
      building{
        intervention{
          interventionDateStart
          interventionDateEnd
          result
          report
          status
          employee_id
          building_id
          batterie_id
          column_id
          elevator_id
        }
      }
    }
  }
  
  ps - each building currently only have 1 intervention 


3. {
        employee(id:1){
         intervention{
          building{
            interventionDateStart
          }
        }	
      }
    }

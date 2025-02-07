import express from 'express';
import { buildingController } from '../controllers/building.controller.js';
import { floorController } from '../controllers/floor.controller.js';
import { roomController } from '../controllers/room.controller.js';

import { login, register, logout } from '../controllers/user.controller.js';
import { createEvent, getLiveEvents } from '../controllers/Event.controller.js';


const router = express.Router();

// user
router.post('/auth/register' , register);
router.post('/auth/login' , login)
router.post('/auth/logout', logout)

//building
router.post('/building/create', buildingController.create);
router.get('/building/get-all-building', buildingController.getAll); 
router.get('/building/search-nearby', buildingController.searchByLocation); 
router.get('/building/:id', buildingController.getById);
router.put('/building/:id', buildingController.update); 
router.delete('/building/delete/:id', buildingController.delete); 


//floor
router.post('/floor/create', floorController.create); 
router.get('/floor/:buildingId', floorController.getAllInBuilding);
router.get('/floor/details/:id', floorController.getById); 
router.put('/floor/:id', floorController.update);
router.delete('/floor/:id', floorController.delete);

//classroom
router.post('/room/create', roomController.create); 
router.get('/room/:floorId', roomController.getAllInFloor);
router.get('/room/details/:id', roomController.getById); 
router.put('/room/:id', roomController.update); 
router.delete('/room/:id', roomController.delete);

// live event
// router.get('/live' , getLiveEvents);
// router.post('/live/create' , createEvent);

// route
// router.get('/route/findPath', findPath)
// router.get('/route/createPath' , createPath)


//map direction
// router.get('/map/search-nearby', searchNearby);
// router.get('/map/find-route',  findRoute);
// router.post('/map/get-direction', getDirections);


export default router;

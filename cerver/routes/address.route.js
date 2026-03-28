import express from 'express';
import { createAddressController, getUserAddressesController, updateAddressController, deleteAddressController } from '../controllers/address.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Route to create a new address for the authenticated user
router.post('/', auth, createAddressController);

// Route to get all addresses for the authenticated user
router.get('/', auth, getUserAddressesController);

// Route to update a specific address by ID for the authenticated user
router.put('/:id', auth, updateAddressController);

// Route to delete (soft delete) a specific address by ID for the authenticated user
router.delete('/:id', auth, deleteAddressController);

export default router;

import { Router } from 'express';
import { CarritoController } from '../controller/carrito.controller.js';
export const router=Router()

router.post('/', CarritoController.createCart);
router.post('/:cid/product/:pid', CarritoController.addProductToCart);
router.delete('/:cid/product/:pid', CarritoController.deleteProductToCart);
router.delete('/:cid', CarritoController.deletedCart);
  

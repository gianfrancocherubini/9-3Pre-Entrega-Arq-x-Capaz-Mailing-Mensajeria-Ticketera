// import { CarritoMongoDao } from "../dao/carritoDao.js";
// const cm = new CarritoMongoDao();
import { ticketMongoDao } from "../dao/ticketDao.js";
import { CarritoService } from "../repository/carrito.service.js";
import { ProductsService } from "../repository/products.service.js";
const productService = new ProductsService();
const carritoService = new CarritoService();
const ticketDao = new ticketMongoDao();

 export class CarritoController {
    constructor(){}

    static async createCart(req, res) {
        try {
            const newCart = await carritoService.createCart();
            console.log('Carrito creado:', newCart);
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ success: true, message: 'Carrito creado correctamente.', cart: newCart });
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al crear el carrito.' });
        }
    }

    static async getCartById(req,res){
        try {
            const cartId = req.params.cid;
            
            if (!cartId) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se debe proporcionar un ID de carrito válido.' });
                console.log('Se debe proporcionar un ID de carrito válido.');
                return;
            }
            
            const cart = await carritoService.cartById(cartId);
            
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({ error: 'Carrito no encontrado.' });
                return;
            }
            const items = cart.items;

            const totalCartPrice = () => {
                let total = 0;
                items.forEach(item => {
                    total += item.product.price * item.quantity;
                });
                return total.toFixed(2);
            };
    
            let usuario = req.session.usuario;
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('carrito', {carts : cart, usuario, login : true, totalCartPrice: totalCartPrice}) ;
            console.log('Carrito:', cart._id , 'con los items:', cart.items)
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al obtener el carrito.' });
        }
    }

    static async addProductToCart(req,res){

        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;
        
            if (!cartId || !productId) {
              res.setHeader('Content-Type', 'application/json');
              res.status(400).json({ error: 'Se deben proporcionar un ID de carrito y un ID de producto válidos.' });
              return;
            }
        
            const updatedCart = await carritoService.addProduct(cartId, productId, quantity);
            console.log(`Producto : ${productId} agregado correctamente a Carrito : ${cartId}`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(updatedCart);
          } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
          }       
    }

    static async deleteProductToCart(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
    
            if (!cartId || !productId) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se deben proporcionar un ID de carrito y un ID de producto válidos.' });
                return;
            }
    
            const deleteProductToCart = await carritoService.deleteProduct(cartId, productId);
            console.log(`Producto : ${productId} eliminado de ${cartId} correctamente`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({message: `Producto : ${productId} eliminado de ${cartId} correctamente`});
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
        }
    }

    static async deletedCart (req,res){
        try {
            const cartId = req.params.cid;
                
            if (!cartId) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se deben proporcionar un ID de carrito válido.' });
                return;
            }
    
            const deletedCart = await carritoService.cartDelete(cartId);
            console.log(`Carrito: ${cartId} eliminado correctamente`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(`Carrito : ${cartId} eliminado correctamente`);
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
        }
    }

    static async purchaseTicket(req, res) {
        try {
            const usuario = req.session.usuario;
            const cartId = req.params.cid;
            const cart = await carritoService.cartById(cartId);
    
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({ error: 'Carrito no encontrado.' });
                return;
            }
    
            const productsCarts = cart.items.slice();
            let totalAmount = 0;

            productsCarts.forEach(async item => {
                totalAmount += item.product.price * item.quantity;

                if(item.quantity <= item.product.stock){
                    const updatedStock = item.product.stock - item.quantity;
                    await productService.update(item.product._id, { stock: updatedStock });
                }
                if(item.quantity === item.product.stock){
                    const updatedStock = item.product.stock - item.quantity;
                    await productService.update(item.product._id, { stock: updatedStock, deleted: true });
                }
                
            });
                

            totalAmount = totalAmount.toFixed(2); 
    
            const ticket = await ticketDao.creaTicket(usuario.email, totalAmount);
    
            const ticketDetails = {
                purchaser: usuario.email,
                code: ticket.code,
                amount: totalAmount,
                purchase_datetime: ticket.purchase_datetime,
            };

            for (const item of productsCarts) {
                await carritoService.deleteProduct(cartId, item.product._id);
            }
    
    
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ ticket: ticketDetails, message: 'Ticket generado correctamente' });
            console.log(ticketDetails);
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al generar ticket.' });
        }
    }

}

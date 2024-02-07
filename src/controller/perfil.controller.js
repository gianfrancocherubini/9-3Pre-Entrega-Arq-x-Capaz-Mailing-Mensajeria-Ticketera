export class PerfilController {
    constructor(){}

    static async perfilUsuario(req,res){

    let usuario = req.session.usuario;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('perfil', { usuario, login: true });
    
    }

}
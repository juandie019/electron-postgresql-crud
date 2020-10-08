const {BrowserWindow, Notification} = require('electron')
const {getConnection} = require('./database')

async function createProduct(p){
    try{
        const conn = await getConnection();
        const query = {
            text: 'INSERT INTO productos(nombre, precio, descripcion) VALUES($1, $2, $3) RETURNING id',
            values: [p.name, parseFloat(p.price), p.description],
        }

        const result = await conn.query(query)
        new Notification({
            title:'Electron CRUD',
            body: 'Se guardo el producto ' + p.name
        }).show();

        p.id = result.rows[0].id;
        return p;
    }catch(error){
        console.log(error)
    }
}

async function deleteProduct(productoId){
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM productos WHERE id = ' + productoId);
    return result;
}

async function editProduct(producto){
    const conn = await getConnection();
    console.log(producto);
    const query = {
     text: "UPDATE productos SET nombre = ($1), precio = ($2), descripcion = ($3) WHERE id=($4)",
     values: [producto.name, producto.price, producto.description, producto.id]
    }
    const response = await conn.query(query);
    return response;
}

async function getProducts(){
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM productos ORDER BY id DESC');

    return results.rows;
}

async function getProductsById(productoId){
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM productos WHERE id = ' + productoId)
    return result.rows[0];
}

let window

function createWindow(){
    window = new BrowserWindow({
        width: 800,
        height:600,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    window.loadFile('src/ui/index.html');
}

module.exports = {
    createWindow,
    createProduct,
    getProducts,
    deleteProduct,
    getProductsById,
    editProduct
}

const { remote } = require("electron");
const main = remote.require("./main");

const productForm = document.getElementById('product_form');
const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const productsList = document.getElementById('products');
const btn = document.getElementById('btn_guardar');

let products = [];
let eddtingStatus = false;
let productoId = 0;

productForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const newProduct ={
        name: productName.value,
        price: productPrice.value,
        description: productDescription.value
    }

    if(!eddtingStatus)
      result = await main.createProduct(newProduct)
    else{
      newProduct.id = productoId;
      result = await main.editProduct(newProduct)

      productoId = 0;
      eddtingStatus=false;
    }

    productForm.reset();
    productName.focus();

    await getProducts();
});

const getProducts = async() => {
    products = await main.getProducts();
    console.log(products)
    renderProducts()
}


async function deleteProduct(id){
  const response = confirm("Se borrara el producto")
  if(response){
    await main.deleteProduct(id);
    await getProducts();
  }
}

async function editProduct(id){
  const product = await main.getProductsById(id);

  productoId = product.id;
  eddtingStatus = true;

  productName.value = product.nombre;
  productPrice.value = product.precio;
  productDescription.value = product.descripcion;
}

function renderProducts(){
  productsList.innerHTML = '';
  
  products.forEach(product => {
      productsList.innerHTML += `
      <div class="card card-body my-2 animated fadeInLeft">
        <h4>${product.nombre}</h4>
        <p>${product.descripcion}</p>
        <h3>${product.precio}$</h3>
        <p>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">
          DELETE
        </button>
        <button class="btn btn-primary btn-sm" onclick="editProduct('${product.id}')">
          EDIT 
        </button>
        </p>
      </div>
      `;
  });
}

async function init(){
  await getProducts()
}

init();
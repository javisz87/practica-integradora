import Product from '../model/producto.model.js'; // Importa el modelo Product
import Carts from '../model/cart.model.js'; // Importa el modelo Cart
import Users from '../model/user.model.js'; // Importa el modelo User
import Tickets from '../model/ticket.model.js'; // Importa el modelo Tickets
import Message from '../model/message.model.js'; // Importa el modelo Message

//Realiza una búsqueda paginada de productos en la base de datos, con opción de filtrar por marca y ordenar por precio.
export const searchProducts = async (page = 1, limit = 10, marca = '', orden = 'asc') => {
    // Calcular el número de documentos a omitir según la página actual y el límite de productos por página.
    const skip = (page - 1) * limit;

    // Construir la consulta de búsqueda en función de la marca proporcionada.
    let query = {};
    if (marca) {
        query.marca = marca;
    }

    // Definir el orden de los resultados según el parámetro de orden.
    let sort = { precio: orden === 'asc' ? 1 : -1 };

    // Obtener el número total de productos que coinciden con la consulta sin aplicar el límite de paginación.
    const totalProducts = await Product.countDocuments(query);

    // Calcular el número total de páginas necesarias para mostrar todos los productos con el límite de productos por página.
    const totalPages = Math.ceil(totalProducts / limit);

    // Realizar la consulta a la base de datos para obtener los productos que cumplen con los criterios de búsqueda.
    const products = await Product.find(query).sort(sort).skip(skip).limit(limit);

    // Convertir los productos obtenidos en un array de JavaScript seleccionando solo los campos necesarios.
    const productosJS = products.map(product => {
        return {
            _id: product._id,
            code: product.code,
            estado: product.estado,
            cantidad: product.cantidad,
            categoria: product.categoria,
            id: product.id,
            titulo: product.titulo,
            descripcion: product.descripcion,
            marca: product.marca,
            precio: product.precio,
            demografia: product.demografia,
            imagen: product.imagen,
        };
    });

    // Retornar un objeto con los productos encontrados, la información de paginación y la cantidad total de productos.
    return {
        productos: productosJS,
        pagination: {
            totalProducts: totalProducts,
            totalPages: totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
        }
    };
};

//Busca un producto por su ID en la base de datos, con opción de filtrar por marca y ordenar por precio.
export const searchProductsPorId = async (idProducto, marca = '', orden = 'asc') => {
    try {
        // Definir el filtro de búsqueda inicial basado en el ID del producto.
        let filtro = { id: idProducto };
        if (marca) {
            filtro.marca = marca;
        }

        // Realizar la consulta a la base de datos para encontrar productos que cumplan con el filtro.
        const productos = await Product.find(filtro).sort({ precio: orden });

        // Verificar si se encontraron productos que coincidan con el filtro.
        if (!productos.length) {
            console.error(`No se encontró ningún producto con id ${idProducto}.`);
            return null;
        }

        console.log("Productos encontrados:");

        // Convertir los productos obtenidos en un array de objetos JavaScript seleccionando solo los campos necesarios.
        const productosJS = productos.map(producto => {
            return {
                id: producto.id,
                titulo: producto.titulo,
                descripcion: producto.descripcion,
                code: producto.code,
                precio: producto.precio,
                estado: producto.estado,
                cantidad: producto.cantidad,
                marca: producto.marca,
                categoria: producto.categoria,
                demografia: producto.demografia,
                imagen: producto.imagen
            };
        });

        // Retornar los productos encontrados en formato JavaScript.
        return productosJS;
    } catch (error) {
        console.error(`Error al buscar los productos: ${error.message}`);
        return null;
    }
};

//Busca un producto por su ID en la base de datos y lo devuelve como objeto JavaScript.
export const searchProductsPorId2 = async (idProducto) => {
    try {
        // Buscar el producto en la base de datos por su ID.
        const producto = await Product.findOne({ id: idProducto });

        // Verificar si se encontró el producto.
        if (!producto) {
            console.error(`No se encontró un producto con id ${idProducto}.`);
            return null;
        }

        console.log("Producto encontrado:");

        // Convertir el producto a un objeto JavaScript seleccionando solo los campos necesarios.
        const productoJS = {
            id: producto.id,
            titulo: producto.titulo,
            descripcion: producto.descripcion,
            code: producto.code,
            precio: producto.precio,
            estado: producto.estado,
            cantidad: producto.cantidad,
            marca: producto.marca,
            categoria: producto.categoria,
            demografia: producto.demografia,
            imagen: producto.imagen,
            owner: producto.owner
        };

        // Retornar el producto encontrado en formato JavaScript.
        return productoJS;
    } catch (error) {
        console.error(`Error al buscar el producto: ${error.message}`);
        return null;
    }
};

//Busca un carrito por su ID en la base de datos y devuelve sus datos como objeto JavaScript (devuelvo solo los ids).
export const searchCartsPorId = async (idCarrito) => {
    try {
        // Buscar el carrito en la base de datos por su ID.
        const carrito = await Carts.findOne({ id: idCarrito });

        // Verificar si se encontró el carrito.
        if (!carrito) {
            console.error(`No se encontró un carrito con id ${idCarrito}.`);
            return null;
        }

        console.log("Carrito encontrado:");
        console.log(carrito);

        // Convertir el carrito a un objeto JavaScript, incluyendo solo los IDs de los productos.
        const carritoJS = {
            id: carrito.id,
            ids: carrito.products.map(producto => producto.id) // Obtener los IDs de los productos en el carrito
        };

        // Retornar el carrito encontrado en formato JavaScript.
        return carritoJS;
    } catch (error) {
        console.error(`Error al buscar el carrito: ${error.message}`);
        return null;
    }
};

//Busca un carrito por su ID en la base de datos y devuelve sus datos como objeto JavaScript (devuelvo todo el producto).
export const searchCartsPorId2 = async (idCarrito) => {
    try {
        // Buscar el carrito en la base de datos por su ID.
        const carrito = await Carts.findOne({ id: idCarrito });

        // Verificar si se encontró el carrito.
        if (!carrito) {
            console.error(`No se encontró un carrito con id ${idCarrito}.`);
            return null;
        }

        console.log("Carrito encontrado:");
        console.log(carrito);

        // Convertir el carrito a un objeto JavaScript, incluyendo todos los productos en él.
        const carritoJS = {
            id: carrito.id,
            products: carrito.products, // Obtener todos los productos en el carrito
        };

        // Retornar el carrito encontrado en formato JavaScript.
        return carritoJS;
    } catch (error) {
        console.error(`Error al buscar el carrito: ${error.message}`);
        return null;
    }
};

//Crea un nuevo carrito en la base de datos con una ID aleatoria y sin productos.
export const crearCarrito = async () => {
    try {
        // Generar una ID aleatoria para el nuevo carrito
        const idCarrito = Math.floor(Math.random() * 1000);

        // Crear un nuevo documento de carrito con la ID generada y sin productos
        const nuevoCarrito = new Carts({
            id: idCarrito,
            productos: []
        });

        // Guardar el nuevo carrito en la base de datos
        await nuevoCarrito.save();

        console.log(`Carrito creado correctamente.`);

        // Retornar la ID del carrito creado
        return nuevoCarrito.id;
    } catch (error) {
        console.error(`Error al crear el carrito: ${error.message}`);
        return null; // Retorna null en caso de error
    }
};

//Elimina un producto específico de un carrito por sus IDs.
export const deleteProductoDelCarritoPorId = async (idCarrito, idProducto) => {
    try {
        // Buscar el carrito por su ID en la base de datos
        const carrito = await Carts.findOne({ id: idCarrito });
        if (!carrito) {
            console.error(`No se encontró un carrito con id ${idCarrito}.`);
            return;
        }

        // Filtrar los productos del carrito para eliminar el producto con la ID especificada
        carrito.products = carrito.products.filter(prod => prod.id !== idProducto);

        // Guardar el carrito actualizado en la base de datos
        await carrito.save();

        console.log(`Producto con id ${idProducto} eliminado del carrito con id ${idCarrito}.`);
    } catch (error) {
        console.error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
};

//Modifica un campo específico de un producto por su ID.
export const modificarProductoPorId = async (id, campo, valor) => {
    try {
        // Verificar si el campo a modificar es 'id' o 'code' (no permitidos para modificación)
        if (campo === 'id' || campo === 'code') {
            console.error(`No se puede modificar el campo ${campo}.`);
            return;
        }

        // Crear un objeto de actualización con el campo y valor proporcionados
        const update = { [campo]: valor };

        // Buscar el producto por su ID y actualizar el campo especificado
        const producto = await Product.findOneAndUpdate({ id: id }, update, { new: true });

        // Verificar si se encontró el producto y se realizó la modificación
        if (!producto) {
            console.error(`No se encontró un producto con id ${id}.`);
            return;
        }

        console.log(`Producto con id ${id} modificado correctamente.`);
    } catch (error) {
        console.error(`Error al modificar el producto con id ${id}: ${error.message}`);
    }
};

//Modifica un campo específico de un producto en un carrito por sus IDs.
export const modificarCarritoPorId = async (idCar, idPro, campo, nuevoValor) => {
    try {
        // Definir el filtro para encontrar el carrito por su id y el producto por su id en el array de productos
        const filter = { id: idCar, "products.id": idPro };

        // Definir la actualización para modificar el campo del producto
        const update = { $set: { [`products.$.${campo}`]: nuevoValor } };

        // Realizar la actualización en la base de datos
        const carritoActualizado = await Carts.findOneAndUpdate(filter, update, { new: true });

        // Verificar si se encontró el carrito y se realizó la modificación
        if (!carritoActualizado) {
            console.error(`No se encontró un carrito con id ${idCar} o un producto con id ${idPro} en el carrito.`);
            return;
        }

        console.log(`Producto con id ${idPro} en el carrito con id ${idCar} actualizado.`);
    } catch (error) {
        console.error(`Error al modificar el producto en el carrito: ${error.message}`);
    }
};

//Agrega un producto al carrito especificado.
export const cargarCarrito = async (idCarrito, idProducto) => {
    try {
        // Obtener el producto por su id
        const producto = await Product.findOne({ id: idProducto });
        if (!producto) {
            console.error(`No se encontró un producto con id ${idProducto}.`);
            return;
        }

        // Verificar que la cantidad del producto sea mayor que cero
        if (producto.cantidad === 0) {
            console.error(`El producto con id ${idProducto} no está disponible.`);
            return;
        }

        // Obtener el carrito por su id
        let carrito = await Carts.findOne({ id: idCarrito });
        if (!carrito) {
            console.error(`No se encontró un carrito con id ${idCarrito}.`);
            return;
        }

        // Verificar si el producto ya está en el carrito
        const productoEnCarrito = carrito.products.find(prod => prod.id === idProducto);
        if (productoEnCarrito) {
            // Incrementar la cantidad del producto en el carrito
            await modificarCarritoPorId(idCarrito, idProducto, 'cantidad', productoEnCarrito.cantidad + 1);
            console.log(`Cantidad del producto con id ${idProducto} en el carrito con id ${idCarrito} incrementada.`);
            return;
        }

        // Agregar el producto al carrito con cantidad inicial 1
        const update = {
            $push: {
                products: {
                    id: producto.id,
                    titulo: producto.titulo,
                    cantidad: 1
                }
            }
        };
        await Carts.findOneAndUpdate({ id: idCarrito }, update, { new: true });
        console.log(`Producto con id ${idProducto} agregado al carrito con id ${idCarrito}.`);

    } catch (error) {
        console.error(`Error al cargar el producto en el carrito: ${error.message}`);
    }
};

//Elimina todos los productos de un carrito específico por su ID.
export const deleteAllProductosPorId = async (idCarrito) => {
    try {
        // Buscar el carrito por su ID
        const carrito = await Carts.findOne({ id: idCarrito });
        if (!carrito) {
            console.error(`No se encontró un carrito con id ${idCarrito}.`);
            return;
        }

        // Eliminar todos los productos del array 'products' del carrito
        carrito.products = [];
        await carrito.save();

        console.log(`Todos los productos del carrito con id ${idCarrito} han sido eliminados.`);
    } catch (error) {
        console.error(`Error al eliminar los productos del carrito: ${error.message}`);
    }
};

//Busca un usuario por su ID.
export const searchUserPorId = async (idUser) => {
    try {
        // Buscar el usuario por su ID
        const user = await Users.findOne({ _id: idUser });
        if (!user) {
            console.error(`No se encontró un usuario con id ${idUser}.`);
            return null;
        }

        // Convertir el usuario a un objeto JavaScript con las propiedades requeridas
        const userJS = {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            cart: user.cart,
            age: user.age,
            rol: user.rol
        };

        return userJS;
    } catch (error) {
        console.error(`Error al buscar el usuario: ${error.message}`);
        return null;
    }
};

//Valida las credenciales de un usuario.
export const userValidation = async (email, password) => {
    try {
        // Buscar un usuario que coincida con el correo electrónico y la contraseña proporcionados
        const usuario = await Users.findOne({ email, password });

        // Si se encuentra el usuario, retornar su ID
        if (usuario) {
            return usuario._id;
        }

        // Si no se encuentra el usuario, retornar null
        return null;
    } catch (error) {
        console.error(`Error al buscar usuario: ${error.message}`);
        return null;
    }
};

//Middleware para asegurar la autenticación del usuario.
export const ensureAuthenticated = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (req.isAuthenticated()) {
        // Si el usuario está autenticado, continuar con la siguiente función de middleware
        return next();
    }
    // Si el usuario no está autenticado, redirigir al login
    res.redirect('/log');
};

//Middleware para asegurar que el usuario esté autenticado como usuario normal.
export const ensureUser = (req, res, next) => {
    // Verificar si el usuario está autenticado y tiene el rol de "user"
    if (req.isAuthenticated() && req.user.rol === 'user') {
        // Si el usuario está autenticado y es usuario normal, continuar
        return next();
    } else {
        // Si el usuario no está autenticado, redirigir al login
        res.redirect('/log');
    }
};

//Middleware para asegurar que el usuario esté autenticado como administrador.
export const ensureAdmin = (req, res, next) => {
    // Verificar si el usuario está autenticado y tiene el rol de "admin"
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        // Si el usuario está autenticado y es administrador, continuar
        return next();
    } else {
        // Si el usuario no está autenticado, redirigir al login
        res.redirect('/log');
    }
};

//Middleware para asegurar que el usuario esté autenticado como administrador.
export const ensurePremium = (req, res, next) => {
    // Verificar si el usuario está autenticado y tiene el rol de "admin"
    if (req.isAuthenticated() && req.user.rol === 'premium') {
        // Si el usuario está autenticado y es administrador, continuar
        return next();
    } else {
        // Si el usuario no está autenticado, redirigir al login
        res.redirect('/log');
    }
};

// Middleware para asegurar que el usuario esté autenticado como premium o Admin.
export const ensureAdminPremium = (req, res, next) => {
    // Verificar si el usuario está autenticado y tiene el rol de "admin"
    if (req.isAuthenticated() && req.user.rol === 'premium'|| req.user.rol === 'admin') {
        // Si el usuario está autenticado y es administrador, continuar
        return next();
    } else {
        // Si el usuario no está autenticado, redirigir al login
        res.redirect('/log');
    }
};

//Crea un nuevo ticket de compra en la base de datos.
export const crearTiket = async (costo, correo) => {
    try {
        // Crear un nuevo objeto Ticket con datos aleatorios y la información proporcionada
        const nuevoTiket = new Tickets({
            code: Math.floor(Math.random() * 1000), // Genera una ID aleatoria
            purchase_datetimer: new Date(), // Asigna la fecha y hora actual
            amount: costo, // Costo total de la compra
            purchase: correo // Correo electrónico del usuario
        });

        // Guardar el nuevo ticket en la base de datos
        await nuevoTiket.save();
        console.log(`Ticket creado correctamente.`);

        // Retorna el código del ticket creado
        return nuevoTiket.code;
    } catch (error) {
        // Captura cualquier error y muestra un mensaje de error en la consola
        console.error(`Error al crear el Ticket: ${error.message}`);
        return null; // Retorna null en caso de error
    }
};

//Calcula el costo total del carrito sumando el precio de cada producto.
export const calcularCosto = async (productosFinales) => {
    try {
        let costoTotal = 0;

        // Calcular el costo total sumando el precio de cada producto en productosFinales
        for (const producto of productosFinales) {
            costoTotal += producto.precio * producto.cantidad;
        }

        // Mostrar el costo total en la consola
        console.log(`Costo total del carrito: ${costoTotal}`);

        // Retorna el costo total calculado
        return costoTotal;

    } catch (error) {
        // Captura cualquier error y muestra un mensaje de error en la consola
        console.error(`Error al calcular coste del carrito: ${error.message}`);
        return null; // Retorna null en caso de error
    }
};

//Busca el correo electrónico de un usuario asociado a un número de carrito.
export const buscarCorreoPorNumeroDeCart = async (numeroDeCart) => {
    try {
        // Buscar al usuario con el número de carrito proporcionado
        const usuarioEncontrado = await Users.findOne({ cart: numeroDeCart }).exec();

        if (!usuarioEncontrado) {
            console.log(`Usuario con número de carrito ${numeroDeCart} no encontrado.`);
            return null;
        }

        // Mostrar el correo del usuario encontrado en la consola
        console.log(`Correo del usuario encontrado: ${usuarioEncontrado.email}`);

        // Devuelve el correo electrónico del usuario encontrado
        return usuarioEncontrado.email;
    } catch (error) {
        // Captura cualquier error y muestra un mensaje de error en la consola
        console.error(`Error al buscar el correo del usuario: ${error.message}`);
        return null; // Retorna null en caso de error
    }
};

//Busca un producto por su ID en la base de datos y devuelve su precio.
export const buscarProductoPorId = async (id) => {
    try {
        // Buscar el producto por su ID en la base de datos
        const productoEncontrado = await Product.findOne({ id: id }).exec();

        if (productoEncontrado) {
            // Mostrar el producto encontrado en la consola
            console.log(`Producto encontrado: ${productoEncontrado}`);

            // Devuelve solo el precio del producto encontrado
            return productoEncontrado.precio;
        } else {
            // Mostrar un mensaje indicando que el producto no fue encontrado
            console.log(`Producto con id ${id} no encontrado.`);
            return null; // Retorna null si no se encuentra el producto
        }
    } catch (error) {
        // Capturar cualquier error y mostrar un mensaje de error en la consola
        console.error(`Error al buscar el producto: ${error.message}`);
        return null; // Retorna null en caso de error
    }
};

//Función para obtener información detallada de cada producto en un carrito,
export const productosVender = async (id) => {
    try {
        // Obtener los detalles del carrito usando su ID
        const carrito = await searchCartsPorId2(id);
        if (!carrito) {
            console.error(`No se encontró un carrito con id ${id}.`);
            return null;
        }

        console.log("Productos del carrito:");
        console.log(carrito.products);

        // Inicializar un array para almacenar la información detallada de los productos
        const productosFinales = [];
        for (const item of carrito.products) {
            // Buscar cada producto en la base de datos por su ID
            const producto = await searchProductsPorId2(item.id);
            if (!producto) {
                console.error(`No se encontró un producto con id ${item.id}.`);
                continue; // Continuar con el siguiente producto si no se encuentra
            }

            // Verificar disponibilidad del producto
            if (producto.cantidad >= item.cantidad) {
                // Si hay suficiente cantidad disponible, agregar los detalles del producto al array final
                productosFinales.push({
                    id: producto.id,
                    titulo: producto.titulo,
                    cantidad: item.cantidad,
                    precio: producto.precio,
                });
            } else {
                console.error(`Producto con id ${item.id} no tiene suficiente cantidad en stock.`);
            }
        }

        console.log("Productos finales:");
        console.log(productosFinales);

        return productosFinales; // Devolver el array de productos con detalles
    } catch (error) {
        console.error(`Error al calcular coste del carrito: ${error.message}`);
        return null; // Devolver null si hay un error
    }
};

//Función para actualizar el stock de productos después de una venta.
export const extraigoStock = async (productos) => {
    try {
        for (const producto of productos) {
            // Buscar el producto en la base de datos por su ID
            const productoDB = await searchProductsPorId2(producto.id);

            if (!productoDB) {
                console.error(`Producto con ID ${producto.id} no encontrado en la base de datos.`);
                continue; // Continuar con el siguiente producto si no se encuentra en la base de datos
            }

            // Verificar que la cantidad en stock sea mayor o igual a la cantidad solicitada
            if (productoDB.cantidad >= producto.cantidad) {
                // Restar la cantidad solicitada del stock del producto
                productoDB.cantidad -= producto.cantidad;
                await modificarProductoPorId(producto.id, 'cantidad', productoDB.cantidad);
                console.log(`Stock actualizado para el producto con ID ${producto.id}`);
            } else {
                console.error(`No hay suficiente stock para el producto con ID ${producto.id}`);
            }
        }
    } catch (error) {
        console.error(`Error al actualizar el stock: ${error.message}`);
    }
};

//Función para crear producto
export const cargarProducto = async (producto) => {
    const intentosMaximos = 3; // Número máximo de intentos permitidos
    let contadorIntentos = 0;

    while (contadorIntentos < intentosMaximos) {
        let nuevoId = Math.floor(Math.random() * 1000); // Genera un nuevo id al azar
        try {
            const nuevoProducto = new Product({
                id: nuevoId,
                titulo: producto.titulo,
                descripcion: producto.descripcion,
                code: producto.code,
                precio: producto.precio,
                estado: true, // Estado siempre se establece en true
                cantidad: producto.cantidad,
                marca: producto.marca,
                categoria: producto.categoria,
                demografia: producto.demografia,
                imagen: producto.imagen,
                owner: producto.owner
            });
            await nuevoProducto.save();
            console.log(`Producto con id ${nuevoId} cargado a Atlas.`);
            break; // Salir del bucle si se guardó correctamente
        } catch (error) {
            if (error.code === 11000 && error.message.includes("id")) {
                console.error(`Error al cargar el producto con id ${nuevoId}: ${error.message}`);
            } else {
                console.error(`Error al cargar el producto con id ${nuevoId}: ${error.message}`);
                break; // Salir del bucle en caso de otro tipo de error
            }
        }
        contadorIntentos++;
    }

    if (contadorIntentos === intentosMaximos) {
        console.error(`Se alcanzó el número máximo de intentos (${intentosMaximos}) sin poder cargar el producto.`);
    }
};

//Función para crear un mensaje
export const createMessage = async (nameData, messageData) => {
    try {
        const nombre = nameData;
        const mensaje = messageData;

        // Crea un nuevo mensaje con los datos proporcionados
        const newMessage = new Message({
            user: nombre,
            message: mensaje
        });

        // Guarda el nuevo mensaje en la base de datos
        await newMessage.save();

        return newMessage;
    } catch (error) {
        console.error(error);
        throw new Error('Error al crear el mensaje');
    }
};

//Función para buscar todos los mensajes
export const searchMessages = async () => {
    try {
        // Busca todos los mensajes en la base de datos
        const messages = await Message.find();

        // Convertir los mensajes a un array de JavaScript
        const messagesJS = messages.map(message => {
            return {
                user: message.user,
                message: message.message,
                date: message.date,
            };
        });

        return messagesJS;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los mensajes');
    }
};

//Función para borrar un producto
export const deleteProductsPorId = async (idProducto) => {
    try {
        const result = await Product.deleteOne({ id: idProducto });
        if (result.deletedCount === 0) {
            console.error(`No se encontró un producto con id ${idProducto}.`);
            return;
        }
        console.log(`Producto con id ${idProducto} eliminado.`);
    } catch (error) {
        console.error(`Error al eliminar el producto: ${error.message}`);
    }
};

// Función para generar un código único de 6 caracteres al azar
export function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Función para obtener un elemento aleatorio de un array
export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
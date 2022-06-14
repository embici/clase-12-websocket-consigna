const { Router } = require('express');
const Container = require('../container');

const prodContainer = new Container('productos.txt');

prodContainer.init();

const router = Router();

router.get('/', (req, res)=>{
    res.send(prodContainer.data)
})

router.get('/:id', async (req, res)=>{
    const { id } = req.params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
        return res.status(400).send({ error: 'El parámetro debe ser un número' });
    }

    if (idNumber > prodContainer.data.length) {
        return res.status(400).send({ error: 'El parámetro está fuera de rango' });
    }

    if (idNumber < 0) {
        return res.status(400).send({ error: 'El parámetro debe ser mayor a cero' });
    }

    const person = await prodContainer.getById(idNumber);

    if (!person) {
        return res.status(400).send({ error: `El producto con el id: ${id} no existe` });
    }

    return res.send(person)
})

router.post('/', async (req, res)=>{
    const { name, color, price, category } = req.body;

    if (!name || !color || !price || !category) {
        return res.status(400).send({ error: 'Los datos están incompletos' });
    }

    await prodContainer.save({ name, color, price, category });
    await prodContainer.init();

    return res.send({ message: 'Producto agregada exitosamente'})
})

router.put('/:id', async (req, res)=>{
    try {
        const { id } = req.params;
        const { field, value } = req.body;
    
        await prodContainer.editById(Number(id), field, value);
    
        res.send({ message: `El producto con id: ${id} se modificó exitosamente`})
    } catch (error) {
        throw error
    }

})

router.delete('/:id', async (req, res)=>{
    try{
        const { id } = req.params;
        await prodContainer.deleteById(Number(id));
        res.send({ message: `El producto con id: ${id} se elimino con exito`})

    }catch(error){
        throw error
    }
})

module.exports = router;
import {param ,body , validationResult} from "express-validator"

export const verificarValidaciones = (req, res, next) => {
    // Enviar errores de validacion en caso de ocurrir alguno.
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }
    next();
};

export const validarID = param('id').notEmpty().withMessage('El ID no puede estar vacio')
.isInt({gt:0}).withMessage('El ID deber ser un numero entero positvo')
export const validarProducto = [
    body('nombre')
    .notEmpty().withMessage('El nombre no puede estar vacio')
    .isString().withMessage('El nombre debe ser un texto'),
    body('descripcion')
    .isString().withMessage('La descripcion solo puede ser texto'),
    body('precio')
    .notEmpty().withMessage('El precio no puede estar vacio')
    .isFloat({gt:0}).withMessage('El precio debe ser positivo'),
    body('id_categoria')
    .notEmpty().withMessage('debe tener alguna categoria')
    .isFloat({gt:0}).withMessage('Debe ser numero positvo'),
    body('cantidad_disponible')
    .notEmpty().withMessage('Debe asignar alguna cantidad')
    .isFloat({gt:0}).withMessage('Debe ser numero positvo')
]
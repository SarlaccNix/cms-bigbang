// src/routes/homeRoutes.js

import { Router } from 'express';
import payload from 'payload';

const router = Router();

/**
 * GET /api/productos-by-tenant?tenantId=:id
 * GET https://tu-dominio.com/api/productos-by-tenant?tenantId=12345
 */
router.get('/api/productos-by-tenant', async (req, res) => {
    const { tenantId } = req.query;

    // Validación básica del tenantId
    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Parámetro "tenantId" es requerido y debe ser una cadena válida.' });
    }

    try {
        // Buscar el global "Home" asociado al tenant
        const data = await payload.find({
            collection: 'productos',
            limit: 1,
            where: {
                tenant: {
                    equals: tenantId,
                },
            },
        });

        if (data.totalDocs === 0) {
            return res.status(404).json({ error: 'Configuración "Home" no encontrada para el tenant especificado.' });
        }

        // Eliminar ambos campos 'tenant'
        data.docs = data.docs.map(doc => {
            // Eliminar 'tenant' del nivel de la raíz
            const { tenant, ...restOfDoc } = doc;

            // Eliminar 'tenant' dentro de 'imagen'
            const { tenant: tenantImagen, ...restOfImage } = doc.imagen as any;

            return {
                ...restOfDoc,
                imagen: restOfImage // Reasignamos 'imagen' sin el campo 'tenant'
            };
        });

        // Retornar la primera (y única) configuración encontrada
        res.json(data);
    } catch (error) {
        console.error('Error al obtener la configuración "Home" del tenant:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

export default router;

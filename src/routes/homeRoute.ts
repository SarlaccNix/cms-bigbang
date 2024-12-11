// src/routes/homeRoutes.js

import { Router } from 'express';
import payload from 'payload';

const router = Router();

/**
 * GET /api/home
 * Retorna la configuración del global "Home" para el tenant especificado mediante el parámetro de consulta `tenantId`.
 * 
 * Ejemplo de solicitud:
 * GET https://tu-dominio.com/api/home?tenantId=12345
 */
router.get('/api/home-info', async (req, res) => {
    const { tenantId } = req.query;

    // Validación básica del tenantId
    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Parámetro "tenantId" es requerido y debe ser una cadena válida.' });
    }

    try {
        // Buscar el global "Home" asociado al tenant
        const homeGlobal = await payload.find({
            // @ts-ignore
            collection: 'home',
            limit:1,
            where: {
                tenant: {
                    equals: tenantId,
                },
            },
        });

        console.log({ homeGlobal, tenantId });

        if (homeGlobal.totalDocs === 0) {
            return res.status(404).json({ error: 'Configuración "Home" no encontrada para el tenant especificado.' });
        }

        // Retornar la primera (y única) configuración encontrada
        res.json(homeGlobal);
    } catch (error) {
        console.error('Error al obtener la configuración "Home" del tenant:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

export default router;

// src/routes/homeRoutes.js

import { Router } from "express";
import payload from "payload";

const router = Router();

/**
 * GET /api/productos-by-tenant?tenantId=:id
 * GET https://tu-dominio.com/api/productos-by-tenant?tenantId=12345
 */
router.get("/api/contacto-by-tenant", async (req, res) => {
  const { tenantId } = req.query;

  // Validación básica del tenantId
  if (!tenantId || typeof tenantId !== "string") {
    return res
      .status(400)
      .json({
        error:
          'Parámetro "tenantId" es requerido y debe ser una cadena válida.',
      });
  }

  try {
    const data = await payload.find({
      // @ts-ignore
      collection: "contact-us",
      limit: 1,
      where: {
        tenant: {
          equals: tenantId,
        },
      },
    });

    if (data.totalDocs === 0) {
      return res
        .status(404)
        .json({ error: "Contacto no encontrada para el tenant especificado." });
    }

    data.docs = data.docs.map((doc) => {
      // @ts-ignore
      const { tenant, ...rest } = doc;
      return rest;
    });

    // Retornar la primera (y única) configuración encontrada
    res.json(data);
  } catch (error) {
    console.error(
      'Error al obtener la configuración "Home" del tenant:',
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

export default router;

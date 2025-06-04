const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const Joi = require("joi");
const { FechaSQL} = require("./FechaActual");
const router = express.Router();

{/**
  /planes/
  */}
// Esquema de validación con Joi
const PlanSchema = Joi.object({
  Id_Usuario_Alta: Joi.number().required(),
});

// Obtener receta(s) (GET)
router.get("/GenerarListaCompra/:Id_Usuario_Alta", (req, res) => {

  const { Id_Usuario_Alta } = req.params;
  
// Validar entrada (fusionando params y body)
const { error } = PlanSchema.validate({
  Id_Usuario_Alta: Number(Id_Usuario_Alta),
});

if (error) {
  console.log("Error al validar:", error);
  return res.status(400).json({ error: error.details[0].message });
}

  let query = `call migibi.Generar_Lista_Compra(${Id_Usuario_Alta});`;
  // Ejecutar la consulta
  db.query(query, [Id_Usuario_Alta], (err, result) => {
   
    if (err) {
      console.error("Error al obtener lista de compra:", err);
      return res.status(500).send("Error al obtener lista de compra");
    }
    console.log(result);
    res.json(result);
  });
});

router.get("/GenerarPlanRellenarSemanal/:Id_Usuario_Alta", (req, res) => {

    const { Id_Usuario_Alta } = req.params;
    
  // Validar entrada (fusionando params y body)
  const { error } = PlanSchema.validate({
    Id_Usuario_Alta: Number(Id_Usuario_Alta),
  });
  
  if (error) {
    console.log("Error al validar:", error);
    return res.status(400).json({ error: error.details[0].message });
  }
  
    let query = `call migibi.Generar_Plan_Disponible(${Id_Usuario_Alta});`;
    // Ejecutar la consulta
    db.query(query, [Id_Usuario_Alta], (err, result) => {
     
      if (err) {
        console.error("Error al obtener el plan disponible rellenar:", err);
        return res.status(500).send("Error al obtener la plan disponible rellenar");
      }
      console.log(result);
      res.json(result);
    });
  });

router.get("/GenerarPlanRellenarHoy/:Id_Usuario_Alta", (req, res) => {

    const { Id_Usuario_Alta } = req.params;
    
  // Validar entrada (fusionando params y body)
  const { error } = PlanSchema.validate({
    Id_Usuario_Alta: Number(Id_Usuario_Alta),
  });
  
  if (error) {
    console.log("Error al validar:", error);
    return res.status(400).json({ error: error.details[0].message });
  }
  
    let query = `call migibi.Generar_Plan_Disponible_Hoy(${Id_Usuario_Alta});`;
    // Ejecutar la consulta
    db.query(query, [Id_Usuario_Alta], (err, result) => {
     
      if (err) {
        console.error("Error al obtener el plan disponible rellenar:", err);
        return res.status(500).send("Error al obtener la plan disponible rellenar");
      }
      console.log(result);
      res.json(result);
    });
  });

  // Obtener receta(s) (GET)
  router.get("/GenerarPlanEstrictoSemanal/:Id_Usuario_Alta", (req, res) => {
  
      const { Id_Usuario_Alta } = req.params;
      
    // Validar entrada (fusionando params y body)
    const { error } = PlanSchema.validate({
      Id_Usuario_Alta: Number(Id_Usuario_Alta),
    });
    
    if (error) {
      console.log("Error al validar:", error);
      return res.status(400).json({ error: error.details[0].message });
    }
    
      let query = `call migibi.Generar_Plan_Estricto(${Id_Usuario_Alta});`;
      // Ejecutar la consulta
      db.query(query, [Id_Usuario_Alta], (err, result) => {
       
        if (err) {
          console.error("Error al obtener lista de compra:", err);
          return res.status(500).send("Error al obtener lista de compra");
        }
        console.log(result);
        res.json(result);
      });
    });


// Obtener receta(s) (GET)
router.get("/GenerarPlanRellenarHoy/:Id_Usuario_Alta", (req, res) => {

    const { Id_Usuario_Alta } = req.params;
    
  // Validar entrada (fusionando params y body)
  const { error } = PlanSchema.validate({
    Id_Usuario_Alta: Number(Id_Usuario_Alta),
  });
  
  if (error) {
    console.log("Error al validar:", error);
    return res.status(400).json({ error: error.details[0].message });
  }
  
    let query = `call migibi.Generar_Plan_Estricto_Hoy(${Id_Usuario_Alta});`;
    // Ejecutar la consulta
    db.query(query, [Id_Usuario_Alta], (err, result) => {
     
      if (err) {
        console.error("Error al obtener lista de compra:", err);
        return res.status(500).send("Error al obtener lista de compra");
      }
      console.log(result);
      res.json(result);
    });
  });

// Última línea del archivo
module.exports = router;

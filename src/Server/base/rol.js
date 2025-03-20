const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const validator = require('validator');
const xss = require('xss');  
const bcrypt = require('bcrypt');

router.get("/", (req, res) => {
    db.query("SELECT * FROM roles", (err, result) => {
      if (err) {
        console.error("Error al obtener roles:", err);
        return res.status(500).send("Error al obtener roles");
      }
      res.json(result);
    });
  });

  module.exports = router;
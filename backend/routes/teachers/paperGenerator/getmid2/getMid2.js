const express = require('express');
const mid1Router = express.Router();
const authenticate = require('../../../../authenticate');
const cors = require('../../../cors');
const { generatePaperPdf } = require('../../../../utils/paperGeneratorUtil');

mid1Router.use(express.json());

mid1Router
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((req, res) => res.end('GET Operation is not Performed'))
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      await generatePaperPdf({
        req,
        res,
        templatePath: 'routes/teachers/paperGenerator/getmid1/demo.html',
        units: ['u1', 'u2', 'u3'],
        marks: '15',
        seed: 'qpgenerator-mid1'
      });
    } catch (err) {
      next(err);
    }
  })
  .put((req, res) => res.end('PUT Operation is not Performed'))
  .delete((req, res) => res.end('DELETE Operation is not Performed'));

module.exports = mid1Router;

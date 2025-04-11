const express = require('express');
const semRouter = express.Router();
const authenticate = require('../../../../authenticate');
const cors = require('../../../cors');
const questionModel = require('../../../../models/questions');

const fs = require('fs');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

const readFile = utils.promisify(fs.readFile);
const random = require('random');
const seedrandom = require('seedrandom');
random.use(seedrandom('qpgenerator'));

semRouter.use(express.json());

semRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((req, res) => res.end('GET Operation is not Performed'))
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    const getTemplateHtml = async () => {
      try {
        const templatePath = path.resolve(__dirname, 'demo.html');
        return await readFile(templatePath, 'utf8');
      } catch (err) {
        throw new Error("Could not load HTML template");
      }
    };

    const generatePdf = async () => {
      const { id, value, deptYear, deptSem, label, year, month } = req.body;

      const questionData = await questionModel.findById(id);
      if (!questionData) {
        return res.status(404).send("Question set not found");
      }

      const units = ['u1', 'u2', 'u3', 'u4', 'u5'];
      const hasSufficientQuestions = units.every(unit =>
        questionData.easy[unit].length >= 3 &&
        questionData.medium[unit].length >= 5 &&
        questionData.hard[unit].length >= 3
      );

      if (!hasSufficientQuestions) {
        return res.status(403).send("Insufficient number of questions to generate paper");
      }

      const data = {
        code: value,
        regulation: "R15",
        Year: deptYear,
        sem: deptSem,
        subjectname: label,
        subjecttype: 'ACADEMIC',
        time: '3',
        marks: '70',
        year,
        month,
        squestion: [],
        lquestion: []
      };

      // Generate short answer questions
      for (let unit of units) {
        const easyQ = questionData.easy[unit];
        const pick = () => random.int(0, easyQ.length - 1);
        let [a, b] = [pick(), pick()];
        while (a === b) b = pick();
        data.squestion.push(easyQ[a].name, easyQ[b].name);
      }

      // Select random units for medium difficulty questions
      const selectQuestions = new Set();
      const selector = random.uniformInt(0, 5);
      const count = selector();
      while (selectQuestions.size < count) {
        selectQuestions.add(selector());
      }

      for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        if (selectQuestions.has(i)) {
          // Two medium Q pairs
          const medQ = questionData.medium[unit];
          const indices = [...Array(medQ.length).keys()];
          shuffle(indices);

          const q1 = medQ[indices[0]].name;
          const q2 = medQ[indices[1]].name;
          const q3 = medQ[indices[2]].name;
          const q4 = medQ[indices[3]].name;

          data.lquestion.push({
            '1': [q1, q2],
            '2': [q3, q4]
          });
        } else {
          // Two hard questions
          const hardQ = questionData.hard[unit];
          const pick = () => random.int(0, hardQ.length - 1);
          let [a, b] = [pick(), pick()];
          while (a === b) b = pick();

          data.lquestion.push({
            '1': hardQ[a].name,
            '2': hardQ[b].name
          });
        }
      }

      const templateHtml = await getTemplateHtml();

      // Register Handlebars helpers
      handlebars.registerHelper('small', questions => {
        let output = '<div class="questions">';
        output += `<div class="question">1. a) ${questions[0]}</div>`;
        for (let i = 1; i < questions.length; i++) {
          output += `<div class="question">&nbsp;&nbsp;&nbsp;&nbsp;${String.fromCharCode(97 + i)}) ${questions[i]}</div>`;
        }
        output += '</div>';
        return new handlebars.SafeString(output);
      });

      handlebars.registerHelper('large', qSet => {
        let output = '<div class="questions">';
        let qNo = 2;

        qSet.forEach((block, index) => {
          if (selectQuestions.has(index)) {
            for (const key in block) {
              const pair = block[key];
              output += `<div class="question">${qNo}. a) ${pair[0]}</div>`;
              output += '<div class="multi">';
              output += `<span>b) ${pair[1]}</span>`;
              output += '</div>';
              output += `<div class="limiters">${key === '1' ? 'OR' : '***'}</div>`;
              qNo++;
            }
          } else {
            for (const key in block) {
              output += `<div class="question">${qNo}. ${block[key]}</div>`;
              output += `<div class="limiters">${key === '1' ? 'OR' : '***'}</div>`;
              qNo++;
            }
          }
        });

        output += '</div>';
        return new handlebars.SafeString(output);
      });

      const template = handlebars.compile(templateHtml);
      const html = template(data);

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(html);
      await page.pdf({
        path: path.join(__dirname, 'demo.pdf'),
        format: 'A4',
        preferCSSPageSize: true,
        margin: {
          top: '50px',
          left: '20px',
          right: '20px',
          bottom: '20px'
        }
      });
      await browser.close();

      console.log("PDF Generated");
      res.status(200).setHeader('Content-Type', 'application/pdf');
      res.sendFile(path.join(__dirname, 'demo.pdf'));
    }

    try {
      await generatePdf();
    } catch (err) {
      console.error("Error generating PDF:", err.message);
      next(err);
    }
  })
  .put((req, res) => res.end('PUT Operation is not Performed'))
  .delete((req, res) => res.end('DELETE Operation is not Performed'));

module.exports = semRouter;

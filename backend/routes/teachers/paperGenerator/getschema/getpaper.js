const express = require('express');
const schemaRouter = express.Router();
const authenticate = require('../../../../authenticate');
const cors = require('../../../cors');

const questionModel = require('../../../../models/questions');

const fs = require('fs');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile);

const random = require('random');
const seedrandom = require('seedrandom');
random.use(seedrandom('qpgenerator'));

schemaRouter.use(express.json());

// Utility: Convert number to Roman numeral
function romanize(num) {
  if (isNaN(num)) return NaN;
  const digits = String(+num).split('');
  const key = [
    "", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
    "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"
  ];
  let roman = "", i = 3;
  while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return "M".repeat(+digits.join('')) + roman;
}

// Utility: Randomly shuffle array
function shuffle(array) {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// GET lens data by UID (count of questions per unit/type)
schemaRouter.route('/:uid')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const questions = await questionModel.findById(req.params.uid);
      const lens = ['easy', 'medium', 'hard'].reduce((acc, level) => {
        acc[level] = {};
        ['u1', 'u2', 'u3', 'u4', 'u5'].forEach(unit => {
          acc[level][unit] = questions[level][unit].length;
        });
        return acc;
      }, {});
      res.status(200).json({ sublens: lens });
    } catch (err) {
      next(err);
    }
  });

// POST route to generate schema-based PDF
schemaRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const questions = await questionModel.findById(req.body.id);
      const data = {
        code: req.body.value,
        subyear: req.body.deptYear,
        subsem: req.body.deptSem,
        month: req.body.month,
        year: req.body.year,
        subjectname: req.body.label,
        time: req.body.duration,
        maxMarks: req.body.maxMarks,
        details: req.body.sections,
      };

      const usedIndices = {};
      let toggleDirection = false;

      for (const section of data.details) {
        section.questions = [];

        for (const unit of ['u1', 'u2', 'u3', 'u4', 'u5']) {
          const count = parseInt(section[unit] || 0);
          if (!count) continue;

          const questionList = questions[section.type][unit];
          const range = questionList.length;
          const randIndex = random.uniformInt(0, range - 1);

          // Keep track of shuffled indices per range
          if (!usedIndices[range]) {
            usedIndices[range] = shuffle([...Array(range).keys()]);
          }

          let index = randIndex();
          const arr = usedIndices[range];

          for (let i = 0; i < count; i++) {
            section.questions.push(questionList[arr[index]].name);
            index = toggleDirection
              ? (index + 1) % range
              : (index - 1 + range) % range;
          }

          toggleDirection = !toggleDirection;
        }
      }

      const templateHtmlPath = path.resolve("routes/teachers/paperGenerator/getschema/demo.html");
      const htmlContent = await readFile(templateHtmlPath, 'utf8');

      hb.registerHelper('section', function (details) {
        let html = '<section>';
        details.forEach((sec, idx) => {
          if (sec.questions.length > 0) {
            html += `
              <section class="secdetails">
                <div>${romanize(idx + 1)}. ${sec.sname}</div>
                <div>Marks: ${sec.marks}</div>
              </section>
              <div>
                <ol>
                  ${sec.questions.map(q => `<li class="question" style="margin-left: 5px;">${q}</li>`).join('')}
                </ol>
              </div>
            `;
          }
        });
        html += '</section>';
        return new hb.SafeString(html);
      });

      const template = hb.compile(htmlContent, { strict: true });
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(template(data));
      const pdfPath = path.join(__dirname, 'demo.pdf');
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: { top: '50px', left: '20px', right: '20px', bottom: '20px' },
      });
      await browser.close();

      res.status(200).setHeader('Content-Type', 'application/pdf');
      res.sendFile(pdfPath);
    } catch (err) {
      console.error('Error generating PDF:', err);
      next(err);
    }
  });

module.exports = schemaRouter;

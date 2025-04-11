// utils/paperGeneratorUtil.js
const fs = require('fs');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile);
const question = require('../models/questions');
const random = require('random');
const seedrandom = require('seedrandom');

async function generatePaperPdf({ req, res, templatePath, units, marks = '15', seed = 'qpgenerator' }) {
  random.use(seedrandom(seed));

  const getTemplateHtml = async () => {
    const resolvedPath = path.resolve(templatePath);
    return await readFile(resolvedPath, 'utf8');
  };

  const data = {
    image: "http://localhost:4200/demo.png",
    code: req.body.value,
    year: req.body.deptYear,
    sem: req.body.deptSem,
    subjectname: req.body.label,
    marks,
    branch: 'CSE',
    starttime: req.body.start,
    endtime: req.body.end,
    date: req.body.date,
    month: req.body.month,
    Year: req.body.year,
    questions: []
  };

  const questions = await question.findById(req.body.id, { easy: 1, medium: 1 });

  const ints = random.uniformInt(0, 2);
  let a = ints(), b = ints();
  while (a === b) b = ints();

  if (
    units.some((u) => questions.easy[u].length < 5 || questions.medium[u].length < 3)
  ) {
    res.statusCode = 403;
    return res.send("Couldn't generate Paper for less number of questions.");
  }

  units.forEach((unit, index) => {
    if (index === 2) {
      if (a === index || b === index) {
        const eas = random.uniformInt(1, questions.easy[unit].length - 1);
        let x1 = eas(), x2 = eas();
        while (x1 === x2) x2 = eas();
        data.questions.push([questions.easy[unit][x1].name, questions.easy[unit][x2].name]);
      } else {
        const med = random.uniformInt(1, questions.medium[unit].length - 1);
        data.questions.push(questions.medium[unit][med()].name);
      }
    } else if (a === index || b === index) {
      const ser = new Set();
      const serrand = random.uniformInt(0, questions.easy[unit].length - 1);
      while (ser.size < 4) ser.add(serrand());
      const it = ser.values();
      data.questions.push([
        questions.easy[unit][it.next().value].name,
        questions.easy[unit][it.next().value].name
      ]);
      data.questions.push([
        questions.easy[unit][it.next().value].name,
        questions.easy[unit][it.next().value].name
      ]);
    } else {
      const med = random.uniformInt(1, questions.medium[unit].length - 1);
      let p = med(), q = med();
      while (p === q) q = med();
      data.questions.push(questions.medium[unit][p].name);
      data.questions.push(questions.medium[unit][q].name);
    }
  });

  const templateHtml = await getTemplateHtml();

  hb.registerHelper('img', (src) =>
    new hb.SafeString(`<img src="${src}" width="100px" height="90px" style="margin-left: 4em;" />`)
  );

  hb.registerHelper('question', (qList) => {
    let str = '';
    qList.forEach((q, i) => {
      if (Array.isArray(q)) {
        str += `<tr>
                  <td class="quetable cen">${i + 1}a).</td>
                  <td class="quetable tdcenter">${q[0]}</td>
                  <td class="quetable cen">2</td>
                </tr>
                <tr>
                  <td class="quetable cen">${i + 1}b).</td>
                  <td class="quetable tdcenter">${q[1]}</td>
                  <td class="quetable cen">3</td>
                </tr>`;
      } else {
        str += `<tr>
                  <td class="quetable cen">${i + 1}).</td>
                  <td class="quetable tdcenter">${q}</td>
                  <td class="quetable cen">5</td>
                </tr>`;
      }
    });
    return new hb.SafeString(str);
  });

  const template = hb.compile(templateHtml);
  const result = template(data);
  const html = result;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({
    path: path.join(path.dirname(templatePath), 'demo.pdf'),
    preferCSSPageSize: true,
    format: 'A4',
    landscape: true,
    margin: { top: '50px', left: '20px', right: '20px' }
  });

  await browser.close();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/pdf');
  res.sendFile(path.join(path.dirname(templatePath), 'demo.pdf'));
}

module.exports = { generatePaperPdf };

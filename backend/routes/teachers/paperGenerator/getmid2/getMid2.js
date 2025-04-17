var express = require('express');
var mid2Router = express.Router();
var authenticate = require('../../../../authenticate');
var cors = require('../../../cors');
var question = require('../../../../models/questions');

const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile);

const random = require('random');
var seedrandom = require('seedrandom');
const { ObjectID } = require('mongodb');
random.use(seedrandom('qpgenerator'));

// Define mark distribution (Total 75 marks)
const markDistribution = {
    mcq: { count: 15, marks: 1 },     // 15 × 1 = 15 marks
    easy: { count: 5, marks: 5 },      // 5 × 5 = 25 marks
    medium: { count: 3, marks: 7 },    // 3 × 7 = 21 marks
    hard: { count: 1, marks: 9 }       // 2 × 7 = 14 marks
};                                     // Total = 75 marks

mid2Router.use(express.json());

mid2Router.route('/')
    .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
    .get((req, res, next) => {
        res.end('GET Operation is not Performed');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, async (req, response, next) => {
        try {
            console.log("Received request body:", req.body);
            
            if (!req.body.id) {
                return response.status(400).send('Missing question document ID');
            }

            // Fetch questions with all types
            const subjectId = ObjectID(req.body.id);
            const questions = await question.findOne({subject: subjectId});
            
            
            if (!questions) {
                console.log("No questions found for ID:", req.body.id);
                return response.status(404).send('Questions not found');
            }

            // Validate question counts
            const validation = validateQuestions(questions);
            if (!validation.isValid) {
                return response.status(403).json({
                    error: "Insufficient questions",
                    details: validation.message
                });
            }

            let data = {
                image: "http://localhost:4200/demo.png",
                code: req.body.value,
                year: req.body.deptYear,
                sem: req.body.deptSem,
                subjectname: req.body.label,
                marks: '75',
                branch: 'CSE',
                starttime: req.body.start,
                endtime: req.body.end,
                date: req.body.date,
                month: req.body.month,
                Year: req.body.year,
                questions: []
            };

            try {
                // Select questions from units u3, u4, u5
                const selectedQuestions = selectQuestionsFromUnits(questions, ['u3', 'u4', 'u5']);
                data.questions = formatQuestionsForTemplate(selectedQuestions);

                // Generate PDF
                const templateHtml = await getTemplateHtml();
                
                hb.registerHelper('img', function (data) {
                    return new hb.SafeString(
                        `<img src="${data}" width="100px" height="90px" style="margin-left: 4em;" />`
                    );
                });

                hb.registerHelper('question', function (data) {
                    let str = '';
                    let questionNumber = 1;

                    str += `
                        <style>
                            .question-container {
                                margin-bottom: 10px;
                            }
                            .question {
                                font-size: 12pt;
                                margin-bottom: 5px;
                            }
                            .options {
                                margin-left: 20px;
                                margin-bottom: 5px;
                            }
                            .option {
                                margin-bottom: 8px;
                            }
                            .answer-space {
                                width: 100%;
                                border-bottom: 1px dotted #ccc;
                                margin-bottom: 10px;
                            }
                            .answer-space.easy {
                                height: 200px;  /* 8-15 lines */
                            }
                            .answer-space.medium {
                                height: 350px;  /* 15-25 lines */
                            }
                            .answer-space.hard {
                                height: 500px;  /* ~3/4 page for each hard question */
                            }
                            .marks {
                                float: right;
                                font-weight: normal;
                            }
                        </style>
                    `;

                    // Render all questions in continuous flow
                    data.forEach((q) => {
                        if (q.type === 'mcq') {
                            str += `
                                <div class="question-container">
                                    <div class="question">
                                        ${questionNumber}. ${q.name} <span class="marks">[${q.marks}]</span>
                                    </div>
                                    <div class="options">
                                        ${q.options.map((opt, i) => 
                                            `<div class="option">${['a', 'b', 'c', 'd'][i]}) ${opt}</div>`
                                        ).join('')}
                                    </div>
                                </div>
                            `;
                        } else {
                            let spaceClass = q.type; // 'easy', 'medium', or 'hard'
                            str += `
                                <div class="question-container">
                                    <div class="question">
                                        ${questionNumber}. ${q.name} <span class="marks">[${q.marks}]</span>
                                    </div>
                                    <div class="answer-space ${spaceClass}"></div>
                                </div>
                            `;
                        }
                        questionNumber++;
                    });

                    return new hb.SafeString(str);
                });

                const template = hb.compile(templateHtml, { strict: true });
                const html = template(data);

                const browser = await puppeteer.launch({
                    executablePath: '/opt/homebrew/bin/chromium',
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });

                const page = await browser.newPage();
                await page.setContent(html);
                await page.pdf({
                    path: __dirname + '/demo.pdf',
                    format: 'A4',
                    landscape: false,
                    margin: {
                        top: '30px',
                        bottom: '30px',
                        left: '30px',
                        right: '30px'
                    },
                    printBackground: true
                });

                await browser.close();
                console.log("PDF Generated Successfully");
                
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/pdf');
                response.sendFile(__dirname + '/demo.pdf');

            } catch (err) {
                console.error("Error generating paper:", err);
                return response.status(500).json({
                    error: "Error generating paper",
                    details: err.message
                });
            }
        } catch (err) {
            console.error("General error:", err);
            return response.status(500).json({
                error: "Internal server error",
                details: err.message
            });
        }
    });

function validateQuestions(questions) {
    const units = ['u3', 'u4', 'u5'];
    const requirements = {
        mcq: { min: 20, name: "MCQ" },
        easy: { min: 8, name: "Easy" },
        medium: { min: 5, name: "Medium" },
        hard: { min: 4, name: "Hard" }  // Increased minimum for hard questions
    };

    for (const unit of units) {
        for (const [type, req] of Object.entries(requirements)) {
            const count = questions[type]?.[unit]?.length || 0;
            if (count < req.min / units.length) {
                return {
                    isValid: false,
                    message: `Insufficient ${req.name} questions in unit ${unit}. Need at least ${Math.ceil(req.min / units.length)}, found ${count}`
                };
            }
        }
    }
    return { isValid: true };
}

function selectQuestionsFromUnits(questions, units) {
    const selected = {
        mcq: [],
        easy: [],
        medium: [],
        hard: []
    };

    // Helper function to randomly select questions from a pool
    const selectRandom = (pool, count) => {
        const selected = new Set();
        const available = [...pool];
        while (selected.size < count && available.length > 0) {
            const index = Math.floor(Math.random() * available.length);
            selected.add(available.splice(index, 1)[0]);
        }
        return Array.from(selected);
    };

    // Collect all questions from specified units
    const questionPool = {
        mcq: [],
        easy: [],
        medium: [],
        hard: []
    };

    units.forEach(unit => {
        ['mcq', 'easy', 'medium', 'hard'].forEach(type => {
            if (questions[type]?.[unit]) {
                questionPool[type].push(...questions[type][unit]);
            }
        });
    });

    // Select required number of questions for each type
    selected.mcq = selectRandom(questionPool.mcq, markDistribution.mcq.count);
    selected.easy = selectRandom(questionPool.easy, markDistribution.easy.count);
    selected.medium = selectRandom(questionPool.medium, markDistribution.medium.count);
    selected.hard = selectRandom(questionPool.hard, markDistribution.hard.count);

    return selected;
}

function formatQuestionsForTemplate(selectedQuestions) {
    const formattedQuestions = [];

    // Format MCQs
    selectedQuestions.mcq.forEach(q => {
        formattedQuestions.push({
            type: 'mcq',
            name: q.name,
            marks: markDistribution.mcq.marks,
            options: q.options
        });
    });

    // Format other questions
    ['easy', 'medium', 'hard'].forEach(type => {
        selectedQuestions[type].forEach(q => {
            formattedQuestions.push({
                type: type,
                name: q.name,
                marks: markDistribution[type].marks
            });
        });
    });

    return formattedQuestions;
}

async function getTemplateHtml() {
    try {
        const invoicePath = path.resolve("routes/teachers/paperGenerator/getmid2/demo.html");
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        throw new Error("Could not load html template: " + err.message);
    }
}

module.exports = mid2Router;
var express = require('express');
var mid1Router = express.Router();
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
random.use(seedrandom('qpgenerator'));

// Define mark distribution (Total 75 marks)
const markDistribution = {
    mcq: { count: 15, marks: 1 },     // 15 × 1 = 15 marks
    easy: { count: 6, marks: 5 },      // 6 × 5 = 30 marks
    medium: { count: 3, marks: 7 },    // 3 × 7 = 21 marks
    hard: { count: 1, marks: 9 }       // 1 × 9 = 9 marks
};

mid1Router.use(express.json());

mid1Router.route('/')
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
            const questions = await question.findById(req.body.id);
            
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
                questions: {
                    mcq: [],
                    descriptive: []
                }
            };

            // Select questions for each category
            try {
                // Select MCQs (15 questions, 1 mark each)
                data.questions.mcq = selectMCQs(questions.mcq, markDistribution.mcq.count);

                // Select Easy questions (6 questions, 5 marks each)
                const easyQuestions = selectQuestions(questions.easy, markDistribution.easy.count);
                
                // Select Medium questions (3 questions, 7 marks each)
                const mediumQuestions = selectQuestions(questions.medium, markDistribution.medium.count);
                
                // Select Hard question (1 question, 9 marks)
                const hardQuestions = selectQuestions(questions.hard, markDistribution.hard.count);

                // Combine descriptive questions
                data.questions.descriptive = [
                    ...formatQuestions(easyQuestions, markDistribution.easy.marks),
                    ...formatQuestions(mediumQuestions, markDistribution.medium.marks),
                    ...formatQuestions(hardQuestions, markDistribution.hard.marks)
                ];

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

                    // Style for spacing
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
                                height: 200px;  /* Approximately 8-15 lines */
                            }
                            .answer-space.medium {
                                height: 350px;  /* Approximately 15-25 lines */
                            }
                            .answer-space.hard {
                                height: 750px;  /* Approximately one page */
                            }
                            .marks {
                                float: right;
                                font-weight: normal;
                            }
                        </style>
                    `;

                    // First render MCQs (without any section header)
                    if (data.mcq && data.mcq.length > 0) {
                        data.mcq.forEach((q) => {
                            str += `
                                <div class="question-container">
                                    <div class="question">
                                        ${questionNumber}. ${q.name} <span class="marks">[1]</span>
                                    </div>
                                    <div class="options">
                                        ${q.options.map((opt, i) => 
                                            `<div class="option">${['a', 'b', 'c', 'd'][i]}) ${opt}</div>`
                                        ).join('')}
                                    </div>
                                </div>
                            `;
                            questionNumber++;
                        });
                    }

                    // Then render descriptive questions with appropriate spacing
                    if (data.descriptive && data.descriptive.length > 0) {
                        data.descriptive.forEach((q) => {
                            let spaceClass = '';
                            if (q.marks === 5) spaceClass = 'easy';
                            else if (q.marks === 7) spaceClass = 'medium';
                            else if (q.marks === 9) spaceClass = 'hard';

                            str += `
                                <div class="question-container">
                                    <div class="question">
                                        ${questionNumber}. ${q.name} <span class="marks">[${q.marks}]</span>
                                    </div>
                                    <div class="answer-space ${spaceClass}"></div>
                                </div>
                            `;
                            questionNumber++;
                        });
                    }

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
    })
    .put((req, res, next) => {
        res.end('PUT Operation is not Performed');
    })
    .delete((req, res, next) => {
        res.end('DELETE Operation is not Performed');
    });

// Helper Functions
function validateQuestions(questions) {
    const requirements = {
        mcq: { min: 20, name: "MCQ" },
        easy: { min: 8, name: "Easy" },
        medium: { min: 5, name: "Medium" },
        hard: { min: 2, name: "Hard" }
    };

    for (const [type, req] of Object.entries(requirements)) {
        const count = countQuestionsInUnits(questions[type]);
        if (count < req.min) {
            return {
                isValid: false,
                message: `Insufficient ${req.name} questions. Need at least ${req.min}, found ${count}`
            };
        }
    }
    return { isValid: true };
}

function countQuestionsInUnits(questionType) {
    if (!questionType) return 0;
    return ['u1', 'u2', 'u3'].reduce((total, unit) => {
        return total + (questionType[unit]?.length || 0);
    }, 0);
}

function selectMCQs(mcqPool, count) {
    const allMCQs = [];
    ['u1', 'u2', 'u3'].forEach(unit => {
        if (mcqPool?.[unit]) {
            allMCQs.push(...mcqPool[unit]);
        }
    });

    // Randomly select MCQs
    const selected = new Set();
    while (selected.size < count && selected.size < allMCQs.length) {
        const index = Math.floor(Math.random() * allMCQs.length);
        if (!selected.has(index)) {
            selected.add(index);
        }
    }

    return Array.from(selected).map(index => allMCQs[index]);
}

function selectQuestions(questionPool, count) {
    const allQuestions = [];
    ['u1', 'u2', 'u3'].forEach(unit => {
        if (questionPool?.[unit]) {
            allQuestions.push(...questionPool[unit]);
        }
    });

    // Randomly select questions
    const selected = new Set();
    while (selected.size < count && selected.size < allQuestions.length) {
        const index = Math.floor(Math.random() * allQuestions.length);
        if (!selected.has(index)) {
            selected.add(index);
        }
    }

    return Array.from(selected).map(index => allQuestions[index]);
}

function formatQuestions(questions, marks) {
    return questions.map(q => ({
        name: q.name,
        marks: marks
    }));
}

async function getTemplateHtml() {
    try {
        const invoicePath = path.resolve("routes/teachers/paperGenerator/getmid1/demo.html");
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        throw new Error("Could not load html template: " + err.message);
    }
}

module.exports = mid1Router;
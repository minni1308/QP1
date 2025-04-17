var express = require('express');
var semRouter = express.Router();
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

// Define mark distribution (Total 100 marks)
const markDistribution = {
    mcq: { count: 20, marks: 1 },     // 20 × 1 = 20 marks
    easy: { count: 8, marks: 5 },      // 8 × 5 = 40 marks
    medium: { count: 4, marks: 7 },    // 4 × 7 = 28 marks
    hard: { count: 2, marks: 6 }       // 2 × 6 = 12 marks
};                                     // Total = 100 marks

const units = ['u1', 'u2', 'u3', 'u4', 'u5']; // All units for semester exam

semRouter.use(express.json());

semRouter.route('/')
    .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
    .get((req, res, next) => {
        res.end('GET Operation is not Performed');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, async (req, response, next) => {
        try {
            console.log("Received request for paper generation");
            console.log("Subject ID:", req.body.id);

            const subjectId = ObjectID(req.body.id);
            const questions = await question.findOne({subject: subjectId});
            if (!questions) {
                console.log("No questions found for ID:", req.body.id);
                return response.status(404).send('Questions not found');
            }

            // Log the structure of the questions document
            console.log("\nQuestion document structure:");
            ['mcq', 'easy', 'medium', 'hard'].forEach(type => {
                console.log(`\n${type.toUpperCase()} questions:`);
                units.forEach(unit => {
                    console.log(`  ${unit}: ${questions[type]?.[unit]?.length || 0} questions`);
                });
            });

            // Validate questions with detailed logging
            const validation = validateQuestions(questions, req.user._id);
            if (!validation.isValid) {
                console.log("Validation failed:", validation.message);
                return response.status(403).json({
                    error: "Insufficient questions",
                    details: validation.message,
                    questionCounts: {
                        mcq: units.reduce((sum, unit) => sum + (questions.mcq?.[unit]?.length || 0), 0),
                        easy: units.reduce((sum, unit) => sum + (questions.easy?.[unit]?.length || 0), 0),
                        medium: units.reduce((sum, unit) => sum + (questions.medium?.[unit]?.length || 0), 0),
                        hard: units.reduce((sum, unit) => sum + (questions.hard?.[unit]?.length || 0), 0)
                    }
                });
            }

            let data = {
                image: "http://localhost:4200/demo.png",
                code: req.body.value,
                year: req.body.deptYear,
                sem: req.body.deptSem,
                subjectname: req.body.label,
                marks: '100',
                branch: 'CSE',
                date: req.body.date,
                month: req.body.month,
                Year: req.body.year,
                time: req.body.hours,
                questions: []
            };

            try {
                // Select questions from all units with balanced distribution
                const selectedQuestions = selectQuestionsFromUnits(questions, units, req.user._id);
                data.questions = formatQuestionsForTemplate(selectedQuestions);

                // Generate PDF
                const templateHtml = await getTemplateHtml();
                
                hb.registerHelper('img', function (data) {
                    return new hb.SafeString(
                        `<img src="${data}" width="100px" height="90px" style="margin-left: 4em;" />`
                    );
                });

                hb.registerHelper('question', function (questions) {
                    let str = '';
                    
                    str += `
                        <style>
                            .question-container { margin-bottom: 15px; }
                            .question {
                                font-size: 12pt;
                                margin-bottom: 8px;
                                font-weight: bold;
                            }
                            .options {
                                margin-left: 20px;
                                margin-bottom: 12px;
                            }
                            .option {
                                margin-bottom: 8px;
                                padding-left: 20px;
                            }
                            .answer-space {
                                width: 100%;
                                border-bottom: 1px dotted #ccc;
                                margin-bottom: 20px;
                            }
                            .answer-space.easy { height: 250px; }
                            .answer-space.medium { height: 400px; }
                            .answer-space.hard { height: 900px; }
                            .marks { float: right; font-weight: normal; }
                            .page-break { page-break-after: always; }
                        </style>
                    `;

                    // Ensure questions is an array
                    if (!Array.isArray(questions)) {
                        console.error('Questions is not an array:', questions);
                        throw Error('Error: No questions available');
                    }
                    questions.forEach((q, index) => {
                        if (!q || !q.text) {
                            console.error('Invalid question:', q);
                            return;
                        }
                        str += '<div class="question-container">';
                        str += `<div class="question">${index + 1}. ${q.text} <span class="marks">[${q.marks}]</span></div>`;

                        if (q.type === 'mcq' && Array.isArray(q.options)) {
                            str += '<div class="options">';
                            q.options.forEach((opt, i) => {
                                str += `<div class="option">${['a', 'b', 'c', 'd'][i]}) ${opt}</div>`;
                            });
                            str += '</div>';
                        } else {
                            str += `<div class="answer-space ${q.type}"></div>`;
                            if (q.type === 'hard') {
                                str += '<div class="page-break"></div>';
                            }
                        }
                        str += '</div>';
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

function validateQuestions(questions, teacherId) {
    console.log("Starting validation...");
    
    // Count total available questions for the specific teacher
    const totalAvailable = {
        mcq: 0,
        easy: 0,
        medium: 0,
        hard: 0
    };

    // Count questions in each unit for the specific teacher
    units.forEach(unit => {
        ['mcq', 'easy', 'medium', 'hard'].forEach(type => {
            if (questions[type] && questions[type][unit]) {
                const teacherQuestions = questions[type][unit].filter(q => 
                    q.teacher && q.teacher.equals(teacherId)
                );
                totalAvailable[type] += teacherQuestions.length;
            }
        });
    });

    console.log("Total available questions for teacher:", totalAvailable);

    // Minimum required questions
    const required = {
        mcq: markDistribution.mcq.count,    // 20
        easy: markDistribution.easy.count,   // 8
        medium: markDistribution.medium.count, // 4
        hard: markDistribution.hard.count     // 2
    };

    // Check if we have enough questions
    for (const type in required) {
        if (totalAvailable[type] < required[type]) {
            console.log(`Not enough ${type} questions. Need ${required[type]}, have ${totalAvailable[type]}`);
            return {
                isValid: false,
                message: `You need at least ${required[type]} ${type} questions, but you only have ${totalAvailable[type]} questions added by you`
            };
        }
    }

    return { isValid: true };
}

function selectQuestionsFromUnits(questions, units, teacherId) {
    const allQuestions = {
        mcq: [],
        easy: [],
        medium: [],
        hard: []
    };

    // Collect all questions from all units for the logged-in teacher only
    units.forEach(unit => {
        ['mcq', 'easy', 'medium', 'hard'].forEach(type => {
            if (questions[type] && questions[type][unit]) {
                // Filter questions to only include those from the logged-in teacher
                const teacherQuestions = questions[type][unit].filter(q => 
                    q.teacher && q.teacher.equals(teacherId)
                );
                allQuestions[type].push(...teacherQuestions);
            }
        });
    });

    // Randomly select required number of questions
    const selected = {};
    Object.keys(markDistribution).forEach(type => {
        const shuffled = [...allQuestions[type]].sort(() => Math.random() - 0.5);
        selected[type] = shuffled.slice(0, markDistribution[type].count);
    });

    return selected;
}

function formatQuestionsForTemplate(selectedQuestions) {
    // Ensure we're returning a flat array of questions
    let formattedQuestions = [];

    // Add MCQs first
    if (selectedQuestions.mcq && selectedQuestions.mcq.length > 0) {
        formattedQuestions = selectedQuestions.mcq.map((q, index) => ({
            number: index + 1,
            text: q.name || '',
            type: 'mcq',
            marks: markDistribution.mcq.marks,
            options: q.options || ['', '', '', '']
        }));
    }

    // Add other questions
    const types = ['easy', 'medium', 'hard'];
    types.forEach(type => {
        if (selectedQuestions[type] && selectedQuestions[type].length > 0) {
            const questionsOfType = selectedQuestions[type].map(q => ({
                number: formattedQuestions.length + 1,
                text: q.name || '',
                type: type,
                marks: markDistribution[type].marks
            }));
            formattedQuestions = [...formattedQuestions, ...questionsOfType];
        }
    });

    return formattedQuestions;
}

async function getTemplateHtml() {
    try {
        const invoicePath = path.resolve("routes/teachers/paperGenerator/getsem/demo.html");
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        throw new Error("Could not load html template: " + err.message);
    }
}

module.exports = semRouter;
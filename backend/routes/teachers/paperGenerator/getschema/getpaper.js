var express = require('express');
var schemaRouter = express.Router();
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
const { ObjectId } = require('mongodb');
random.use(seedrandom('qpgenerator'));


// Define mark distribution (Total 100 marks)
const markDistribution = {
    mcq: { count: 20, marks: 1 },     // 20 × 1 = 20 marks
    easy: { count: 8, marks: 5 },      // 8 × 5 = 40 marks
    medium: { count: 4, marks: 7 },    // 4 × 7 = 28 marks
    hard: { count: 2, marks: 6 }       // 2 × 6 = 12 marks
};                                     // Total = 100 marks

const units = ['u1', 'u2', 'u3', 'u4', 'u5']; // All units for semester exam


schemaRouter.use(express.json());
schemaRouter.route('/:uid')
    .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        question.findById(req.params.uid)
            .then((questions) => {
                // Count questions for the logged-in teacher
                const teacherId = req.user._id;
                const lens = {
                    mcq: {
                        u1: questions['mcq']['u1'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u2: questions['mcq']['u2'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u3: questions['mcq']['u3'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u4: questions['mcq']['u4'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u5: questions['mcq']['u5'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                    },
                    easy: {
                        u1: questions['easy']['u1'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u2: questions['easy']['u2'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u3: questions['easy']['u3'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u4: questions['easy']['u4'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u5: questions['easy']['u5'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                    },
                    medium: {
                        u1: questions['medium']['u1'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u2: questions['medium']['u2'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u3: questions['medium']['u3'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u4: questions['medium']['u4'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u5: questions['medium']['u5'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                    },
                    hard: {
                        u1: questions['hard']['u1'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u2: questions['hard']['u2'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u3: questions['hard']['u3'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u4: questions['hard']['u4'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                        u5: questions['hard']['u5'].filter(q => q.teacher && q.teacher.equals(teacherId)).length,
                    }
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ sublens: lens });
            }).catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.end('PUT Operation is not Performed');
    })
    .put((req, res, next) => {
        res.end('PUT Operation is not Performed');
    })
    .delete((req, res, next) => {
        res.end('DELETE Operation is not Performed');
    })


schemaRouter.route('/')
    .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
    .get((req, res, next) => {
        res.end('GET Operation is not Performed');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, async (req, response, next) => {
        async function getTemplateHtml() {
            console.log("Loading template file in memory")
            try {
                const invoicePath = path.resolve("routes/teachers/paperGenerator/getschema" + "/demo.html");
                console.log(invoicePath);
                return await readFile(invoicePath, 'utf8');
            } catch (err) {
                return Promise.reject("Could not load html template");
            }
        }
        async function generatePdf() {
            const subjectId = ObjectId(req.body.id)
            const questions = await question.findOne({subject: subjectId});
            if (!questions) {
                console.log("No questions found for ID:", req.body.id);
                return response.status(404).send('Questions not found');
            }

            // Validate questions with detailed logging
            const validation = validateQuestions(questions, req.user._id);
            if (!validation.isValid) {
                console.log("Validation failed:", validation.message);
                return response.status(403).json({
                    error: "Insufficient questions",
                    details: validation.message,
                    questionCounts: {
                        mcq: units.reduce((sum, unit) => {
                            const teacherQuestions = questions.mcq?.[unit]?.filter(q => 
                                q.teacher && q.teacher.equals(req.user._id)
                            ) || [];
                            return sum + teacherQuestions.length;
                        }, 0),
                        easy: units.reduce((sum, unit) => {
                            const teacherQuestions = questions.easy?.[unit]?.filter(q => 
                                q.teacher && q.teacher.equals(req.user._id)
                            ) || [];
                            return sum + teacherQuestions.length;
                        }, 0),
                        medium: units.reduce((sum, unit) => {
                            const teacherQuestions = questions.medium?.[unit]?.filter(q => 
                                q.teacher && q.teacher.equals(req.user._id)
                            ) || [];
                            return sum + teacherQuestions.length;
                        }, 0),
                        hard: units.reduce((sum, unit) => {
                            const teacherQuestions = questions.hard?.[unit]?.filter(q => 
                                q.teacher && q.teacher.equals(req.user._id)
                            ) || [];
                            return sum + teacherQuestions.length;
                        }, 0)
                    }
                });
            }
            let data = {
                code: req.body.value,
                subyear: req.body.deptYear,
                subsem: req.body.deptSem,
                month: req.body.month,
                year: req.body.year,
                subjectname: req.body.label,
                time: req.body.duration,
                maxMarks: req.body.maxMarks,
                details: req.body.sections
            };

            function shuffle(array) {
                var m = array.length, t, i;
                while (m) {
                    i = Math.floor(Math.random() * m--);
                    t = array[m];
                    array[m] = array[i];
                    array[i] = t;
                }
                return array;
            }

            var units = ['u1', 'u2', 'u3', 'u4', 'u5'];
            var s = {}
            var bo = false;
            for (var i = 0; i < data.details.length; i++) {
                data.details[i]['questions'] = []; // section x with each unit have required questions....
                for (var j = 0; j < units.length; j++) {
                    if (data.details[i][units[j]] !== '') { // checking for each unit
                        var num = Number(data.details[i][units[j]]); // no of questions required for each unit
                        // Filter questions for the logged-in teacher
                        const teacherQuestions = questions[data.details[i]['type']][units[j]].filter(q => 
                            q.teacher && q.teacher.equals(req.user._id)
                        );
                        var range = teacherQuestions.length;  // if 10 questions gives 10
                        const ints = random.uniformInt(0, range - 1); // gives a number from 0 - 9 inclusive
                        if (range in s) {
                            var arr = s[range];
                            var len = arr.length;
                            var startIndex = ints()
                            while (num > 0) {
                                const targetQuestion = teacherQuestions[arr[startIndex]]
                                if(data.details[i]['type']=='mcq')
                                    data.details[i]['questions'].push({
                                        text: targetQuestion.name || '',
                                        type: 'mcq',
                                        options: targetQuestion.options || ['', '', '', '']
                                    })
                                else {
                                    data.details[i]['questions'].push({
                                        text: targetQuestion.name || '',
                                        type: data.details[i]['type'],
                                    })
                                }
                                if(bo) {
                                    startIndex = (startIndex + 1) % len;
                                } else {
                                    startIndex = startIndex - 1 < 0 ? len - 1 : startIndex - 1;
                                }
                                num--;
                            }
                        } else {
                            var newArray = shuffle([...Array(range).keys()]);  // [ 0 ... 9 ] range exclusive.
                            s[range] = newArray;
                            var arr = s[range];
                            var len = arr.length;
                            var startIndex = ints();  // [0 - range-1] inclusive the index number lies in shuffled array. 
                            
                            while (num > 0) {
                                const targetQuestion = teacherQuestions[arr[startIndex]]
                                if(data.details[i]['type']=='mcq')
                                    data.details[i]['questions'].push({
                                        text: targetQuestion.name || '',
                                        type: 'mcq',
                                        options: targetQuestion.options || ['', '', '', '']
                                    })
                                else {
                                    data.details[i]['questions'].push({
                                        text: targetQuestion.name || '',
                                        type: data.details[i]['type'],
                                    })
                                }
                                if(bo) {
                                    startIndex = (startIndex + 1) % len;
                                } else {
                                    startIndex = startIndex - 1 < 0 ? len - 1 : startIndex - 1;
                                }
                                num--;
                            }
                        }
                        bo = !bo;
                    }
                }
            }

            function romanize(num) {
                if (isNaN(num))
                    return NaN;
                var digits = String(+num).split(""),
                    key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
                        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
                    roman = "",
                    i = 3;
                while (i--)
                    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
                return Array(+digits.join("") + 1).join("M") + roman;
            }

            getTemplateHtml().then(async (res) => {
                hb.registerHelper('section', function (data) {
                    var str=str += `
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
                    str += '<section>';
                    for (var i = 1; i <= data.length; i++) {
                        if (data[i - 1]['questions'].length > 0) {
                            str += '<section class="secdetails">\
                              <div>'+ romanize(i) + '. ' + data[i - 1]['sname'] + '</div>\
                              <div>Marks: '+ data[i - 1]['marks'] + '</div>\
                              </div>';
                            str += '<div>'
                            var currQuestions = data[i-1]['questions']
                            for (var j = 0; j < currQuestions.length; j++) {
                                str += '<div class="question-container">';
                                str += `<div class="question">${j + 1}. ${currQuestions[j].text}</div>`;
                                // str += '<li class="question" style="margin-left: 5px;"> ' + data[i - 1]['questions'][j] + '</li>'
                                if(currQuestions[j].type=='mcq' && Array.isArray(currQuestions[j].options)) {
                                    str += '<div class="options">';
                                    currQuestions[j].options.forEach((opt, x) => {
                                        str += `<div class="option">${['a', 'b', 'c', 'd'][x]}) ${opt}</div>`;
                                    });
                                    str += '</div>';
                                } else {
                                    str += `<div class="answer-space ${currQuestions[j].type}"></div>`;
                                    if (currQuestions[j].type === 'hard') {
                                        str += '<div class="page-break"></div>';
                                    }
                                }
                            }
                            str += '</div>';
                        }
                    }
                    str += '</section>'
                    return new hb.SafeString(str);
                });

                console.log("Compiling the template with handlebars")
                const template = hb.compile(res, { strict: true });
                const result = template(data);
                const html = result;
                const browser = await puppeteer.launch({
                executablePath:'/opt/homebrew/bin/chromium',
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                    ],
                });
                const page = await browser.newPage()
                await page.setContent(html)
                await page.pdf({
                    path: __dirname + '/demo.pdf',
                    preferCSSPageSize: true,
                    format: 'A4',
                    margin: {
                        top: '50px',
                        left: '20px',
                        right: '20px',
                        bottom: '20px'
                    }
                })
                await browser.close();
                console.log("PDF Generated");
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/pdf');
                response.sendFile(__dirname + '/demo.pdf');
            }).catch(err => {
                console.error(err)
                return response.status(500).json({
                    error: "Internal server error",
                    details: err.message
                });
            });
        }
        generatePdf();
    })
    .put((req, res, next) => {
        res.end('PUT Operation is not Performed');
    })
    .delete((req, res, next) => {
        res.end('DELETE Operation is not Performed');
    })

function validateQuestions(questions, teacherId) {
    console.log("Starting validation...");
    
    // Count total available questions
    const totalAvailable = {
        mcq: 0,
        easy: 0,
        medium: 0,
        hard: 0
    };

    // Count questions in each unit
    units.forEach(unit => {
        ['mcq', 'easy', 'medium', 'hard'].forEach(type => {
            if (questions[type] && questions[type][unit]) {
                totalAvailable[type] += questions[type][unit].length;
            }
        });
    });

    console.log("Total available questions:", totalAvailable);

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
                message: `Need at least ${required[type]} ${type} questions, found ${totalAvailable[type]}`
            };
        }
    }

    return { isValid: true };
}

function selectQuestionsFromUnits(questions, units) {
    const allQuestions = {
        mcq: [],
        easy: [],
        medium: [],
        hard: []
    };

    // Collect all questions from all units
    units.forEach(unit => {
        ['mcq', 'easy', 'medium', 'hard'].forEach(type => {
            if (questions[type] && questions[type][unit]) {
                allQuestions[type].push(...questions[type][unit]);
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

    
module.exports = schemaRouter;
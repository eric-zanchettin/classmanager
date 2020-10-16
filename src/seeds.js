const faker = require('faker');

const { date } = require('./lib/util');
const teachersDB = require('./app/models/teachersDB');
const studentsDB = require('./app/models/studentsDB');
const teachers = [];

async function createTeachers() {
    while (teachers.length < 10) {
        teachers.push({
            avatar_url: faker.internet.avatar(),
            name: faker.name.firstName(),
            birth: date(faker.date.between('1970-01-01', '2000-12-31')).iso,
            formation: faker.name.jobTitle(),
            classtype: faker.name.jobType(),
            classes: 'Matéria1, Matéria2',
            created_at: date(new Date()).iso,
        });
    };

    let teachersPromise = teachers.map(teacher => {
        teachersDB.create(teacher);
    });

    await Promise.all(teachersPromise);
};

async function createStudents() {
    const students = [];

    while (students.length < 5) {
        students.push({
            avatar_url: faker.internet.avatar(),
            name: faker.name.firstName(),
            birth: date(faker.date.between('1985-01-01', '2016-12-31')).iso,
            email: faker.internet.email(),
            grade: faker.random.alphaNumeric(8),
            hours: faker.random.number(6),
            teacher_id: faker.random.number(teachers.length),
        });
    };

    let studentsPromise = students.map(student => {
        studentsDB.create(student);
    });

    await Promise.all(studentsPromise)
};

async function init() {
    createTeachers();
    createStudents();
};

init();
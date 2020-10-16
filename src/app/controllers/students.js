const studentsDB = require('../models/studentsDB');
const { age, date } = require('../../lib/util');

module.exports = {
    index(req, res) {
        let { page, limit, filter } = req.query
        
        page = page || 1;
        limit = limit || 2;
        let offset = limit * (page - 1);

        let params = {
            filter,
            page,
            limit,
            offset,
            callback(students) {
                let pagination = {
                    page,
                    total: Math.ceil(students[0].total / limit)
                }
                return res.render('students/index', { students, pagination, filter });
            },
        };

        studentsDB.paginate(params);
},

    create(req, res) {
        studentsDB.teachersOption(function(teacherOptions) {
            if (!teacherOptions) {
                return res.send('Teacher Options are causing errors!');
            };

            return res.render('students/create', { teacherOptions });
        });
    },

    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.render('students/index.njk', {
                    error: 'Por favor, preencha todos os Campos antes de prosseguir!',
                });
            };
        };

        const fields = {
            ...req.body,
            birth: date(req.body.birth).iso,
        };

        const results = await studentsDB.create(fields);
        const studentID = results.rows[0].id;

        return res.redirect(`/students/${studentID}`);
    },

    show(req, res) {
        studentsDB.find(req.params.id, function(student) {
            if (!student) {
                return res.send('Student not Found!');
            };

            student.birth = date(student.birth).birthDay;

            return res.render(`students/show`, { student } )
        });
    },

    edit(req, res) {
        studentsDB.find(req.params.id, function(student) {
            if (!studentsDB) {
                return res.send('Student not Found!');
            };

            student.birth = date(student.birth).iso;

            studentsDB.teachersOption(function(teacherOptions) {
                if (!teacherOptions) {
                    return res.send('Teacher Options are causing errors!');
                };
    
                return res.render('students/edit', { student, teacherOptions });
            });
        });
    },

    put(req, res) {
        studentsDB.update(req.body, function() {
            return res.redirect(`students/${req.body.id}`);
        });
    },

    async delete(req, res) {
        await studentsDB.delete(req.body.id);

        return res.render('lottie/delete.njk');
    },
};
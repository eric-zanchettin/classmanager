const teachersDB = require('../models/teachersDB');
const { age, date } = require('../../lib/util');

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1,
        limit = limit || 2,
        offset = limit * (page - 1)

        let params = {
            filter,
            page,
            limit,
            offset,
            callback(teachers) {
                teachers.map(teacher => {
                    teacher.classes = teacher.classes.split(',');
                });
                pagination = {
                    page,
                    total: Math.ceil(teachers[0].total / limit),
                }

                return res.render('teachers/index', { teachers, filter, pagination })
            },
        }

        teachersDB.paginate(params)
},

    create(req, res) {
        return res.render('teachers/create');
    },

    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.render('teachers/index.njk', {
                    error: 'Por favor, preencha todos os Campos antes de prosseguir!',
                });
            };
        };
        
        const fields = {
            ...req.body,
            birth: date(req.body.birth).iso,
            created_at: date(new Date()).iso,
        }

        const results = await teachersDB.create(fields);
        const teacherID = results.rows[0].id;

        return res.redirect(`/teachers/${teacherID}`);
    },

    show(req, res) {
        teachersDB.find(req.params.id, function(teacher) {
            if (!teacher) {
                return res.send('Teacher not Found!');
            };

            teacher.age = age(teacher.birth);
            teacher.created_at = date(teacher.created_at).iso;
            teacher.formation = teacher.formation;
            teacher.classType = teacher.classtype;
            teacher.classes = teacher.classes.split(',')

            return res.render(`teachers/show`, { teacher } )
        });
    },

    edit(req, res) {
        teachersDB.find(req.params.id, function(teacher) {
            if (!teachersDB) {
                return res.send('Teacher not Found!');
            };

            teacher.birth = date(teacher.birth).iso;
            teacher.formation = teacher.formation;
            teacher.classType = teacher.classtype;
            teacher.classes = teacher.classes.split(',');

            return res.render('teachers/edit', { teacher: teacher })
        });
    },

    put(req, res) {
        teachersDB.update(req.body, function() {
            return res.redirect(`teachers/${req.body.id}`);
        });
    },

    async delete(req, res) {
        await teachersDB.delete(req.body.id);

        return res.redirect('teachers/');
    },
};
const Base = require('../models/Base');

const studentsDB = require('../../../config/db')
const { date } = require('../../lib/util');

Base.init({ table: 'students' });

module.exports = {
    ...Base,
    all(callback) {
        studentsDB.query('SELECT * FROM students', null, function(err, results) {
            if(err) {
                throw 'DATABASE ERROR!'
            };
            
            callback(results.rows);
        });
    },

    find(id, callback) {
        studentsDB.query(`
            SELECT
            S.*,
            (
                SELECT
                name
                FROM teachers T
                WHERE T.id = S.teacher_id
            ) AS teacher_name
            FROM students S
            WHERE id = $1
        `, [id], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };
            
            callback(results.rows[0]);
        });
    },

    update(data, callback) {
        const query = `
            UPDATE students
            SET avatar_url = ($1),
            name = ($2),
            birth = ($3),
            email = ($4),
            grade = ($5),
            hours = ($6),
            teacher_id = ($7)
            WHERE id = $8
        `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.email,
            data.grade,
            Number(data.hours),
            data.teacher_id,
            data.id
        ]

        studentsDB.query(query, values, function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };
        });
        
        callback();
    },

    teachersOption(callback) {
        studentsDB.query(`
            SELECT
            id,
            name
            FROM teachers
        `, null, function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(results.rows)
        });
    },

    paginate(params) {
        let { limit, offset, filter, callback } = params

        let query = ``,
            filterQuery = ``,
            totalQuery = 
        `(
            SELECT COUNT(*) FROM students S
        ) AS total
        `
        if (filter) {
            filterQuery = `
                WHERE S.name ILIKE '%${filter}%'
                OR S.email ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT COUNT(*) FROM students S
                ${filterQuery}
            ) AS total`
        };

        query = `
            SELECT
            S.*,
            ${totalQuery}
            FROM students S
            ${filterQuery}
            LIMIT $1 OFFSET $2
        `

        studentsDB.query(query, [limit, offset], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(results.rows);
        });
    },
};
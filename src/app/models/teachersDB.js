const Base = require('../models/Base');

const teachersDB = require('../../../config/db')
const { date } = require('../../lib/util');

Base.init({ table: 'teachers' });

module.exports = {
    ...Base,
    all(callback) {        
        teachersDB.query(`
            SELECT
            *,
            (
                SELECT
                COUNT(*)
                FROM students S
                WHERE S.teacher_id = T.id
            ) AS qt_students
            FROM teachers T
            ORDER BY qt_students DESC
        `, null, function(err, results) {
            if(err) {
                throw 'DATABASE ERROR!'
            };
            
            callback(results.rows);
        });
    },

    find(id, callback) {
        teachersDB.query(`
            SELECT
            *
            FROM teachers
            WHERE id = $1
        `, [id], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };
            
            callback(results.rows[0]);
        });
    },

    findBy(filter, callback) {
        teachersDB.query(`
            SELECT
            *,
            (
                SELECT
                COUNT(*)
                FROM students S
                WHERE S.teacher_id = T.id
            ) AS qt_students
            FROM teachers T
            WHERE T.name ILIKE '%${filter}%'
            OR T.subjects_taught ILIKE '%${filter}%'
            ORDER BY qt_students DESC
        `, null, function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(results.rows);
        });
    },

    update(data, callback) {
        const query = `
            UPDATE teachers
            SET avatar_url = ($1),
            name = ($2),
            birth_date = ($3),
            education_level = ($4),
            class_type = ($5),
            subjects_taught = ($6)
            WHERE id = $7
        `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.formation,
            data.classType,
            data.classes,
            data.id
        ]

        teachersDB.query(query, values, function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };
        });
        
        callback();
    },

    paginate(params) {
        let { filter, limit, offset, callback } = params;

        let query = ``;
        let filterQuery = ``;
        let totalQuery = `(
            SELECT
            COUNT(*)
            FROM teachers T
        ) AS total`;

        if (filter) {
            filterQuery = `
            WHERE T.name ILIKE '%${filter}%'
            OR T.subjects_taught ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT
                COUNT(*)
                FROM teachers T
                ${filterQuery}
            ) AS total
            `
        }

        query = `
        SELECT
        *,
        (
            SELECT
            COUNT(*)
            FROM students S
            WHERE S.teacher_id = T.id
        ) AS qt_students,
        ${totalQuery}
        FROM teachers T
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `
        teachersDB.query(query, [limit, offset], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(results.rows);
        });
    },
};
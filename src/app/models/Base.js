const db = require('../../../config/db');

const Base = {
    init({ table }) {
        if (!table) {
            throw new Error('You need to specify an table name.');
        };

        this.table = table;

        return this;
    },

    create(fields) {
        let keys = [],
            values = [];
        
        Object.keys(fields).map(key => {
            keys.push(key);
            values.push(`'${fields[key]}'`);
        });

        return db.query(`
            INSERT INTO ${this.table} (
                ${keys.join(',')}
            ) VALUES (
                ${values.join(',')}
            )
            RETURNING ID
        `);
    },
    
    delete(id) {
        return db.query(`
            DELETE FROM ${this.table}
            WHERE id = $1
        `, [id])
    },
};

module.exports = Base;

//Base.create({test1_title: 'test1', test2_title: 'test2'})
module.exports = {
    age(timestamp) {
        const today = new Date();
        const date = new Date(timestamp);

        let years = (today.getUTCFullYear() - date.getUTCFullYear());

        if ( (today.getUTCMonth() - date.getUTCMonth() ) < 0 || ( (today.getUTCMonth() - date.getUTCMonth()) ) == 0 && ( today.getUTCDate() - date.getUTCDate() ) < 0  ) {
            years -= 1;
        };

        return years;
    },

    date(birth) {
        const date = new Date(birth);

        const year = date.getUTCFullYear();
        const month = '0'+String(date.getUTCMonth() + 1);
        const day = '0'+String(date.getUTCDate());

        return {
            iso: `${year}-${month.slice(-2)}-${day.slice(-2)}`,
            birthDay: `${day.slice(-2)}/${month.slice(-2)}`,
        };
    },
};
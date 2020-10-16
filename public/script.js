const paginate = document.querySelector(".paginate");

let totalPages = +paginate.dataset.total
    actualPage = +paginate.dataset.page
    filterPage = paginate.dataset.filter
    pages = pagination(actualPage, totalPages)
    elements = ""

function pagination(actualPage, totalPages) {
    let pages = [],
    oldPage = 0

    for (let page = 1; page <= totalPages; page++) {
        let firstAndLastPage = page == 1 || page == totalPages,
            pagesBefore = page >= actualPage - 2,
            pagesAfter = page <= actualPage + 2;

        if (firstAndLastPage || (pagesBefore && pagesAfter)) {
            if (oldPage && (page - oldPage) > 2 ) {
                pages.push('...');
            };

            if (page - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(page);

            oldPage = page;
        };
    };

    return pages
};

for (page of pages) {
    if (page == '...') {
        paginate.innerHTML += `<a id="nothing">${page}</a>`
    } else {
        if (filterPage) {
            paginate.innerHTML += `<a href="?page=${page}&filter=${filterPage}">${page}</a>`
        } else {
            paginate.innerHTML += `<a href="?page=${page}">${page}</a>`
        };
    };
};
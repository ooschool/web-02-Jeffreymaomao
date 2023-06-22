function replaceKeysWithUnderscore(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(replaceKeysWithUnderscore);
    }

    const newObj = {};

    Object.keys(obj).forEach((key) => {
        const newKey = key.replace(/[ \/]/g, '_');
        newObj[newKey] = replaceKeysWithUnderscore(obj[key]);
    });

    return newObj;
}

var content = replaceKeysWithUnderscore(content)

var data = [
    { id: null, text: "Change Mao Yang" },
    { id:"center", parentId: null, text: "<a id='center' href='#!'>Project</a>"},
];

Object.keys(content).forEach((page)=>{
    data.push({
        id: page,
        parentId: "center",
        text: `<a href='#!'>${page}</a>`
    })

    Object.keys(content[page]).forEach((subpage)=>{
        data.push({
            id: page + subpage,
            parentId: page,
            text: `<a href='#!'>${subpage}</a>`
        })

        Object.keys(content[page][subpage]).forEach((subsubpage)=>{
            data.push({
                id: page + subpage + subsubpage,
                parentId: page + subpage,
                text: `<a href='#!'>${subsubpage}</a>`
            })
            content[page][subpage][subsubpage].forEach((subsubsubpage)=>{
                const title = subsubsubpage["title"].replace(/[ \/\(\)]/g, '_');
                const link = subsubsubpage["link"]
                data.push({
                    id: page + subpage + subsubpage + title,
                    parentId: page + subpage + subsubpage,
                    text: `
                        <a href='${link}'>${subsubsubpage["title"]}</a> 
                        `
                })
            })
        })
    })

})
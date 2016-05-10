function formatData(data) {
    formattedData = {"name" : "CSCW Data", "children" : []};
    data.forEach(function (d) {
        for (var key in d) {
            if (d[key] == "" || d[key] == undefined) {
                continue;
            }
            entry = {"name" : key, "size" : d[key]};

            pos = schoolArrayPosition(key, formattedData.children);

            if (pos !== false) {
                formattedData.children[pos].children.push(entry);
            } else {
                formattedData.children.push({"name" : key, "children" : [entry]});
            }
        }
    });

    return formattedData;
}

function schoolArrayPosition(name, schools) {
    pos = false;
    schools.forEach(function (school, index) {
        if (school.name == name) {
            pos = index;
        }
    });

    return pos;
}

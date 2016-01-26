var config = {};
var xml2js = require('xml2js');
var http = require('http');
var Promise = require('promise');

var parser = new xml2js.Parser();
module.exports = {
    /**
     *
     * @param metadata
     * @param conf
     * @returns {{Array}|result}
     */
    map: function(metadata, conf){
        config = conf || require('./mapping.json');
        result = {};
        for(var i = 0; i < metadata.length; i++){
            var qual = metadata[i].qualifier;
            var elm = metadata[i].element;
            var lang = metadata[i].language;
            var value = metadata[i].value.replace(/\r?\n|\r/g, "");

            //Get the type and add it to the result array
            if(elm === "type"){
                if(value.indexOf("thesis") > -1){
                    result['RT'] = "Dissertation/Thesis";
                }else if(value.indexOf("abstract") > -1){
                    result['RT'] = "Abstract";
                }else{
                    result['RT'] = "Generic";
                }
            }

            //Some Edge cases
            if(elm === "title" && qual !== "alternative"){
                result['T1'] = value;
                continue;
            }

            if(elm === "publisher"){
                result['PB'] = value;
                continue
            }

            //Add Keywords
            if (elm === "subject"){
                var keytag = config.mapping[elm];
                result[keytag] == undefined ? result[keytag] = [value] : result[keytag].push(value);
                continue;
            }

            //If tag is undefined, ignore it
            var tag = config.mapping[qual] == undefined ? config.mapping[elm] : config.mapping[qual];
            if(tag === undefined){
                continue;
            }

            if(elm === "language" && qual === "iso"){
                value = config.lang[value];
                continue;
            }

            //Add primary authors to a array
            if(tag === "A1"){
                result[tag] == undefined ? result[tag] = [value] : result[tag].push(value);
                continue;
            }

            //Clean the issued date
            if(tag === "YR"){
                var yearArr = /^[12][0-9]{3}/.exec(value);
                result[tag] = yearArr[0];
                continue;
            }

            //If the tag is not empty, append the value to it
            if(result[tag] !== undefined){
                if (result[tag].constructor === Array){
                    result[tag].push(value);
                }else{
                    var oldvalue = result[tag];

                    var arr = [oldvalue];
                    arr.push(value);
                    result[tag] = arr;
                }
            }else {
                result[tag] = value;
            }
        }

        return result;
    },
    /**
     *
     * @param data
     * @returns {string}
     */
    maketext: function(data){
        var text = "";

        for(var key in data){
            if (data[key].constructor === Array){
                for(var i = 0; i < data[key].length; i++){
                    text += key + " " + data[key][i] + "\n"
                }
            }else{
                text += key + " " + data[key]+"\n";
            }
        }

        return text;
    },

    /**
     *
     * @param data
     * @returns {json} data
     */
    kktojson: function(data){

        var promise = new Promise(function(resolve, reject){
            parser.parseString(data, function(err, result){
                if(err)
                    reject(err);
                else
                    resolve(fromKK2JS(result));
            });
        });

        return promise;
    },

    /**
     *
     * @param data
     * @returns {json} data
     */
    oaidctojson: function(data){

        var promise = new Promise(function(resolve, reject){
            parser.parseString(data, function(err, result){
                if(err)
                    reject(err);
                else
                    resolve(fromQDC2JS(result));
            });
        });

        return promise;
    }
};


/**
 *
 * @param data
 * @returns {Array}
 */
var fromKK2JS = function(data){
    var result = data['OAI-PMH']['GetRecord'][0].record[0].metadata[0]['kk:metadata'][0]['kk:field'];
    var json = [];
    for(var i = 0; i < result.length; i++){
        var qualifier = result[i]['$'].qualifier;
        var element = result[i]['$'].element;
        var language = result[i]['$'].language;
        var value = result[i]['$'].value.replace(/\r?\n|\r/g, "");

        qualifier = qualifier !== undefined  ? qualifier : "none";

        var jsonobject = {schema: "dc", element: element, language: language, qualifier: qualifier, value: value};
        json.push(jsonobject);
    }
    return json;
};

var fromQDC2JS = function(data){
    var result = data['OAI-PMH']['GetRecord'][0].record[0].metadata[0]['oai_dc:dc'][0];
    delete result['$']
    var json = [];
    for(key in result){
        var element = key.split(':')[1];

        var jsonobject = {schema: "dc", element: element, value: result[key]};
        json.push(jsonobject);
    }

    return json;
};

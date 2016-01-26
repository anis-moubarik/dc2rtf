var should = require('chai').should(),
    dc2rtf = require('../index'),
    map = dc2rtf.map,
    maketext = dc2rtf.maketext,
    kktojson = dc2rtf.kktojson,
    oaidctojson = dc2rtf.oaidctojson;
var nock = require('nock');
var http = require('http');



var resource = nock("http://testurl.com")
    .get('/xml/').twice()
    .replyWithFile(200, __dirname + "/test.xml")
    .get('/xml2/').twice()
    .replyWithFile(200, __dirname + "/oaidc.xml");


describe("#map kkdc", function(){
    var mapped1;
    before(function(done){
        //Get kk xml
        var xml = '';
        http.get("http://testurl.com/xml/", function(res){
            res.on("data", function(data){ xml += data;});

            res.on("end", function(){
                kktojson(xml).then(function(data){
                    mapped1 = map(data);
                    done();
                });
            });
        });
    });

    it('should map kk metadata to a json object', function(){
        mapped1.should.be.a('Object');
    });

    it('should print valid RTF text', function(){
        var rtf = maketext(mapped1);

        console.log(rtf);
    });
});

describe("#map oaidc", function(){
    var mapped2;
    //Get oai dc
    var oaidcxml = '';
    http.get("http://testurl.com/xml2/", function(res){
        res.on("data", function(data){ oaidcxml += data; });

        res.on("end", function(){
            oaidctojson(oaidcxml).then(function(data){
                mapped2 = map(data);
                done();
            });
        });
    });

    it('should map oai dc metadata to a json object', function(){
        mapped2.should.be.a('Object');
    });
});

/**
 * Test the kk-format
 */
describe("#kktojson", function(){
    var result;
    before(function(done){
        var xml = '';
        http.get("http://testurl.com/xml/", function(res){
            res.on("data", function(data){ xml += data;});

            res.on("end", function(){
                kktojson(xml).then(function(data){
                    result = data;
                    done();
                });
            });
        });
    });

    it('should print valid json array from oai-pmh url', function(){
        result.should.be.a('Array');
    });

    it('should be length of 24', function(){
        result.should.have.length(24);
    });

    it("should have dc schema", function(){
        var schema = result[0].schema;
        schema.should.equal("dc");
    })
});

/**
 * Test the oaidc format
 */
describe("#oaidctojson", function(){
    var result;
    before(function(done){
        var xml = '';
        http.get("http://testurl.com/xml2/", function(res){
            res.on("data", function(data){ xml += data; });

            res.on("end", function(){
                oaidctojson(xml).then(function(data){
                    result = data;
                    done();
                });
            });
        });
    });

    it('should print valid json array from oai-pmh url', function(){
        result.should.be.a('Array');
    });

    it('should be length of 8', function(){
        result.should.have.length(8);
    });

    it('should have dc schema', function(){
        var schema = result[0].schema;
        schema.should.equal("dc");
    });
});
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


describe("#map", function(){
    var result;
    var mapped;
    before(function(done){
        var xml = '';
        http.get("http://testurl.com/xml/", function(res){
            res.on("data", function(data){ xml += data;});

            res.on("end", function(){
                kktojson(xml).then(function(data){
                    result = data;
                    mapped = map(result);
                    done();
                });
            });
        });
    });

   it('should map metadata to an json object', function(){
       mapped.should.be.a('Object');
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
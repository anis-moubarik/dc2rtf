var should = require('chai').should(),
    dc2rtf = require('../index'),
    map = dc2rtf.map,
    maketext = dc2rtf.maketext,
    dctojson = dc2rtf.dctojson,
    expect = require('chai').expect;
var nock = require('nock');
var http = require('http');


var resource = nock("http://testurl.com")
    .get('/xml/')
    .replyWithFile(200, __dirname + "/test.xml")

describe("#map", function(){
   it('maps metadata to an array', function(){
       "asd".should.equal("asd");
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
                dctojson(xml).then(function(data){
                    result = data;
                    done();
                });
            });
        });
    });

    it('should print valid json array from oai url', function(){
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
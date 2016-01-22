dc2rtf
======

A library to convert your Dublin Core metadata to Refworks Tagged Format.
For now it only works for National Library of Finlands KK format.

## Installation
    
    npm install <git here> --save
    
    
## Usage
    URL should be a link to a OAI-PMH provider f.ex. 
    http://www.example.com/oai/request?verb=GetRecord&metadataPrefix=kk&identifier=oai:www.example.com:12345/12345
    var dc2rtf = require('dc2rtf'),
        map = dc2rtf.map,
        maketext = dc2rtf.maketext;
        
     var text = maketext(map(metadataurl));
     console.log(text);
   
## Tests
   
    npm test
    
## Contributing

    In lieu of a formal styleguide, take care to maintain the existing coding style.
    Add unit tests for any new or changed functionality. Test your code.
    
## Release History

    * 0.0.1 Initial Release
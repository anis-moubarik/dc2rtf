dc2rtf
======

A library to convert your Dublin Core metadata to Refworks Tagged Format

## Installation
    
    npm install <git here> --save
    
    
## Usage

    var dc2rtf = require('dc2rtf'),
        map = dc2rtf.map,
        maketext = dc2rtf.maketext;
        
     var text = maketext(map(metadata));
     console.log(text);
   
## Tests
   
    npm test
    
## Contributing

    In lieu of a formal styleguide, take care to maintain the existing coding style.
    Add unit tests for any new or changed functionality. Test your code.
    
## Release History

    * 0.0.1 Initial Release
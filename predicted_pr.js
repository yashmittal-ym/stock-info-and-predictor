var {PythonShell} = require('python-shell');
var fs = require("fs");
var myJson = require("./myDataBase.json");

Date.prototype.subDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
}

var today = new Date(); 
var year = today.getFullYear();
var month = today.getMonth();
var dd = today.getDate() - 1;
var today1 = year.toString() + "-" + month.toString() + "-" + dd.toString();

const predic_script = (symbol) => {

    var options = {
      mode: 'text',
      pythonOptions: ['-u'],
      args: [symbol,today1],
    };

   
    console.log(myJson);
        if(myJson[symbol] == undefined || myJson[symbol]["date"] != today1)
        {
            PythonShell.run('script2.py', options, function (err, results) {
                if (err) 
                throw err;
                
                console.log('results: ' + symbol + '  ' + results);
                
                myJson[symbol] = {};
                myJson[symbol]["date"] = today1;
                myJson[symbol]["price"] = results[0];
                console.log(myJson);
                fs.writeFile( "myDataBase.json", JSON.stringify( myJson ), "utf8",function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                    return "success";
                  });
            });
            
        }
};

const getPrictedPrice = (symbol) => {
            return new Promise(function (resolve, reject) {
              fs.readFile('myDataBase.json', 'utf8', function (err, data) {
                if (err) {
                  reject(err)
                } else {
                let pp = JSON.parse(data);
                  resolve(pp[symbol]["price"]);
                }
              })
            })
};

module.exports = {
    predic_script,
    getPrictedPrice,
};


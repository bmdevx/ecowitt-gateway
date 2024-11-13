# Ecowitt Gateway

![GitHub last commit](https://img.shields.io/github/last-commit/bmdevx/ecowitt-gateway?style=flat-square)  [![npm](https://img.shields.io/npm/dt/ecowitt-gateway?style=flat-square)](https://www.npmjs.com/package/ecowitt-gateway) [![npm](https://img.shields.io/npm/v/ecowitt-gateway?style=flat-square)](https://www.npmjs.com/package/ecowitt-gateway) [![GitHub](https://img.shields.io/github/license/bmdevx/ecowitt-gateway?style=flat-square)](<https://github.com/bmdevx/ecowitt-gateway/blob/master/LICENSE>)

## Features

* Gets Live Data
* Gets Device Information
* Get/Set Custom Server Configuration

### Requirements

* NodeJS 8+
* Ecowitt Gateway Firmware 1.5.7+ (1.5.9+ for CO2 and 1.6.4+ for Rain commands)

### Methods

``` js
constructor('IP_ADDRESS', PORT, USE_RAIN_DATA, DEBUG) //Only IP_ADDRESS is required, port is 45000 by default, USE_RAIN_DATA is null by default which will check the firmware for optimal use and can be set to true or false

getSensors({            //Optional filter can be by type and/or status. Accepts strings or arrays of strings for type and status.
    type: 'WH65',
    status: 'active'
})

getLiveData(includeRain = true, filterActiveSensors = false) //Gets current Weather conditions. Including rain will append the getRain data while filterActiveSensors will remove non-active sensors if shown

getRainData()           //Gets Rain Data.

getRain()               //New method to get Rain information including Piezo and Rain Events

getSoilMoistureCalibration() //Gets Soil Moisture Calibration Data (including current analog and digital value for all connected sensors)

getPM25Offset()         // Gets PM25 Offset Data

getCO2Offset()          // Gets CO2 Offset Data

getFirmwareVersion()    //Gets current Firmware version.

getSystemParams()       //Gets System Parameters. (in development)

getMacAddr()            //Gets MAC Address

getCustomServerInfo()   //Gets Custom Server Information

setCustomServerInfo({  //Sets Custom Server Information (All Fields optional)
    station: 'STATION ID',        //Station Name
    key: 'KEY',                   //Station Key
    server: '192.168.X.X',        //Server Location
    port: 3000,                   //Port Number
    interval: 60,                 //Interval to send update in seconds(minimum 16)
    protocol: 'wunderground',     //Protocol (wunderground or ecowitt)
    enabled: true,                //Custom Server Enabled
    path_ecowitt: '/weather',     //Server Path for Wunderground Protocol
    path_wunderground: '/weather' //Server Path for Ecowitt Protocol
})

static discover(timeout)  //Find Gateways, Timeout in milliseconds
```

### Example

``` js
const EWG = require('ecowitt-gateway');
const gw = new EWG('192.168.X.X', 45000); //port default is 45000 and is optional

gw.getLiveData()
   .then(data => {
      console.log(JSON.stringify(data));
   });
```

## Future Development

* Get & Set more configuration settings

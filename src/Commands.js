const COMMANDS = {
    CMD_WRITE_SSID: 0x11,       // send router SSID and Password to wifi module
    CMD_BROADCAST: 0x12,        //looking for device inside network. Returned data size is 2 Byte

    CMD_READ_ECOWITT: 0x1E,     // read setting for Ecowitt.net
    CMD_WRITE_ECOWITT: 0x1F,    // write back setting for Ecowitt.net
    CMD_READ_WUNDERGROUND: 0x20,// read back setting for Wunderground
    CMD_WRITE_WUNDERGROUND: 0x21,// write back setting for Wunderground
    CMD_READ_WOW: 0x22,         // read setting for WeatherObservationsWebsite
    CMD_WRITE_WOW: 0x23,        // write back setting for WeatherObservationsWebsite
    CMD_READ_WEATHERCLOUD: 0x24,// read setting for Weathercloud
    CMD_WRITE_WEATHERCLOUD: 0x25,// write back setting for Weathercloud
    CMD_READ_SATION_MAC: 0x26,  // read  module MAC
    CMD_LIVEDATA: 0x27,         // read current，return size is 2 Byte
    CMD_GET_SOILHUMIAD: 0x28,   // read Soilmoisture Sensor calibration parameter
    CMD_SET_SOILHUMIAD: 0x29,   // write back Soilmoisture Sensor calibration parameter
    CMD_READ_CUSTOMIZED: 0x2A,  // read setting for Customized sever
    CMD_WRITE_CUSTOMIZED: 0x2B, // write back customized sever setting
    CMD_GET_MUlCH_OFFSET: 0x2C, // read multi channel sensor OFFSET value
    CMD_SET_MUlCH_OFFSET: 0x2D, // write back multi sensor OFFSET value
    CMD_GET_PM25_OFFSET: 0x2E,  // read PM2.5OFFSET value
    CMD_SET_PM25_OFFSET: 0x2F,  // write back PM2.5OFFSET value
    CMD_READ_SSSS: 0x30,        // read sensor setup (sensor frequency, wh24/wh65 sensor)
    CMD_WRITE_SSSS: 0x31,       // write back sensor setup

    CMD_READ_RAINDATA: 0x34,    // read rain data
    CMD_WRITE_RAINDATA: 0x35,   // write back rain data
    CMD_READ_GAIN: 0x36,        // read rain gain
    CMD_WRITE_GAIN: 0x37,       // write back rain gain
    CMD_READ_CALIBRATION: 0x38, //  read multiple parameter offset( refer to command description below in detail)
    CMD_WRITE_CALIBRATION: 0x39,//  write back multiple parameter offset
    CMD_READ_SENSOR_ID: 0x3A,   //  read Sensors ID
    CMD_WRITE_SENSOR_ID: 0x3B,  // write back Sensors ID
    CMD_READ_SENSOR_ID_NEW: 0x3C,// read Sensors ID New Versions

    CMD_WRITE_REBOOT: 0x40,     // system reset
    CMD_WRITE_RESET: 0x41,      // system default setting reset
    CMD_WRITE_UPDATE: 0x43,     // update firmware

    CMD_READ_FIRMWARE: 0x50,    // read back firmware version
    CMD_READ_USR_PATH: 0x51,    // read path for custom Server
    CMD_WRITE_USR_PATH: 0x52,   // write path for custom Server

    CMD_GET_CO2_OFFSET: 0x53,
    CMD_SET_CO2_OFFSET: 0x54,

    CMD_READ_RSTRAIN_TIME: 0x55, // read rain reset time
    CMD_WRITE_RSTRAIN_TIME: 0x56,// write rain reset time
    CMD_READ_RAIN: 0x57,
    CMD_WRITE_RAIN: 0x58
}

const COMMAND_RESP_SIZE =
{
    CMD_WRITE_SSID: 1,
    CMD_BROADCAST: 2,
    CMD_READ_ECOWITT: 1,
    CMD_WRITE_ECOWITT: 1,
    CMD_READ_WUNDERGROUND: 1,
    CMD_WRITE_WUNDERGROUND: 1,
    CMD_READ_WOW: 1,
    CMD_WRITE_WOW: 1,
    CMD_READ_WEATHERCLOUD: 1,
    CMD_WRITE_WEATHERCLOUD: 1,
    CMD_READ_SATION_MAC: 1,
    CMD_READ_CUSTOMIZED: 1,
    CMD_WRITE_CUSTOMIZED: 1,
    CMD_WRITE_UPDATE: 1,
    CMD_READ_FIRMWARE_VERSION: 1,
    CMD_LIVEDATA: 2,
    CMD_GET_SOILHUMIAD: 1,
    CMD_SET_SOILHUMIAD: 1,
    CMD_GET_MulCH_OFFSET: 1,
    CMD_SET_MulCH_OFFSET: 1,
    CMD_GET_PM25_OFFSET: 1,
    CMD_SET_PM25_OFFSET: 1,
    CMD_READ_SSSS: 1,
    CMD_WRITE_SSSS: 1,
    CMD_READ_RAINDATA: 1,
    CMD_WRITE_RAINDATA: 1,
    CMD_READ_GAIN: 1,
    CMD_WRITE_GAIN: 1,
    CMD_READ_CALIBRATION: 1,
    CMD_WRITE_CALIBRATION: 1,
    CMD_READ_SENSOR_ID: 1,
    CMD_WRITE_SENSOR_ID: 1,
    CMD_WRITE_REBOOT: 1,
    CMD_WRITE_RESET: 1,

    CMD_GET_CO2_OFFSET: 1,
    CMD_SET_CO2_OFFSET: 1,

    CMD_READ_RSTRAIN_TIME: 1,
    CMD_WRITE_RSTRAIN_TIME: 1,
    CMD_READ_RAIN: 1,
    CMD_WRITE_RAIN: 1
}

module.exports = {
    COMMANDS: COMMANDS,
    COMMAND_RESP_SIZE: COMMAND_RESP_SIZE
}
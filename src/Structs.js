const DATA_STRUCT = {
    /*x01*/ 1: ['intemp', 'temp', 2],
    /*x02*/ 2: ['outtemp', 'temp', 2],
    /*x03*/ 3: ['dewpoint', 'temp', 2],
    /*x04*/ 4: ['windchill', 'temp', 2],
    /*x05*/ 5: ['heatindex', 'temp', 2],
    /*x06*/ 6: ['inhumid', 'humid', 1],
    /*x07*/ 7: ['outhumid', 'humid', 1],
    /*x08*/ 8: ['absbarometer', 'pressure', 2],
    /*x09*/ 9: ['relbarometer', 'pressure', 2],
    /*x0A*/ 10: ['winddir', 'dir', 2],
    /*x0B*/ 11: ['windspeed', 'speed', 2],
    /*x0C*/ 12: ['gustspeed', 'speed', 2],

    /*x0D*/ 13: ['rainevent', 'rain', 2],
    /*x0E*/ 14: ['rainrate', 'rainRate', 2],
    /*x0F*/ 15: ['rainhour', 'rain', 2],
    /*x10*/ 16: ['rainday', 'rain', 2],
    /*x11*/ 17: ['rainweek', 'rain', 2],
    /*x12*/ 18: ['rainmonth', 'bigRain', 4],
    /*x13*/ 19: ['rainyear', 'bigRain', 4],
    /*x14*/ 20: ['raintotals', 'bigRain', 4],

    /*x15*/ 21: ['light', 'light', 4],
    /*x16*/ 22: ['uv', 'uv', 2],
    /*x17*/ 23: ['uvi', 'uvi', 1],
    /*x18*/ 24: ['datetime', 'datetime', 6],
    /*x19*/ 25: ['daymaxwind', 'speed', 2],
    /*x1A*/ 26: ['temp1', 'temp', 2],
    /*x1B*/ 27: ['temp2', 'temp', 2],
    /*x1C*/ 28: ['temp3', 'temp', 2],
    /*x1D*/ 29: ['temp4', 'temp', 2],
    /*x1E*/ 30: ['temp5', 'temp', 2],
    /*x1F*/ 31: ['temp6', 'temp', 2],
    /*x20*/ 32: ['temp7', 'temp', 2],
    /*x21*/ 33: ['temp8', 'temp', 2],
    /*x22*/ 34: ['humid1', 'humid', 1],
    /*x23*/ 35: ['humid2', 'humid', 1],
    /*x24*/ 36: ['humid3', 'humid', 1],
    /*x25*/ 37: ['humid4', 'humid', 1],
    /*x26*/ 38: ['humid5', 'humid', 1],
    /*x27*/ 39: ['humid6', 'humid', 1],
    /*x28*/ 40: ['humid7', 'humid', 1],
    /*x29*/ 41: ['humid8', 'humid', 1],
    /*x2A*/ 42: ['pm251', 'aq', 2],
    /*x2B*/ 43: ['soiltemp1', 'temp', 2],
    /*x2C*/ 44: ['soilmoist1', 'moist', 1],
    /*x2D*/ 45: ['soiltemp2', 'temp', 2],
    /*x2E*/ 46: ['soilmoist2', 'moist', 1],
    /*x2F*/ 47: ['soiltemp3', 'temp', 2],
    /*x30*/ 48: ['soilmoist3', 'moist', 1],
    /*x31*/ 49: ['soiltemp4', 'temp', 2],
    /*x32*/ 50: ['soilmoist4', 'moist', 1],
    /*x33*/ 51: ['soiltemp5', 'temp', 2],
    /*x34*/ 52: ['soilmoist5', 'moist', 1],
    /*x35*/ 53: ['soiltemp6', 'temp', 2],
    /*x36*/ 54: ['soilmoist6', 'moist', 1],
    /*x37*/ 55: ['soiltemp7', 'temp', 2],
    /*x38*/ 56: ['soilmoist7', 'moist', 1],
    /*x39*/ 57: ['soiltemp8', 'temp', 2],
    /*x3A*/ 58: ['soilmoist8', 'moist', 1],
    /*x3B*/ 59: ['soiltemp9', 'temp', 2],
    /*x3C*/ 60: ['soilmoist9', 'moist', 1],
    /*x3D*/ 61: ['soiltemp10', 'temp', 2],
    /*x3E*/ 62: ['soilmoist10', 'moist', 1],
    /*x3F*/ 63: ['soiltemp11', 'temp', 2],
    /*x40*/ 64: ['soilmoist11', 'moist', 1],
    /*x41*/ 65: ['soiltemp12', 'temp', 2],
    /*x42*/ 66: ['soilmoist12', 'moist', 1],
    /*x43*/ 67: ['soiltemp13', 'temp', 2],
    /*x44*/ 68: ['soilmoist13', 'moist', 1],
    /*x45*/ 69: ['soiltemp14', 'temp', 2],
    /*x46*/ 70: ['soilmoist14', 'moist', 1],
    /*x47*/ 71: ['soiltemp15', 'temp', 2],
    /*x48*/ 72: ['soilmoist15', 'moist', 1],
    /*x49*/ 73: ['soiltemp16', 'temp', 2],
    /*x4A*/ 74: ['soilmoist16', 'moist', 1],

    /*x4C*/ 76: ['lowbatt', 'batt', 16, 'utils'],

    /*x4D*/ 77: ['pm25_24hav_1', 'aq', 2],
    /*x4E*/ 78: ['pm25_24hav_2', 'aq', 2],
    /*x4F*/ 79: ['pm25_24hav_3', 'aq', 2],
    /*x50*/ 80: ['pm25_24hav_4', 'aq', 2],
    /*x51*/ 81: ['pm25_2', 'aq', 2],
    /*x52*/ 82: ['pm25_3', 'aq', 2],
    /*x53*/ 83: ['pm25_4', 'aq', 2],

    /*x58*/ 88: ['leak1', 'leak', 1],
    /*x59*/ 89: ['leak2', 'leak', 1],
    /*x5A*/ 90: ['leak3', 'leak', 1],
    /*x5B*/ 91: ['leak4', 'leak', 1],

    /*x60*/ 96: ['lightningdist', 'dist', 1],
    /*x61*/ 97: ['lightningdettime', 'utc', 4],
    /*x62*/ 98: ['lightningcount', 'count', 4],

    /*x63*/ 99: ['usertemp1', 'tempBatt', 3],
    /*x64*/ 100: ['usertemp2', 'tempBatt', 3],
    /*x65*/ 101: ['usertemp3', 'tempBatt', 3],
    /*x66*/ 102: ['usertemp4', 'tempBatt', 3],
    /*x67*/ 103: ['usertemp5', 'tempBatt', 3],
    /*x68*/ 104: ['usertemp6', 'tempBatt', 3],
    /*x69*/ 105: ['usertemp7', 'tempBatt', 3],
    /*x6A*/ 106: ['usertemp8', 'tempBatt', 3],

    /*x70*/ 112: ['co2', 'co2', 16],
    /*x71*/ //113: ['pm25aqi', decodePM25AQI, 0],

    /*x72*/ 114: ['leafwet1', 'bool', 1],
    /*x73*/ 115: ['leafwet2', 'bool', 1],
    /*x74*/ 116: ['leafwet3', 'bool', 1],
    /*x75*/ 117: ['leafwet4', 'bool', 1],
    /*x76*/ 118: ['leafwet5', 'bool', 1],
    /*x77*/ 119: ['leafwet6', 'bool', 1],
    /*x78*/ 120: ['leafwet7', 'bool', 1],
    /*x79*/ 121: ['leafwet8', 'bool', 1],

    /*x7A*/ 122: ['rain_source', 'uint8', 1],

    /*x80*/ 128: ['piezo_rainrate', 'rainRate', 2],
    /*x81*/ 129: ['piezo_rainevent', 'rain', 2],
    /*x82*/ 130: ['piezo_rainhour', 'rain', 2],
    /*x83*/ 131: ['piezo_rainday', 'bigRain', 4],
    /*x84*/ 132: ['piezo_rainweek', 'bigRain', 4],
    /*x85*/ 133: ['piezo_rainmonth', 'bigRain', 4],
    /*x86*/ 134: ['piezo_rainyear', 'bigRain', 4],
    /*x87*/ 135: ['piezo_gain', 'gain10', 20],
    /*x88*/ 136: ['rst_raintime', 'rstRain', 3],
}

const GENERIC_RESULT_STRUCT = [
    ['result', 'bool', 1]
]

const GENERIC_VALUE_RESULT_STRUCT = [
    ['result', 'int8', 1]
]

const WIFI_STRUCT = [
    ['ssid', 'string', null],
    ['key', 'string', null]
]


const CUSTOMIZED_SERVER_STRUCT = [
    ['station', 'string', null],
    ['key', 'string', null],
    ['server', 'string', null],
    ['port', 'uint16', 2],
    ['interval', 'uint16', 2],
    ['protocol', 'protocol', 1],
    ['enabled', 'bool', 1]
]


const USER_PATH_STRUCT = [
    ['path_ecowitt', 'string', null],
    ['path_wunderground', 'string', null]
]


const RAIN_DATA_STRUCT = [
    ['rain_rate', 'bigRain', 4],
    ['rain_day', 'bigRain', 4],
    ['rain_week', 'bigRain', 4],
    ['rain_month', 'bigRain', 4],
    ['rain_year', 'bigRain', 4]
]

const SOIL_DATA_STRUCT_GET = [
    ['channel', 'uint8', 1],
    ['current_humidity', 'uint8', 1],
    ['current_ad', 'uint16', 2],
    ['calibration_enabled', 'uint8', 1],
    ['min_ad', 'uint8', 1],
    ['max_ad', 'uint16', 2],
]

const SOIL_DATA_STRUCT_SET = [
    ['channel', 'uint8', 1],
    ['calibration_enabled', 'uint8', 1],
    ['min_ad', 'uint8', 1],
    ['max_ad', 'uint16', 2],
]


const CO2_STRUCT = [
    ['tf_co2', 'temp', 2],
    ['humi_co2', 'uint8', 1],
    ['pm10_co2', 'ugm3', 2],
    ['pm10_24h_co2', 'ugm3', 2],
    ['pm25_co2', 'ugm3', 2],
    ['pm25_24h_co2', 'ugm3', 2],
    ['co2', 'uint16', 2],
    ['co2_24h', 'uint16', 2],
    ['co2_batt', 'uint8', 1]
]

const CO2_OFFSET_STRUCT = [
    ['co2_offset', 'int16', 2],
    ['pm25_offset', 'ugm3_offset'],
    ['pm10_offset', 'ugm3_offset']
]

const PM25_OFFSET_STRUCT = [
    ['channel', 'uint8', 1],
    ['pm25_offset', 'ugm3_offset', 2],
]

module.exports = {
    DATA_STRUCT: DATA_STRUCT,

    GENERIC_RESULT_STRUCT: GENERIC_RESULT_STRUCT,
    GENERIC_VALUE_RESULT_STRUCT: GENERIC_VALUE_RESULT_STRUCT,

    CUSTOMIZED_SERVER_STRUCT: CUSTOMIZED_SERVER_STRUCT,

    USER_PATH_STRUCT: USER_PATH_STRUCT,

    RAIN_DATA_STRUCT: RAIN_DATA_STRUCT,

    SOIL_DATA_STRUCT_GET: SOIL_DATA_STRUCT_GET,
    SOIL_DATA_STRUCT_SET: SOIL_DATA_STRUCT_SET,

    CO2_STRUCT: CO2_STRUCT,

    CO2_OFFSET_STRUCT: CO2_OFFSET_STRUCT,
    PM25_OFFSET_STRUCT: PM25_OFFSET_STRUCT,
}




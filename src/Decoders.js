const DECODE = {
    'rain': decodeRain,
    'bigRain': decodeBigRain,
    'rainRate': decodeRainRate,
    'temp': decodeTemp,
    'ugm3': decodeUgm3,
    'ugm3_offset': decodeUgm3Offset,
    'humid': decodeHumid,
    'pressure': decodePress,
    'dir': decodeDir,
    'speed': decodeSpeed,
    'light': decodeLight,
    'uv': decodeUV,
    'uvi': decodeUVI,
    'datetime': decodeDatetime,
    'moist': decodeMoist,
    'aq': decodeAq,
    'batt': decodeBatt,
    'tempBatt': decodeTempBatt,
    'leak': decodeLeak,
    'dist': decodeDistance,
    'utc': decodeUTC,
    'count': decodeCount,
    'rstRain': decodeRstRain,
    'gain': decodeGain,
    'gain10': decodeGain10
}

/* Decode temperature data.
Data is contained in a two byte big endian signed integer and represents tenths of a degree celcius.
*/
function decodeTemp(idx, buffer) {
    return buffer.readInt16BE(idx) / 10;
}

/* Decode humidity data.
Data is contained in a single unsigned byte and represents whole units (%).
*/
function decodeHumid(idx, buffer) {
    return buffer.readInt8(idx);
}

/* Decode pressure data.
Data is contained in a two byte big endian integer and represents tenths of a unit (hpa).
*/
function decodePress(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode direction data.
Data is contained in a two byte big endian integer and represents whole degrees.
*/
function decodeDir(idx, buffer) {
    return buffer.readUInt16BE(idx);
}

/* Decode speed data.
Data is contained in a two byte big endian integer and represents tenths of m/s.
*/
function decodeSpeed(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode rain data.
Data is contained in a two byte big endian integer and represents tenths of mm.
*/
function decodeRain(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode rain rate data.
Data is contained in a two byte big endian integer and represents tenths of mm/hr.
*/
function decodeRainRate(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode 4 byte rain data.
Data is contained in a four byte big endian integer and represents tenths of a unit mm.
*/
function decodeBigRain(idx, buffer) {
    return buffer.readUInt32BE(idx) / 10.0;
}

/* Decode 4 byte light data.
Data is contained in a four byte big endian integer and represents tenths of a unit (lux).
*/
function decodeLight(idx, buffer) {
    return buffer.readUInt32BE(idx) / 10.0;
}

/* Decode 2 byte UV data.
Data is contained in a two byte big endian integer and represents tenths of a unit (µW/cm²).
*/
function decodeUV(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode UV Index.
Data is contained in a single unsigned byte and represents whole units (0-15).
*/
function decodeUVI(idx, buffer) {
    return buffer.readInt8(idx);
}

/* Decode date-time data.
Unknown format but length is six bytes.
*/
function decodeDatetime(idx, buffer) {
    return buffer.slice(idx, idx + 6);
}

/* Decode UTC time.
 
The Gateway API claims to provide 'UTC time' as a 4 byte big endian
integer. The 4 byte integer is a unix epoch timestamp; however,
the timestamp is offset by the stations timezone. So for a station
in the +10 hour timezone, the timestamp returned is the present
epoch timestamp plus 10 * 3600 seconds.
 
When decoded in localtime the decoded date-time is off by the
station time zone, when decoded as GMT the date and time figures
are correct but the timezone is incorrect.
 
In any case decode the 4 byte big endian integer as is and any
further use of this timestamp needs to take the above time zone
offset into account when using the timestamp.
*/
function decodeUTC(idx, buffer) {
    var val = buffer.readUInt32BE(idx);
    return (val === 0xFFFFFFFF) ? null : val;
}

/* Decode combined temperature and battery status data.
Data consists of three bytes; bytes 0 and 1 are normal temperature data
and byte 3 is battery status data.
*/
function decodeTempBatt(idx, buffer) {
    return {
        temp: buffer.readInt16BE(idx),
        batt: buffer.readInt8(idx + 2)
    }
}

/* Decode lightning distance.
Data is contained in a single byte integer and represents a value from 0 to 40km.
*/
function decodeDistance(idx, buffer) {
    var val = buffer.readInt8(idx);
    return val <= 40 ? val : null;
}

/* Decode lightning count.
Count is an integer stored in a 4 byte big endian integer.
*/
function decodeCount(idx, buffer) {
    return buffer.readUInt32BE(idx);
}

/* Decode moist data.
Data is contained in a single unsigned byte and represents whole units.
*/
function decodeMoist(idx, buffer) {
    return buffer.readInt8(idx);
}

/* Decode aq data.
Data is contained in a two byte big endian integer and represents tenths of a unit.
*/
function decodeAq(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode leak data.
Data is contained in a single unsigned byte and represents whole units.
*/
function decodeLeak(idx, buffer) {
    return buffer.readInt8(idx);
}

/* Decode Rain Reset Date & Time */
function decodeRstRain(idx, buffer) {
    const rstHr = buffer.readUInt8(idx);
    const rstDay = buffer.readInt8(idx + 1);
    const rstMonth = buffer.readUInt8(idx + 2);

    const MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'November',
        'December'
    ]

    return `${MONTHS[rstMonth]}, ${rstDay === 0 ? 'Sunday' : 'Monday'}, Hour: ${rstHr}`;
}

/* Decode Piezo Gain Field */
function decodeGain(idx, buffer) {
    return buffer.readUInt16BE(idx);
}

/* Decode Piezo Gain Fields */
function decodeGain10(idx, buffer) {
    var data = {}

    for (var i = 0; i < 10; i++) {
        data[`gain${i}`] = buffer.readUInt16BE(idx + i * 2);
    }

    return data;
}

/* Decode ug/m3 data */
function decodeUgm3(idx, buffer) {
    return buffer.readUInt16BE(idx) * 10;
}

/* Decode ug/m3 offset data */
function decodeUgm3Offset(idx, buffer) {
    return buffer.readInt16BE(idx) * 10;
}

/* Decode ppm data */
function decodePPM(idx, buffer) {
    return buffer.readUInt16BE(idx);
}


const MULTI_BATT = {
    'wh40': 4,
    'wh26': 5,
    'wh25': 6,
    'wh65': 7  //aka wh24
}

/* Decode battery status data.
Battery status data is provided in 16 bytes using a variety of
representations. Different representations include:
-   use of a single bit to indicate low/OK
-   use of a nibble to indicate battery level
-   use of a byte to indicate battery voltage
 
WH24, WH25, WH26(WH32), WH31, WH40, WH41 and WH51
stations/sensors use a single bit per station/sensor to indicate OK or
low battery. WH55 and WH57 sensors use a single byte per sensor to
indicate OK or low battery. WH68 and WS80 sensors use a single byte to
store battery voltage.
 
The battery status data is allocated as follows
Byte #  Sensor          Value               Comments
byte 1  WH40(b4)        0/1                 1=low, 0=normal
        WH26(WH32?)(b5) 0/1                 1=low, 0=normal
        WH25(b6)        0/1                 1=low, 0=normal
        WH24(b7)        0/1                 may be WH65, 1=low, 0=normal
        2  WH31 ch1(b0)    0/1                 1=low, 0=normal, 8 channels b0..b7
                ...
                ch8(b7)    0/1                 1=low, 0=normal
        3  WH51 ch1(b0)    0/1                 1=low, 0=normal, 16 channels b0..b7 over 2 bytes
                ...
                ch8(b7)    0/1                 1=low, 0=normal
        4       ch9(b0)    0/1                 1=low, 0=normal
                ...
                ch16(b7)   0/1                 1=low, 0=normal
        5  WH57            0-5                 <=1 is low
        6  WH68            0.02*value Volts
        7  WS80            0.02*value Volts
        8  Unused
        9  WH41 ch1(b0-b3) 0-5                 <=1 is low
                ch2(b4-b7) 0-5                 <=1 is low
        10      ch3(b0-b3) 0-5                 <=1 is low
                ch4(b4-b7) 0-5                 <=1 is low
        11 WH55 ch1        0-5                 <=1 is low
        12 WH55 ch2        0-5                 <=1 is low
        13 WH55 ch3        0-5                 <=1 is low
        14 WH55 ch4        0-5                 <=1 is low
        15 Unused
        16 Unused
 
For stations/sensors using a single bit for battery status 0=OK and
1=low. For stations/sensors using a single byte for battery
status >1=OK and <=1=low. For stations/sensors using a single byte for
battery voltage the voltage is 0.02 * the byte value.
 
    # WH24 F/O THWR sensor station
    # WH25 THP sensor
    # WH26(WH32) TH sensor
    # WH40 rain gauge sensor
*/
function decodeBatt(idx, buffer, fieldSize, utils) {
    var status = {};
    const batt_fields = (utils !== undefined && utils.batt_fields !== undefined) ? utils.batt_fields : BATT_FIELDS;

    batt_fields.forEach(([sensor, size, func, format]) => {
        const data = buffer.readUIntBE(idx, size);

        idx += size;

        if (func !== null) {
            func(status, sensor, data, size, format);
        }
    });

    return status;
}

const wh41_batt = {
    1: { 'shift': 0, 'mask': 0x0FFFF },
    2: { 'shift': 4, 'mask': 0x0FFF },
    3: { 'shift': 8, 'mask': 0x0FF },
    4: { 'shift': 12, 'mask': 0x0F }
}

const wh55_batt = {
    1: { 'shift': 0, 'mask': 0xFF },
    2: { 'shift': 8, 'mask': 0xFF },
    3: { 'shift': 16, 'mask': 0xFF },
    4: { 'shift': 24, 'mask': 0xFF }
}

const BATT_FIELDS = [
    ['multi', 1, battMultiMask, MULTI_BATT],
    ['wh31', 1, battMaskAll, null],
    ['wh51', 2, battMaskAll, null],
    ['wh57', 1, battVal, null],
    ['wh68', 1, battVolt, null],
    ['ws80', 1, battVolt, null],
    ['unused', 1, null, null],
    ['wh41', 2, battValSplit, wh41_batt],
    ['wh55', 4, battValEach, wh55_batt],
    ['unused', 1, null, null],
    ['unused', 1, null, null]
]


function battMultiMask(status, multiSensor, data, size, format) {
    for (const [sensor, maskBit] of Object.entries(format)) {
        status[sensor] = (data & maskBit) == 1;
    }
}

function battMaskAll(status, sensor, data, size) {
    var sensorStatus = {};

    for (var i = 0; i < 8 * size; i++) {
        sensorStatus[`ch${i + 1}`] = (data & i) == 1;
    }

    status[sensor] = sensorStatus;
}

function battVal(status, sensor, data, size, format) {
    status[sensor] = data >= 0 && data < 2;
}

function battValSplit(status, sensor, data, size, format) {
    var sensorStatus = {};

    for (const [ch, f] of Object.entries(format)) {
        var _data = (f.shift != null) ? data >> f.shift : data;

        if (f.mask != null) {
            _data = (_data & f.mask);

            if (_data == f.mask)
                _data = false;
        }

        sensorStatus[`ch${ch}`] = _data;
    }

    status[sensor] = sensorStatus;
}

function battValEach(status, sensor, data, size, format) {
    var sensorStatus = {};

    for (const [ch, f] of Object.entries(format)) {
        var _data = (f.shift != null) ? data >> f.shift : data;

        if (f.mask != null) {
            _data = (_data & f.mask);

            if (_data == f.mask)
                _data = false;
        }

        sensorStatus[`ch${ch}`] = _data;
    }

    status[sensor] = sensorStatus;
}

function battVolt(status, sensor, data, size) {
    status[sensor] = data < 256 ? false : data * 0.2;
}

module.exports = {
    DECODE: DECODE,
    MULTI_BATT: MULTI_BATT,
    BATT_FIELDS: BATT_FIELDS,
    decodeTemp: decodeTemp,
    decodeHumid: decodeHumid,
    decodePress: decodePress,
    decodeDir: decodeDir,
    decodeSpeed: decodeSpeed,
    decodeRain: decodeRain,
    decodeRainRate: decodeRainRate,
    decodeBigRain: decodeBigRain,
    decodeLight: decodeLight,
    decodeUV: decodeUV,
    decodeUVI: decodeUVI,
    decodeDatetime: decodeDatetime,
    decodeUTC: decodeUTC,
    decodeTempBatt: decodeTempBatt,
    decodeDistance: decodeDistance,
    decodeCount: decodeCount,
    decodeMoist: decodeMoist,
    decodeAq: decodeAq,
    decodeLeak: decodeLeak,
    decodeRstRain: decodeRstRain,
    decodeGain: decodeGain,
    decodeGain10: decodeGain10,
    decodeUgm3: decodeUgm3,
    decodeUgm3Offset: decodeUgm3Offset,
    decodePPM: decodePPM,
    decodeBatt: decodeBatt
}
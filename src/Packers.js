const { decodeUgm3Offset } = require("./Decoders");

const PACK = {
    'string': packString,
    'bool': packBool,
    'int8': packInt8,
    'uint8': packUInt8,
    'int16': packInt16,
    'uint16': packUInt16,
    'int32': packInt32,
    'uint32': packUInt32,
    'protocol': packProtocol,
    'rain': packRain,
    'bigRain': packBigRain,
    // 'temp': packTemp,
    'ugm3': packUgm3,
    // 'co2': packCO2,
    // 'humid': packHumid,
    // 'pressure': packPress,
    // 'dir': packDir,
    // 'speed': packSpeed,
    // 'light': packLight,
    // 'uv': packUV,
    // 'uvi': packUVI,
    // 'datetime': packDatetime,
    // 'moist': packMoist,
    // 'aq': packAq,
    // 'batt': packBatt,
    // 'tempBatt': packTempBatt,
    // 'leak': packLeak,
    // 'dist': packDistance,
    // 'utc': packUTC,
    // 'count': packCount,
}

function packString(idx, buffer, str) {
    buffer.writeInt8(str.length, idx);
    idx++;
    buffer.write(str, idx, str.length, 'utf8');
    idx += str.length;

    return [idx, buffer];
}


function packBool(idx, buffer, data) {
    return packInt8(idx, buffer, data ? 1 : 0);
}


function packInt8(idx, buffer, data) {
    buffer.writeInt8(data, idx);
    return [idx + 1, buffer];
}

function packUInt8(idx, buffer, data) {
    buffer.writeUInt8(data, idx);
    return [idx + 1, buffer];
}


function packInt16(idx, buffer, data) {
    buffer.writeInt16BE(data, idx);
    return [idx + 2, buffer];
}

function packUInt16(idx, buffer, data) {
    buffer.writeUInt16BE(data, idx);
    return [idx + 2, buffer];
}


function packInt32(idx, buffer, data) {
    buffer.writeInt32BE(data, idx);
    return [idx + 4, buffer];
}

function packUInt32(idx, buffer, data) {
    buffer.writeUInt32BE(data, idx);
    return [idx + 4, buffer];
}


function packProtocol(idx, buffer, data) {
    return packInt8(idx, buffer, ('ecowitt' == data ? 0 : 1));
}


function packRain(idx, buffer, value) {
    return packUInt16(idx, buffer, value * 10);
}

function packBigRain(idx, buffer, value) {
    return packUInt32(idx, buffer, value * 10);
}

/* Pack ug/m3 data */
function packUgm3(idx, buffer, value) {
    return packUInt16(idx, buffer, value / 10);
}

/* Pack ug/m3 data */
function packUgm3Offset(idx, buffer, value) {
    return packInt16(idx, buffer, value / 10);
}

module.exports = {
    PACK: PACK,
    packString: packString,
    packBool: packBool,
    packInt8: packInt8,
    packUInt8: packUInt8,
    packInt16: packInt16,
    packUInt16: packUInt16,
    packInt32: packInt32,
    packUInt32: packUInt32,
    packProtocol: packProtocol,
    packRain: packRain,
    packBigRain: packBigRain,
    packUgm3: packUgm3,
    packUgm3Offset: packUgm3Offset
}
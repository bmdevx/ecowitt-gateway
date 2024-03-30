const PARSE = {
    'string': parseString,
    'bool': parseBool,
    'int8': parseInt8,
    'uint8': parseUInt8,
    'int16': parseInt16,
    'uint16': parseUInt16,
    'int32': parseInt32,
    'uint32': parseUInt32,
    'protocol': parseProtocol,
}


function parseString(idx, buffer, length) {
    return buffer.toString('utf8', idx, idx + length);
}


function parseBool(idx, buffer) {
    return buffer.readInt8(idx) == 1;
}


function parseInt8(idx, buffer) {
    return buffer.readInt8(idx);
}

function parseUInt8(idx, buffer) {
    return buffer.readUInt8(idx);
}


function parseInt16(idx, buffer) {
    return buffer.readInt16BE(idx);
}

function parseUInt16(idx, buffer) {
    return buffer.readUInt16BE(idx);
}


function parseInt32(idx, buffer) {
    return buffer.readInt32BE(idx);
}

function parseUInt32(idx, buffer) {
    return buffer.readUInt32BE(idx);
}


function parseProtocol(idx, buffer) {
    return (buffer.readInt8(idx) == 0) ? 'ecowitt' : 'wunderground';
}


module.exports = {
    PARSE: PARSE,
    parseString: parseString,
    parseBool: parseBool,
    parseInt8: parseInt8,
    parseUInt8: parseUInt8,
    parseInt16: parseInt16,
    parseUInt16: parseUInt16,
    parseInt32: parseInt32,
    parseUInt32: parseUInt32,
    parseProtocol: parseProtocol
}
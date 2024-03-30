const { PARSE } = require('./Parsers');
const { DECODE, BATT_FIELDS, MULTI_BATT } = require('./Decoders');
const { CO2_STRUCT } = require('./Structs');

const PARSE_DECODERS = {
    'co2': decodeCO2
};
Object.assign(PARSE_DECODERS, PARSE);
Object.assign(PARSE_DECODERS, DECODE);


function parseStructStrict(buffer, struct, idx = 4) {
    var data = {};

    struct.forEach(([field, funcName, fieldSize, extra]) => {
        const func = PARSE_DECODERS[funcName];
        if (func !== undefined) {
            if (typeof extra === 'string' && extra === 'utils') {
                extra = this;
            }

            if (fieldSize == null) {
                fieldSize = buffer.readUInt8(idx);

                data[field] = func(idx + 1, buffer, fieldSize, extra);
                idx += fieldSize + 1;
            } else {
                data[field] = func(idx, buffer, fieldSize, extra);
                idx += fieldSize;
            }
        } else {
            throw 'Unknown Parse/Decode Function';
        }
    });

    return data;
}

function packStructStrict(data, struct) {
    var buffer = new Buffer.alloc(256);
    var idx = 0;

    struct.forEach(([field, funcName, fieldSize, extra]) => {
        const func = PARSE_DECODERS[funcName];
        if (func !== undefined) {
            if (typeof extra === 'string' && extra === 'utils') {
                extra = this;
            }

            const [nidx, nbuffer] = func(idx, buffer, data[field], extra);
            idx = nidx;
            buffer = nbuffer;
        } else {
            throw 'Unknown Parse/Decode Function';
        }
    });

    return Uint8Array.from(buffer.slice(0, idx));
}


/* Decode CO2 Fields */
function decodeCO2(idx, buffer) {
    return parseStructStrict(buffer, CO2_STRUCT, idx);
}


module.exports = {
    PARSE_DECODERS: PARSE_DECODERS,
    PARSE: PARSE,
    DECODE: DECODE,
    MULTI_BATT: MULTI_BATT,
    BATT_FIELDS: BATT_FIELDS,
    parseStructStrict: parseStructStrict,
    packStructStrict: packStructStrict
}
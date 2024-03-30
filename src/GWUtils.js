const {
    DATA_STRUCT,
    GENERIC_RESULT_STRUCT, GENERIC_VALUE_RESULT_STRUCT,
    CUSTOMIZED_SERVER_STRUCT,
    SOIL_DATA_STRUCT_GET, SOIL_DATA_STRUCT_SET,
    USER_PATH_STRUCT,
    RAIN_DATA_STRUCT,
    PM25_OFFSET_STRUCT,
    CO2_OFFSET_STRUCT
} = require('./Structs');
const {
    PARSE_DECODERS,
    BATT_FIELDS,
    parseStructStrict,
    packStructStrict,
} = require('./ParseDecoders');
const {
    decodeUgm3
} = require('./Decoders');
const {
    SENSOR_IDS
} = require('./Sensors');
const { parseUInt16 } = require('./Parsers');


class GWUtils {
    constructor(isWH24 = false) {
        this.batt_fields = [];
        Object.assign(this.batt_fields, BATT_FIELDS);
        var multi_batt = this.batt_fields[0][3];

        if (isWH24) {
            if (multi_batt.wh24 == undefined) {
                multi_batt.wh24 = multi_batt.wh65;
                delete multi_batt.wh65;
            }
        } else {
            if (multi_batt.wh65 == undefined) {
                multi_batt.wh65 = multi_batt.wh24;
                delete multi_batt.wh24;
            }
        }
    }


    parseResult(buffer, hasValue = false) {
        const result = parseStructStrict(buffer, hasValue ? GENERIC_VALUE_RESULT_STRUCT : GENERIC_RESULT_STRUCT);
        result['cmd'] = buffer.readUInt8(3);
        return result;
    }


    parseSensorData(buffer, filter = null, newVersion = true) {
        const statusFilter = (filter && filter.status) ?
            (typeof filter.status === 'string') ?
                (status) => status.includes(filter.status.toLowerCase()) :
                Array.isArray(filter.status) ?
                    (status) => filter.status.includes(status.toLowerCase()) :
                    (x) => true
            : (x) => true;

        const typeFilter = (filter && filter.type) ?
            (typeof filter.type === 'string') ?
                (type) => type.includes(filter.type.toUpperCase()) :
                Array.isArray(filter.type) ?
                    (type) => filter.type.includes(type.toUpperCase()) :
                    (x) => true
            : (x) => true;

        var sensors = [];
        const payloadSize = newVersion ? parseUInt16(3, buffer) : buffer[3];
        const startIndex = newVersion ? 5 : 4;
        const bytesPerSensorData = 7;

        for (var i = startIndex; i < payloadSize; i += bytesPerSensorData) {
            var id = buffer.toString('hex', i + 1, i + 5).toUpperCase();
            var typeID = buffer[i];
            var type = typeID < SENSOR_IDS.length && typeID >= 0 ? SENSOR_IDS[typeID] : `Unknown Type (${id})`;

            var status =
                id == 'FFFFFFFE' ? 'disabled' :
                    id == 'FFFFFFFF' ? 'registering' :
                        'active';

            if (statusFilter(status) && typeFilter(type)) {
                sensors.push({
                    type: type,
                    status: status,
                    id: status == 'active' ? parseInt(id, 16).toString(16).toUpperCase() : null, //remove leading 0's
                    battery: status == 'active' ? buffer[i + 5] : null,
                    signal: status == 'active' ? buffer[i + 6] : null
                });
            }
        }

        return sensors;
    }

    parseLiveData(buffer, timestamp = null) {
        var data = {}, idx = 5;
        const size = buffer.readUInt16BE(3);

        while (idx < size && idx < buffer.length - 1) {
            const cix = buffer.readUInt8(idx++);
            if (DATA_STRUCT[cix] === undefined) {
                break;
            }

            var [field, funcName, fieldSize, extra] = DATA_STRUCT[cix];

            if (PARSE_DECODERS[funcName] != undefined) {
                if (typeof extra === 'string' && extra === 'utils') {
                    extra = this;
                }

                data[field] = PARSE_DECODERS[funcName](idx, buffer, fieldSize, extra);

                idx += fieldSize;
            } else {
                throw 'Unknown Parse/Decode Function';
            }
        }

        if ('datetime' in data === false) {
            data['datetime'] = timestamp != null ? timestamp : Date.now();
        }

        return data;
    }


    parseRainData(buffer) {
        return parseStructStrict(buffer, RAIN_DATA_STRUCT);
    }

    parseRain(buffer) {
        const size = buffer.readUInt16BE(3);
        var data = {}, idx = 5;

        while (idx < size - 1 && idx < buffer.length - 1) {
            const cix = buffer.readUInt8(idx++);
            if (DATA_STRUCT[cix] === undefined) {
                throw 'Unknown Field Type';
            }

            const [field, funcName, fieldSize, extra] = DATA_STRUCT[cix];

            if (PARSE_DECODERS[funcName] != undefined) {
                if (typeof extra === 'string' && extra === 'utils') {
                    extra = this;
                }

                data[field] = PARSE_DECODERS[funcName](idx, buffer, fieldSize, extra);

                idx += fieldSize;
            } else {
                throw 'Unknown Decode Function';
            }
        }

        return data;
    }

    packRainData(data) {
        return packStructStrict(data, RAIN_DATA_STRUCT);
    }


    parseCustomServerInfo(buffer) {
        return parseStructStrict(buffer, CUSTOMIZED_SERVER_STRUCT);
    }

    packCustomServerInfo(data) {
        return packStructStrict(data, CUSTOMIZED_SERVER_STRUCT);
    }

    parseUserPathInfo(buffer) {
        return parseStructStrict(buffer, USER_PATH_STRUCT);
    }

    packUserPathInfo(data) {
        return packStructStrict(data, USER_PATH_STRUCT);
    }


    parseSoilData(buffer) {
        const sizeOfSoilDataStruct = 8
        var idx = 4
        var data = []

        while (idx < buffer.length - 1) {
            var soilSlice = buffer.slice(idx, idx + sizeOfSoilDataStruct)

            data.push(parseStructStrict(soilSlice, SOIL_DATA_STRUCT_GET, 0));

            idx += sizeOfSoilDataStruct;
        }
        return data;
    }

    packSoilData(data) {
        return packStructStrict(data, SOIL_DATA_STRUCT_SET);
    }


    parsePM25Data(buffer) {
        const sizeOfPM25Struct = 3
        var idx = 4
        var sensors = []

        while (idx < buffer.length - 3) {
            var pm25Sensor = buffer.slice(idx, idx + sizeOfPM25Struct)

            sensors.push(parseStructStrict(pm25Sensor, PM25_OFFSET_STRUCT, 0));

            idx += sizeOfPM25Struct;
        }

        return sensors;
    }


    parseCO2OffsetData(buffer) {
        return parseStructStrict(buffer, CO2_OFFSET_STRUCT);
    }


    static calcChecksum(body) {
        var chksum = 0;
        body.forEach(b => chksum += b);
        return chksum % 256;
    };
}


module.exports = GWUtils;
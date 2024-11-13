const dgram = require('dgram');
const net = require('net');
const GWUtils = require('./GWUtils');

const { COMMANDS } = require('./Commands');

class EWGateway {
    constructor(ipAddr, port = 45000, useReadRainData = null, debug = false) {

        this.ipAddr = ipAddr;
        this.port = port;
        this.debug = debug;
        this.utils = new GWUtils();

        this.useReadRainData = false;

        const gateway = this;

        const buildPacket = (command, data) => {
            var size = (data !== null ? data.length : 0) + 3;
            var body = [command, size].concat(data !== null ? data : []);
            return new Uint8Array([255, 255].concat(body, [GWUtils.calcChecksum(body)]));
        };

        const checkResponse = (resp, cmd, callback) => {
            if (resp == null) {
                callback(resp, 'No Response');
            } else if (resp.length < 3) {
                callback(resp, 'Invalid Response');
            } else if (resp[2] != cmd) {
                callback(resp, 'Invalid Command Code Response');
            } else if (resp[resp.length - 1] != GWUtils.calcChecksum(resp.slice(2, resp.length - 1))) {
                callback(resp, 'Invalid Checksum');
            } else {
                callback(resp, null);
            }
        };

        this.runCommand = (command, data = null) => {
            return new Promise((res, rej) => {
                const client = new net.Socket();
                client.setTimeout(2000, () => {
                    client.destroy();
                    rej('Connection Timeout')
                });

                client.connect(port, ipAddr, () => {
                    if (gateway.debug) {
                        console.debug(`Connected. Executing CMD 0x${command.toString(16)}`);
                    }

                    client.write(buildPacket(command, data));
                });

                client.on('data', (buffer) => {
                    if (gateway.debug) {
                        console.debug(`Received Data: ${buffer != null ? buffer.length : 0} bytes`);
                    }
                    client.destroy(); // kill client after server's response as to not mix up commands

                    checkResponse(buffer, command, (data, err) => {
                        err ? rej(err) : res(data);
                    });
                });

                client.on('close', () => {
                    if (gateway.debug) console.debug('Connection Closed');
                });
                
                client.on('error', rej);
                client.on('timeout', () => rej('Connection Timeout'));
            });
        };

        if (useReadRainData == null)
        {
            this.getFirmwareVersion()
                .then(firmware => {
                    if (firmware && !firmware.toUpperCase().includes('GW2000')) {
                        this.useReadRainData = true;
                    }
                })
                .catch();
        } else{
            this.useReadRainData = useReadRainData;
        }
    }


    getSensors(filter = null) {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_SENSOR_ID_NEW)
                .then(buffer => {
                    if (buffer.length > 200) {
                        const sensors = this.utils.parseSensorData(buffer, filter);

                        if (filter === null) {
                            this.sensors = sensors;
                        }

                        res(sensors);
                    } else {
                        rej('Invalid Data Length');
                    }
                })
                .catch(rej);
        });
    }


    getLiveData(includeRain = true, filterActiveSensors = false) {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_LIVEDATA)
                .then(buffer => {
                    var data = this.utils.parseLiveData(buffer);

                    const appendRain = (data) => {
                        (this.useReadRainData ? this.getRainData() : this.getRain())
                            .then(rainData => {
                                Object.assign(data, rainData);
                            })
                            .catch()
                            .finally(_ => {
                                res(data);
                            });
                    };

                    const filterSensors = (data, sensors) => {
                        if (data.lowbatt) {
                            Object.keys(data.lowbatt).forEach(key => {
                                var ukey = key.toUpperCase();

                                if (typeof data.lowbatt[key] === 'object') {

                                    Object.keys(data.lowbatt[key]).forEach(chn => {
                                        const uchn = chn.toUpperCase();
                                        const usen = key.toUpperCase();

                                        if (sensors.filter(s => s.type === `${usen}_${uchn}` && s.status === 'active').length < 1) {
                                            delete data.lowbatt[key][chn];
                                        }
                                    });

                                    if (Object.keys(data.lowbatt[key]).length < 1) {
                                        delete data.lowbatt[key];
                                    }
                                } else {
                                    if (sensors.filter(s => s.type === ukey && s.status === 'active').length < 1) {
                                        delete data.lowbatt[key];
                                    }
                                }
                            });
                        }

                        if (includeRain) {
                            appendRain(data);
                        } else {
                            res(data);
                        }
                    };


                    if (filterActiveSensors) {
                        if (this.sensors === undefined) {
                            this.getSensors()
                                .then(sensors => {
                                    filterSensors(data, sensors);
                                });
                        } else {
                            filterSensors(data, this.sensors);
                        }
                    } else if (includeRain) {
                        appendRain(data);
                    } else {
                        res(data);
                    }
                })
                .catch(rej);
        });
    }


    getRainData() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_RAINDATA)
                .then(buffer => {
                    try {
                        res(this.utils.parseRainData(buffer));
                    } catch (error) {
                        rej(error);
                    }
                })
                .catch(rej);
        });
    }

    setRainData(data) {
        return new Promise((res, rej) => {
            this.getRainData()
                .then(rd => {
                    Object.assign(rd, data);

                    if (typeof rd.rain_rate !== 'number' || rd.rain_rate < 0) {
                        rej('Rain Rate must be a number >= 0.');
                        return;
                    }

                    if (typeof rd.rain_day !== 'number' || rd.rain_day < 0) {
                        rej('Rain Day must be a number >= 0.');
                        return;
                    }

                    if (typeof rd.rain_week !== 'number' || rd.rain_week < 0) {
                        rej('Rain Week must be a number >= 0.');
                        return;
                    }

                    if (typeof rd.rain_month !== 'number' || rd.rain_month < 0) {
                        rej('Rain Month must be a number >= 0.');
                        return;
                    }

                    if (typeof rd.rain_year !== 'number' || rd.rain_year < 0) {
                        rej('Rain Year must be a number >= 0.');
                        return;
                    }

                    const packetRain = this.utils.packRainData(rd);

                    this.runCommand(COMMANDS.CMD_WRITE_RAINDATA, packetRain)
                        .then(cr => {
                            res({
                                status: 'Rain Updated',
                                data: rd
                            });
                        })
                        .catch(rej);
                })
                .catch(rej);
        });
    }

    //New Version with Piezo Data
    getRain() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_RAIN)
                .then(buffer => {
                    try {
                        res(this.utils.parseRain(buffer));
                    } catch (error) {
                        rej(error)
                    }
                })
                .catch(rej);
        });
    }


    getSoilMoistureCalibration() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_GET_SOILHUMIAD)
                .then(buffer => {
                    res(this.utils.parseSoilData(buffer));
                })
                .catch(rej);
        });
    }

    setSoilMoistureCalibration(data) {
        return new Promise((res, rej) => {
            this.getSoilMoistureCalibration()
                .then(sd => {
                    Object.assign(sd, data);

                    if (typeof sd.channel !== 'number' || sd.channel < 1 || sd.channel > 8) {
                        rej('Channel must be a number from 1 to 8.');
                        return;
                    }

                    if (typeof sd.calibration_enabled !== 'number' || sd.calibration_enabled < 0 || sd.calibration_enabled > 1) {
                        rej('Customize Calibration Option must be either 1 or enabled or 0 for disabled.');
                        return;
                    }

                    if (typeof sd.min_ad !== 'number' || sd.min_ad < 0) {
                        rej('min AD must be a number >= 0.');
                        return;
                    }

                    if (typeof sd.max_ad !== 'number' || sd.max_ad < 0) {
                        rej('min AD must be a number >= 0.');
                        return;
                    }

                    const packetSoil = this.utils.packSoilData(sd);

                    this.runCommand(COMMANDS.CMD_SET_SOILHUMIAD, packetSoil)
                        .then(ss => {
                            const ssResult = this.utils.parseResult(ss);

                            if (ssResult.result) {
                                res({
                                    status: 'Soil Updated',
                                    data: sd
                                });
                            } else {
                                rej({
                                    status: 'Soil Calibration Not Updated',
                                    data: sd
                                });
                            }
                        });
                })
                .catch(rej);
        });
    }


    getPM25Offset() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_GET_PM25_OFFSET)
                .then(buffer => {
                    res(this.utils.parsePM25Data(buffer));
                })
                .catch(rej);
        });
    }

    getCO2Offset() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_GET_CO2_OFFSET)
                .then(buffer => {
                    res(this.utils.parseCO2OffsetData(buffer));
                })
                .catch(rej);
        });
    }


    getFirmwareVersion() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_FIRMWARE)
                .then(buffer => {
                    res(buffer.slice(5, buffer.length - 1).toString('ascii'));
                })
                .catch(rej);
        });
    }


    getSystemParams() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_SSSS)
                .then(buffer => {
                    //todo parse
                    res(buffer.toString('hex'));
                })
                .catch(rej);
        });
    }


    getMacAddr() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_SATION_MAC)
                .then(buffer => {
                    res(buffer.toString('hex', 4, buffer.length - 1).toUpperCase());
                })
                .catch(rej);
        });
    }


    getCustomServerInfo() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_CUSTOMIZED)
                .then(buffer => {
                    var info = this.utils.parseCustomServerInfo(buffer);

                    this.runCommand(COMMANDS.CMD_READ_USR_PATH)
                        .then(buffer => {
                            Object.assign(info, this.utils.parseUserPathInfo(buffer));
                            res(info);
                        });
                })
                .catch(rej);
        });
    }

    setCustomServerInfo(data) {
        return new Promise((res, rej) => {
            this.getCustomServerInfo()
                .then(csi => {
                    Object.assign(csi, data);

                    if (csi.interval < 16) {
                        rej('Upload Interval must be >= 16 and < 3600 seconds.');
                        return;
                    }

                    if (csi.protocol !== 'wunderground' && csi.protocol !== 'ecowitt') {
                        rej('Protocol must be \'wunderground\' or \'ecowitt\'.');
                        return;
                    }

                    const packetCI = this.utils.packCustomServerInfo(csi);
                    const packetUP = this.utils.packUserPathInfo(csi);

                    this.runCommand(COMMANDS.CMD_WRITE_CUSTOMIZED, packetCI)
                        .then(cr => {
                            const crResult = this.utils.parseResult(cr);

                            if (crResult.result) {
                                this.runCommand(COMMANDS.CMD_WRITE_USR_PATH, packetUP)
                                    .then(wspRes => {
                                        const wspResult = this.utils.parseResult(wspRes);

                                        if (wspResult.result) {
                                            res({
                                                status: 'Server Updated',
                                                data: csi
                                            });
                                        } else {
                                            rej({
                                                status: 'Server Not Updated',
                                                data: csi
                                            })
                                        }
                                    });
                            } else {
                                rej({
                                    status: 'Server Not Updated',
                                    data: csi
                                })
                            }
                        })
                        .catch(rej);
                })
                .catch(rej);
        });
    }



    static discover(timeout = 5000) {
        return new Promise((res, rej) => {
            const server = dgram.createSocket('udp4');
            var ips = [];

            server.on('message', (msg, rinfo) => {
                if (!ips.includes(rinfo.address)) {
                    ips.push(rinfo.address);
                }
            });

            server.bind(59387);

            setTimeout(() => {
                server.close(() => {
                    res(ips);
                });
            }, timeout);
        });
    }
}

module.exports = EWGateway;
# Avimesa Group API Node Package (Alpha)
Node.js SDK for the Avimesa Group API using AMQP (0-9-1)

## Introduction

This project the source code for the **@avimesa/group-api-amqp** npm package.  The Avimesa Group API is documented [here](#https://github.com/Avimesa/user-guide-group-api-amqp#4.-group-api) in detail.

<a id="toc"></a>
## Table of Contents
- [1. Quick Start](#1.-quick-start)
- [2. API Reference](#2.-api-reference)
    - Group Level
        - [listDevices](#2.1-api-reference)
        - [addDevice](#2.2-api-reference)
        - [removeDevice](#2.3-api-reference)
    - Device Level
        - [actuate](#2.4-api-reference)
        - [listFiles](#2.5-api-reference)
        - [uploadScript](#2.6-api-reference)
        - [uploadConfig](#2.7-api-reference)
        - [uploadDfuPackage](#2.8-api-reference)
        - [updateAuthKey](#2.9-api-reference)
    - Queue Level
        - [consume](#2.10-api-reference)
        - [listen](#2.11-api-reference)
        - [count](#2.12-api-reference)
        - [purge](#2.13-api-reference)
       


<a id="1.-quick-start"></a>
## 1. Quick Start

Install the package:
```
npm install @avimesa/group-api-amqp
```

Update or add your .env file in the project root:
```
# RMQ Server Hostname
RMQ_HOSTNAME=rmqserv001.avimesa.com

# RMQ Server Port
RMQ_PORT=5671

# RMQ Group ID / Vhost
RMQ_GROUP_ID= ** TODO **

# RMQ Authentication Key
RMQ_AUTH_KEY= ** TODO **

# Set this to 0 to allow certless TLS
NODE_TLS_REJECT_UNAUTHORIZED=0
```

Load the package:
```
...
const api = require('@avimesda/group-api-amqp');
...
```

Use API per documentation, for example, listing Devices for the Group:

```
api.listDevices(function(err, devices){
	if(!err){
		for (var i = 0; i < devices.length; i++){
			console.log(devices[i]);
		}
	}
});
```

[Top](#toc)<br>
<a id="2.-api-reference"></a>
## 2. API Reference

<a id="2.1-api-reference"></a>
### listDevices

##### Callback

```
listDevices(function(err, devices){ ... })
```

Lists the devices for the Group (which is specified in credentials in the .env file)

Parameters:

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `devices` (array) - array of device IDs in string form




[Top](#toc)<br>
<a id="2.2-api-reference"></a>
### addDevice

##### Callback

```
addDevice(devId, function(err, authKey){ ... })
```

Adds a Device to the Group.  If successful, a generated Authentication Key is provided in the response.    

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.


The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `authKey` (string) - the 128bit authentication key (32 characters, a-f0-9)

Notes:

- Use the `validDeviceId` utility function




[Top](#toc)<br>
<a id="2.3-api-reference"></a>
### removeDevice

##### Callback

```
removeDevice(devId, function(err, msg){ ... })
```

Removes a Device from the Group.  Any files or data cached for this device in the Avimesa Device Cloud will be removed and trashed.

- **This may result in disabling a device in the field.  Proceed with caution only if you know what you're doing!**

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.


The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - the 128bit authentication key (32 characters, a-f0-9)



[Top](#toc)<br>
<a id="2.4-api-reference"></a>
### actuate

##### Callback

```
actuate(devId, cmd, function(err, msg){ ... })
```

Removes a Device from the Group.  Any files or data cached for this device in the Avimesa Device Cloud will be removed and trashed.

**Note that you are responsible for checking the response in the data stream as the communication with the device is asynchronous (e.g. the device might be sleeping)**

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.
- `cmd` (string) - Command.  See [here](#https://github.com/Avimesa/user-guide-group-api-amqp#4.10-group-api) for details on the command


The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - status for errors if any


[Top](#toc)<br>
<a id="2.5-api-reference"></a>
### listFiles

##### Callback

```
listFiles(devId, function(err, files){ ... })
```

List the files for the given Device ID.

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `files` (array) - array of files where each file has a `path` (file path), `size` (bytes) and `time` (Linux upload time) in the given format:

```
{ 
    path: '/data/fw-app.dat', 
    size: '137895', 
    time: '1540929865' 
}
```


[Top](#toc)<br>
<a id="2.6-api-reference"></a>
### uploadScript

##### Callback

```
uploadScript(devId, path, function(err, msg){ ... })
```

Upload a Device Driver Script for the given Device ID

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.
- `path` (string) - File path for the script

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - error message. if any


[Top](#toc)<br>
<a id="2.7-api-reference"></a>
### uploadConfig

##### Callback

```
uploadConfig(devId, path, function(err, message){ ... })
```

Upload a Device Configuration for the given Device ID

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.
- `path` (string) - File path for the script file (JavaScript)

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - error message. if any



[Top](#toc)<br>
<a id="2.8-api-reference"></a>
### uploadDfuPackage

##### Callback

```
uploadDfuPackage(devId, path, function(err, message){ ... })
```

Upload a Device Firmware Update (DFU) Package for the given Device ID

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.
- `path` (string) - File path for the config file (JSON, DialTone Protocol)

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - error message. if any

Notes:

- This API uploads the package.  You need to `actuate` the device to begin the update process.  See [here](#https://github.com/Avimesa/user-guide-group-api-amqp#4.10-group-api) for details.


[Top](#toc)<br>
<a id="2.9-api-reference"></a>
### updateAuthKey

##### Callback

```
updateAuthKey(devId, function(err, authKey){ ... })
```

Update a Device's Authentication key for the given Device ID

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `authKey` (string) - the 128bit authentication key (32 characters, a-f0-9)

Notes:

- **This may result in disabling a device in the field.  Proceed with caution only if you know what you're doing!**


[Top](#toc)<br>
<a id="2.10-api-reference"></a>
### consume

##### Callback

```
consume(queue, function(err, msg, ack){ ... })
```

Begins consuming data from the given queue and will obtain all pending messages that are in the queue upon connection.  

A callback is used on each message read that provides the ability to prevent an ACK (for a use case of, say, the database isn't available for storage)

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - the message from the queue
- `ack` (function) - a callback with signature `function(boolean)`

Notes:

- **This results in an exclusive connection to the queue and other clients are blocked from using this queue (as intended)**


[Top](#toc)<br>
<a id="2.11-api-reference"></a>
### listen

##### Callback

```
listen(exchange, key, function(err, msg){ ... })
```


Begins listening for data from the given exchange and routing key.  A temporary queue is created and used, so there will be no prior messages as this is a new queue.  

A callback is used on each message read, and the messages are automatically acknowledged.
s

[Top](#toc)<br>
<a id="2.12-api-reference"></a>
### count

##### Callback

Gets the message count of the given queue by name.

```
count(queue, function(err, count){ ... })
```

Parameters:

- `queue` (string) - name of the queue.  In the Avimesa system queues have a suffix `'_q'`

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `count` (number) - the number of messages that are in the queue



[Top](#toc)<br>
<a id="2.13-api-reference"></a>
### purge

##### Callback

```
purge(queue, function(err, count){ ... })
```

Purges the given queue by name and gives the number of messages removed.  

**NOTE THIS MAY RESULT IN DATA LOSS.  MAKE SURE YOU KNOW WHAT YOU ARE PURGING!**.

Parameters:

- `queue` (string) - name of the queue.  In the Avimesa system queues have a suffix `'_q'`

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `count` (number) - the number of messages that were purged

Notes:

- If an exclusive connection is already connected this command would fail.


[Top](#toc)<br>
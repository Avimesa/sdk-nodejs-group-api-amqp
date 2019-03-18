# Avimesa Group API Node Package (Alpha)
Node.js SDK for the Avimesa Group API using AMQP (0-9-1)

## Introduction

This project the source code for the **@avimesa/group-api-amqp** npm package.  The Avimesa Group API is documented [here](#https://github.com/Avimesa/user-guide-group-api-amqp#4.-group-api) in detail.

<a id="toc"></a>
## Table of Contents
- [1. Quick Start](#1.-quick-start)
- [2. API Reference](#2.-api-reference)
    - Connection Settings
        - [setConnParams](#2.0-api-reference)
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

Use the `setConnParams` function, or update or add your .env file in the project root:
```
# RMQ Server Hostname
RMQ_HOSTNAME=rmqserv001.avimesa.com

# RMQ Server Port
RMQ_PORT=5671

# RMQ Group ID / Vhost
RMQ_GROUP_ID= <** ENTER API Key **>

# RMQ Authentication Key
RMQ_AUTH_KEY= <** ENTER API Password **>,
```

Load the package:
```
...
const groupApi = require('@avimesa/group-api-amqp');
...
```

Use API per documentation, for example, listing Devices for the Group:

```
groupApi.listDevices(function(err, devices){
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


<a id="2.0-api-reference"></a>
### setConnParams

##### Summary

Set the connection parameters for the AMQP connection

```
const groupApi = require('@avimesa/group-api-amqp');

groupApi.setConnParams({
    hostname: 'rmqserv001.avimesa.com',
    username: <** ENTER API Key **>,
    password: <** ENTER API Password **>,
    vhost: <** ENTER API Key **>,
    port: 5671
});
```


<a id="2.1-api-reference"></a>
### listDevices

##### Summary

Lists the devices for the Group

##### Callback

```
groupApi.listDevices(function(err, devices){ ... })
```

Parameters:

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `devices` (array) - array of device IDs in string form

##### Async

```
let response = await groupApi.listDevicesAsync();
```




[Top](#toc)<br>
<a id="2.2-api-reference"></a>
### addDevice

##### Summary

Adds a Device to the Group.  If successful, a generated Authentication Key is provided in the response.    

##### Callback

```
groupApi.addDevice(devId, function(err, authKey){ ... })
```

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.


The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `authKey` (string) - the 128bit authentication key (32 characters, a-f0-9)

Notes:

- Use the `validDeviceId` utility function

##### Async

```
let response = await groupApi.addDeviceAsync(devId);
```



[Top](#toc)<br>
<a id="2.3-api-reference"></a>
### removeDevice

##### Summary

Removes a Device from the Group.  Any files or data cached for this device in the Avimesa Device Cloud will be removed and trashed.

**WARNING: This may result in disabling a device in the field.  Proceed with caution only if you know what you're doing!**

##### Callback

```
groupApi.removeDevice(devId, function(err, msg){ ... })
```

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.


The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - error message if there's an error

##### Async

```
let response = await groupApi.removeDeviceAsync(devId);
```



[Top](#toc)<br>
<a id="2.4-api-reference"></a>
### actuate

##### Summary

Sends an actuation command to the devices actuation queue.

**WARNING: You that you are responsible for checking the response in the data stream as the communication with the device is asynchronous (e.g. the device might be sleeping)**


##### Callback

```
groupApi.actuate(devId, cmd, function(err, msg){ ... })
```

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.
- `cmd` (string) - Command.  See [here](#https://github.com/Avimesa/user-guide-group-api-amqp#4.10-group-api) for details on the command


The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - status for errors if any

##### Async

```
let response = await groupApi.actuateAsync(devId, cmd);
```


[Top](#toc)<br>
<a id="2.5-api-reference"></a>
### listFiles

##### Summary

List the files for the given Device ID.

##### Callback

```
groupApi.listFiles(devId, function(err, files){ ... })
```

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

##### Async

```
let response = await groupApi.listFilesAsync(devId);
```




[Top](#toc)<br>
<a id="2.6-api-reference"></a>
### uploadScript

##### Summary

Upload a Device Driver Script for the given Device ID.  The script is checked for potential errors upon upload, but not all runtime errors can be accounted for.  If a runtime error occurs, it will show up in the `syslog` queue.

##### Callback

```
groupApi.uploadScript(devId, fileBuf, function(err, msg){ ... })
```

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.
- `fileBuf` (Buffer) - Buffer holding the script file

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - error message. if any

##### Async

```
let response = await groupApi.uploadScriptAsync(devId, fileBuf);
```



[Top](#toc)<br>
<a id="2.7-api-reference"></a>
### uploadConfig

##### Summary

Upload a Device Configuration for the given Device ID.  It will be checked for potential issues upon upload.

**WARNING: the max configuration file size is 2048 bytes**

##### Callback

```
groupApi.uploadConfig(devId, fileBuf, function(err, message){ ... })
```

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.
- `fileBuf` (Buffer) - Buffer holding the config file (JSON, DialTone Protocol)

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - error message. if any

##### Async

```
let response = await groupApi.uploadConfigAsync(devId, fileBuf);
```




[Top](#toc)<br>
<a id="2.8-api-reference"></a>
### uploadDfuPackage

##### Summary

Upload a Device Firmware Update (DFU) Package for the given Device ID

Notes:

- This API uploads the package.  You need to `actuate` the device to begin the update process.  See [here](#https://github.com/Avimesa/user-guide-group-api-amqp#4.10-group-api) for details.

##### Callback

```
groupApi.uploadDfuPackage(devId, fileBuf, function(err, message){ ... })
```

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.
- `fileBuf` (Buffer) - Buffer type holding the Avimesa DFU Package

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - error message. if any

##### Async

```
let response = await groupApi.uploadDfuPackageAsync(devId, fileBuf);
```




[Top](#toc)<br>
<a id="2.9-api-reference"></a>
### updateAuthKey

##### Summary

Update a Device's Authentication key for the given Device ID

**WARNING: This may result in disabling a device in the field.  Proceed with caution only if you know what you're doing!**

##### Callback

```
groupApi.updateAuthKey(devId, function(err, authKey){ ... })
```

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `authKey` (string) - the 128bit authentication key (32 characters, a-f0-9)

##### Async

```
let response = await groupApi.updateAuthKeyAsync(devId);
```




[Top](#toc)<br>
<a id="2.10-api-reference"></a>
### consume

##### Summary

Begins consuming data from the given queue and will obtain all pending messages that are in the queue upon connection.  

A callback is used on each message read that provides the ability to prevent an ACK (for a use case of, say, the database isn't available for storage)

**WARNING: This results in an exclusive connection to the queue and other clients are blocked from using this queue (as intended)**

##### Callback

```
groupApi.consume(queue, function(err, msg, ack){ ... })
```

Parameters:

- `devId` (string) - Device name.  Lower case, 32 characters, a-f0-9.

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `msg` (string) - the message from the queue
- `ack` (function) - a callback with signature `function(boolean)`




[Top](#toc)<br>
<a id="2.11-api-reference"></a>
### listen

##### Summary

Begins listening for data from the given exchange and routing key.  A temporary queue is created and used, so there will be no prior messages as this is a new queue.  

A callback is used on each message read, and the messages are automatically acknowledged.

##### Callback

```
groupApi.listen(exchange, key, function(err, msg){ ... })
```



[Top](#toc)<br>
<a id="2.12-api-reference"></a>
### count

##### Summary

Gets the message count of the given queue by name.

##### Callback

```
groupApi.count(queue, function(err, count){ ... })
```

Parameters:

- `queue` (string) - name of the queue.  In the Avimesa system queues have a suffix `'_q'`

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `count` (number) - the number of messages that are in the queue

##### Async

```
let response = await groupApi.countAsync(queue);
```



[Top](#toc)<br>
<a id="2.13-api-reference"></a>
### purge

##### Summary

Purges the given queue by name and gives the number of messages removed.  

**NOTE THIS MAY RESULT IN DATA LOSS.  MAKE SURE YOU KNOW WHAT YOU ARE PURGING!**.


##### Callback

```
groupApi.purge(queue, function(err, count){ ... })
```

Parameters:

- `queue` (string) - name of the queue.  In the Avimesa system queues have a suffix `'_q'`

The callback signature contains:

- `err` (boolean) - true if error, false otherwise
- `count` (number) - the number of messages that were purged

Notes:

- If an exclusive connection is already connected this command would fail.

##### Async

```
let response = await groupApi.purgeAsync(queue);
```


[Top](#toc)<br>

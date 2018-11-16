# Avimesa Group API Node Package (Alpha)
Node.js SDK for the Avimesa Group API using AMQP (0-9-1)

## Introduction

This project the source code for the **avmsa-group-api-amqp** npm package.  The Avimesa Group API is documented [here](#https://github.com/Avimesa/user-guide-group-api-amqp#4.-group-api) in detail.

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

#### Callback

```
listDevices(function(err, devices){ ... })
```



[Top](#toc)<br>
<a id="2.2-api-reference"></a>
### addDevice

#### Callback

```
addDevice(devId, function(err, authKey){ ... })
```




[Top](#toc)<br>
<a id="2.3-api-reference"></a>
### removeDevice

#### Callback

```
removeDevice(devId, function(err, message){ ... })
```


[Top](#toc)<br>
<a id="2.4-api-reference"></a>
### actuate

#### Callback

```
actuate(devId, cmd, function(err, message){ ... })
```



[Top](#toc)<br>
<a id="2.5-api-reference"></a>
### listFiles

#### Callback

```
listFiles(devId, function(err, files){ ... })
```



[Top](#toc)<br>
<a id="2.6-api-reference"></a>
### uploadScript

#### Callback

```
uploadScript(devId, path, function(err, message){ ... })
```



[Top](#toc)<br>
<a id="2.7-api-reference"></a>
### uploadConfig

#### Callback

```
uploadConfig(devId, path, function(err, message){ ... })
```



[Top](#toc)<br>
<a id="2.8-api-reference"></a>
### uploadDfuPackage

#### Callback

```
uploadDfuPackage(devId, path, function(err, message){ ... })
```



[Top](#toc)<br>
<a id="2.9-api-reference"></a>
### updateAuthKey

#### Callback

```
updateAuthKey(devId, function(err, authKey){ ... })
```



[Top](#toc)<br>
<a id="2.10-api-reference"></a>
### consume

#### Callback

```
consume(queue, function(err, msg, ack){ ... })
```


[Top](#toc)<br>
<a id="2.11-api-reference"></a>
### listen

#### Callback

```
listen(exchange, key, function(err, msg){ ... })
```


[Top](#toc)<br>
<a id="2.12-api-reference"></a>
### count

#### Callback

```
count(queue, function(err, count){ ... })
```


[Top](#toc)<br>
<a id="2.13-api-reference"></a>
### purge

#### Callback

```
purge(queue, function(err, count){ ... })
```


[Top](#toc)<br>
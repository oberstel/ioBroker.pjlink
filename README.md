![Logo](admin/pjlink.png)
# ioBroker.pjlink
This adapter controls any PJLink compatible projector or display with ioBroker.

PJLink is a unified standard for operating and controlling data projectors and displays. The protocol enables central control of certain devices, manufactured by different vendors. The protocol is used by NEC, Casio, Seiko, Sony, Panasonic, Hitachi, Mitsubishi, Ricoh, Vivitek and even more. Please consult the device manual to check compatibility.

## Current shortcomings
- Lighting hours are given for one (the first) lamp, even if PJLink supports several lamps. If somebody have a proper device, please contact me for testing.
- The device is not pushing information using the PJLink protocol. Therefore, the adapter will pull certain information frequently (see 
polling interval). Do not reduce the polling interval <10 sec. because the device needs up to 2 sec. to answer and the script will query several paramters.

## ToDo
- Implementing a table to translate input ID to name of the port (like 31 = HDMI1)
- Supporting PJLink Class 2 protocol

## How the adapter works
The adapter consists by three elements:
-	Admin interface to define device specific parameters (admin/index.html)
-	JavaScript module for device communication, based on PJLink protocol (utils/pjlink.js)
-	Main script (main.js)

The Main script works in four steps:
1)	Doing some initial configuration like creating ioBroker objects
2)	Starring the first communication with the device and asking for the current parameters 
3)	Waiting for a state change like switching the input source or turning power off
4)	Executing the change with the device
Please be aware, that the communication with the projector is not possible if the projector is in standby with power saving feature enabled. Therefore, it will not be possible to turn the project on using this adapter. To do so, disable the power saving feature using the projector configuration (Menu > Settings...).

## Changelog
### 0.1.1 (2017/12/31)
- multilanguage translations finalized (DE, EN, RU)
- implemented error handling (now using different log levels like debug, info, warn...)
- fixed an issue when inputSource is changed manually

### 0.1.0 (2017/12/31)
- first public flight (beta)

### 0.0.5 (2017/12/26)
- bugfixing

### 0.0.3 (2017/12/23)
- build admin interface
- build translate table

### 0.0.2 (2017/12/18)
- redesign some timings (what / when)

### 0.0.1
- Inital version

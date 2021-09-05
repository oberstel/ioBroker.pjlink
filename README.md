![Logo](admin/pjlink.png)
# iobroker.pjlink
![Number of Installations](http://iobroker.live/badges/pjlink-installed.svg) ![Number of Installations](http://iobroker.live/badges/pjlink-stable.svg) This adapter controls any PJLink compatible projector or display with ioBroker.

PJLink is an unified standard for operating and controlling data projectors and displays. The protocol enables central control of certain devices, manufactured by different vendors. The protocol is used by NEC, Casio, Seiko, Sony, Panasonic, Hitachi, Mitsubishi, Ricoh, Vivitek and even more. Please consult the device manual to check compatibility.

## Current shortcomings
- Error Handling is not implemented right now. If an unknown parameter is entered or if the device is not accessible using TCP/IP, an error will be shown in the ioBroker Log. In one of the future versions, the device errorcodes will be analyzed and translated.
- Lighting hours are given for one (the first) lamp, even if PJLink supports several lamps. If somebody have a proper device, please contact me for testing.
- The device is not pushing information using the PJLink protocol. Therefore, the adapter will pull certain information frequently (see 
polling interval). Do not reduce the polling interval <10 sec. because the device needs up to 2 sec. to answer and the script will query several paramters.
- All dialogs are in English as for now, DE and RU are in progress. Further translations on demand.

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

Note: Please be aware, that the communication with the projector won't be possible if the projector is in standby with power saving feature enabled. Therefore, it will not be possible to turn the project on using this adapter. To do so, disable the power saving feature using the projector configuration (Menu > Settings...).

## Changelog
### 0.1.2 (2019/05/11)
- fixed some minor bugs

### 0.1.1 (2018/02/11)
- errorhandling implemented (somekind of...)

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

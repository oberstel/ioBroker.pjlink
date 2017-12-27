# iobroker.pjlink
This adapter controls any PJLink compatible projector or display with ioBroker.
The PJLink protocol is used by NEC, Casio, Seiko, Sony, Panasonic, Hitachi, Misubishi, Ricoh, Vivitek and even more. Please consult the device manual to check compatibility.

Please be aware, that the communication with the projector is not possible if the projector is in standby with enabled power saving feature. Therefore, it will not be possible to turn the project on using this adapter. To do so, disable the power saving feature using the projector configuration.

Current shortcomings:
- Lighting hours are given for one (the first) lamp, even if PJLink supports several lamps. If somebody have a proper device, please contact me for testing.
- The device is not pushing information using the PJLink protocol. Therefore, the adapter will pull certain information frequently (see 
polling interval). Do not reduce the polling interval <2 sec. because the device needs up to 2 sec. to answer.

ToDo:
- Supporting Class 2 protocol

Changelog:
- 0.1.0 first public flight
- 0.0.3 design admin interface
- 0.0.2 redesign some timings (what / when)
- 0.0.1 Inital version

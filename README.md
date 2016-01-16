# DroidScriptBusPirate
DroidScript for easier use of the BusPirate on your Android device. Have a complete, although very basic, electronics bench in your pocket on the cheap. Full documentation:
http://techref.massmind.org/techref/language/DroidScript/BusPirate/index.htm

DroidScript is a free app for Android that lets you write apps in JavaScript / HTML5 /on your phone or tablet/. Let me make that clear... you can /write/ the app on your phone! If you plug in a keyboard, it's even pretty reasonable... but it also allows you to connect your workstation via browser and has a pretty nice IDE. You can always run or share your apps inside DroidScript or for $10, you can turn your DroidScripts into stand-alone real apps. 

http://droidscript.org/

https://play.google.com/store/apps/details?id=com.smartphoneremote.androidscriptfree

BusPirate is a little open source device that connects a USB host device (PC, MAC, or cellphone / tablet via USB OTG) to electronic stuff. It can speak with several different busses (I2C, SPI, UART, etc...) and devices (LCDs, servos, AVRs, FPGAs, CPLDs, etc...) and can inject signals, or measure voltages. It's a little test bench in your pocket for less than $30. 

http://dangerousprototypes.com/docs/Bus_Pirate

https://www.youtube.com/watch?v=NdXE4hm_lHY

The biggest problem with the BusPirate is that on the human side it speaks in very terse, hard to remember, codes. Turning the power on to the circuit under test requires you to enter "W". Setting up to talk to I2C is "m1". You get the idea. 

The point of this script is to make that easy by providing a list of commands, with clear, English, descriptions, which then enter the code for you. You can edit it, then send that code to the device and see the response. If you setup a complex code that you will use often, you can save that code into the list with your own description. 

Also:
- Generic "Wizard" for commands that need parameters entered, based on description of the command. E.g. "#KHz" in the description means "add an edit field in the dialog box with KHz as the prompt, and accept numbers only." So "Generate #KHz %Duty" will, when selected, popup a dialog asking for the KHz and Duty and after those values are entered, it will put them into the command string to be sent. It can also display a list of options for the parameter selection wizard. e.g. "#Select 1=one 2=two" Displays a pull down with 1=one and 2=two as the options and "Select" as the description. Somewhat limited at this point as the text of the option must be a single word. e.g. 1=this one results in two entries in the spinner: "1=this" and "one". The text before the = (if present) is used as the output. This generic wizard is used by several commands to make them really easy to enter: I2C mode, SPI mode, 2 and 3 Wire mode, Generate Frequency Dutycycle, Repeat command

- "Wizard" for selecting options to enter UART mode. This one is handled seperatly to provide a nicer layout of the standard UART settings.

- "Voltmeter" mode where the ADC reading is repeatedly displayed in large letters, center screen. There is a user selectable scaling factor which is multiplied time the value displayed, and a calibrate button which powers up the internal supplies and explains how to connect a potentiometer so that the input voltage can be scaled, and the +5 power supply can be used as a voltage reference to calibrate the potentiometer. In order to automatically turn on the power supply, the app now tracks the BusPirate mode, and if it's in HiZ, it automatically switches to 1-Wire (can't turn on power in HiZ) and then switches back when finished.

For install guide, user manual see:
http://techref.massmind.org/techref/language/DroidScript/BusPirate/index.htm

TODO: 
- Add a capacitance meter. Ian did this with special firmware ( https://www.youtube.com/watch?v=SqPlSPK4zyo ) but I don't see why it couldn't be done using the ADC to measure the charge curve on the cap. A macro that raises the AUX pin, delays a specific time, then reads the ADC, combined with some javascript that does a calculation...
- Add a low frequency 'oscilloscope' mode using the binary ADC polling function. There are python scripts for this which can probably be translated. I'm not sure the DroidScript USB interface will handle binary data. Update: Sadly, it doesn't appear that the USB OTG interface on the phone can handle a continuous stream of data. This may be a limitation of my phone (currently a Samsung Galaxy 6) or of DroidScript. O'scope ain't going to happen!
- Provide some way to share custom codes with other users. 
- Provide a way to reset custom commands back to the generic default commands.
 

See also:
- http://www.thingiverse.com/make:66685 3D printed case and color coded label. 
- http://dangerousprototypes.com/docs/Bus_Pirate_menu_options_guide Menu
- http://dangerousprototypes.com/forum/viewtopic.php?f=4&t=7564&p=62724#p62724
- https://groups.google.com/forum/#!topic/androidscript/urWWtt7RoTA



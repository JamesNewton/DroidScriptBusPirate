// Buspirate app. 
// 
// Note: this application only works on devices that support  
// OTG and allow access to external serial devices. 
// 
// Known to work: Nexus7, GalaxyS3/S4, ExperiaZUltra, TescoHudl    
// Don't work: Nexus4, GalaxyS1, AsusMemo

//Global variables. 
var usb=null, reply=""; 
var log="", maxLines;
var txts="", descs=[], cmds=[], ary;
var desc="";

//Called when application is started. 
function OnStart() { 
    txts = app.LoadText("BusPirateCommands");
    if (!txts) { //load default values if none saved.
        txts = "[select commands]\t\r";
        txts +="Help\t?\r";
        txts +="Reset\t#\r";
        txts +="Show Pin State\tv\r";
        txts +="ADC In\td\r";
        txts +="ADC Loop\tD\r";
        txts +="Delay 1uS\t&\r";
        txts +="Delay 1mS\t%\r";
        txts +="Frequency Counter\tf\r";
        txts +="Generate#Khz %Duty\tg\r";
        txts +="Control AUX\tc\r";
        txts +="Control /CS\tC\r";
        txts +="AUX/CS low\ta\r";
        txts +="AUX/CS HI\tA\r";
        txts +="AUX/CS In\t@\r";
        txts +="Power off\tw\r";
        txts +="Power ON\tW\r";
        txts +="Pullup Off\tp\r";
        txts +="Pull Bus to VPullup\tP\r";
        txts +="VPullup Pin\te1\r";
        txts +="VPullup 3.3v\te2\r";
        txts +="VPullup 5v\te3\r";
        txts +="HiZ Mode\tm1\r";
        txts +="UART Mode\tm3\r";
        txts +="I2C Mode\tm4\r";
        txts +="SPI Mode\tm5\r";
        txts +="1-Wire Mode\tm2\r";
        txts +="2-Wire Mode\tm6\r";
        txts +="3-Wire Mode\tm7\r";
        txts +="Keyboard Mode\tm8\r";
        txts +="LCD Mode\tm9\r";
        txts +="Bitorder MSB\tl\r";
        txts +="Bitorder LSB\tL\r";
        txts +="HEX Display\to1\r";
        txts +="Decimal Display\to2\r";
        txts +="Binary Display\to3\r";
        txts +="Raw Data\to4\r";
        txts +="Version/Status\ti\r";
        txts +="Clock HI\t/\r";
        txts +="Clock low\t\\\r";
        txts +="Clock Tick\t^\r";
        txts +="Data HI\t-\r";
        txts +="Data low\t_\r";
        txts +="Read bit\t.\r";
        txts +="Clock Tick & Read bit\t!\r";
        txts +="Read Byte\t\r";
        txts +="Bus Start\t[\r";
        txts +="Bus Stop\t]\r";
        txts +="Bus Start w/Read\t{\r";
        txts +="Bus Stop w/Read\t}\r";
        txts +="Repeat #times\t:\r";
        txts +="Search 7-bit I2C addresses\t(1)\r";
        txts +="I2C Sniffer\t(2)\r";
        txts +="List User Macros\t<0>\r";
        txts +="Record As Macro 1\tMACRO\r";
        txts +="Record As Macro 2\tMACRO\r";
        txts +="Record As Macro 3\tMACRO\r";
        txts +="Record As Macro 4\tMACRO\r";
        txts +="Record As Macro 5\tMACRO\r";
        txts +="\t\r";
        }

    ary = txts.split("\r");
    for (var i = 0; i<ary.length; i++) {
        txts = ary[i].split("\t"); //seperate description from command
        cmds[txts[0]]=txts[1]; //associate description with command
        descs[i]=txts[0]; //build ordered array of descriptions
        }
    
    //Create a layout with objects vertically centered. 
    lay = app.CreateLayout( "linear", "VCenter,FillXY" );    

    //Create title text. 
    txt = app.CreateText("BusPirate"); 
    txt.SetTextSize( 22 ); 
    txt.SetMargins( 0,0,0,0.01 ); 
    lay.AddChild( txt ); 

    //Create a read-only edit box to show responses. 
    edtReply = app.CreateText( "", 0.96, 0.6, "MultiLine,Left,Monospace" ); 
    edtReply.SetMargins( 0,0,0,0.01 ); 
    edtReply.SetBackColor( "#333333" );
    edtReply.SetTextSize( 12 ); 
    lay.AddChild( edtReply ); 
    
    //Create an edit box containing the constructed commands
    edt = app.CreateTextEdit( "", 0.96, 0.2, "NoSpell" ); 
    edt.SetOnChange( edt_OnChange );
    lay.AddChild( edt ); 
    
    //Create program spinner.
    spin = app.CreateSpinner( descs.join(","), 0.8 );
    spin.SetOnTouch( spin_OnTouch );
    lay.AddChild( spin );
    
    //Create a horizontal layout for buttons. 
    layBut = app.CreateLayout("Linear", "Horizontal"); 
    lay.AddChild( layBut ); 

    //Create an connect button. 
    btnConnect = app.CreateButton( "Connect", 0.23, 0.1 ); 
    btnConnect.SetOnTouch( btnConnect_OnTouch ); 
    layBut.AddChild( btnConnect ); 

    //Create an send button. 
    btnSend = app.CreateButton( "Send", 0.23, 0.1 ); 
    btnSend.SetOnTouch( btnSend_OnTouch ); 
    layBut.AddChild( btnSend ); 

     //Create a reset button. 
    btnReset = app.CreateButton( "Reset", 0.23, 0.1 ); 
    btnReset.SetOnTouch( btnReset_OnTouch ); 
    //btnReset.SetOnLongTouch( btnReset_OnLongTouch ); 
    layBut.AddChild( btnReset ); 

    //Create an save button. 
    btnSave = app.CreateButton( "Save", 0.23, 0.1 ); 
    btnSave.SetOnTouch( btnSave_OnTouch ); 
    layBut.AddChild( btnSave); 

    //Add layout to app.     
    app.AddLayout( lay ); 
} 

//Called when user touches connect button. 
function btnConnect_OnTouch() 
{ 
    //Create USB serial object. 
    usb = app.CreateUSBSerial(); 
    if( !usb ) 
    {
        app.ShowPopup( "Please connect a USB device" );
        return;
    }
    usb.SetOnReceive( usb_OnReceive );
    Send ("i"); //get version / status to start.
    app.ShowPopup( "Connected" );
} 

//Called when user touches send button. 
function btnSend_OnTouch() 
{  
    //Get rid of blank lines, spaces etc that cause 
    //a problem for Espruino. 
    var s = edt.GetText(); 
    s = s.replace( RegExp("\n\n+","gim"), "\n" ); 
    s = s.replace( RegExp("\n +","gim"), "\n" ); 
    s = s.replace( RegExp("\\)\\s*\\{","gim"), "\)\{" ); 
    s = s.replace( RegExp(", +","gim"), "," ); 
    s = s.replace( RegExp("\\( +","gim"), "\(" ); 
    s = s.replace( RegExp(" +\\)","gim"), "\)" ); 
    edt.SetText(s);

    //Send program to Espruino. 
    Send( s ); 
} 

//Called when user touches reset button. 
function btnReset_OnTouch() { 
    edt.SetText( "" ); //clear text edit.
    spin.SelectItem(descs[0]); //clear pull down so next selection works
    } 

function btnReset_OnLongTouch() {
    app.SaveText("BusPirateCommands",""); //clear the previously stored data
    }    
    
//Called when user touches save button. 
function btnSave_OnTouch(item) { 
    //need to ask the user for a description for the current command
    //Create dialog window.
    dlgTxt = app.CreateDialog( "Name?" );
    
    //Create a layout for dialog.
    layDlg = app.CreateLayout( "linear", "VCenter,FillXY" );
    layDlg.SetPadding( 0.02, 0, 0.02, 0.02 );
    dlgTxt.AddLayout( layDlg );

    //Create an text edit box.
    edtDesc = app.CreateTextEdit( "Do: "+edt.GetText(), 0.8, 0.1 );
    edtDesc.SetMargins( 0, 0.02, 0, 0 );
    layDlg.AddChild( edtDesc );

    //Create an ok button. 
    btnOk = app.CreateButton( "Ok", 0.23, 0.1 ); 
    btnOk.SetOnTouch( btnOk_OnTouch ); 
    layDlg.AddChild( btnOk ); 
    
    //Show dialog.
    dlgTxt.Show();
}

//called when user closes save name dialog
function btnOk_OnTouch(item) {
    var txts="";
    desc = edtDesc.GetText();
    descs.push(desc); //add new description to array
    spin.SetList(descs.join(",")); //and to the displayed list
    cmds[desc]=edt.GetText(); //associate command with description
    for (var i=0; i<descs.length; i++) { //build a file to save list
        txts += descs[i]+"\t"+cmds[descs[i]]+"\r";
        }
    //app.SaveText("BusPirateCommands",txts); //and store it.
    dlgTxt.Hide();
    app.ShowPopup("Saved "+desc);
    } 

//Called when text entered directly in edit area
function edt_OnChange() {
    if ("\n"==edt.GetText().slice(-1)) { //if they just pressed return
        edt.SetText( edt.GetText().slice(0,-1) ); //remove the return.
        btnSend_OnTouch(); //pretend the user pressed send
        edt.SetCursorPos( edt.GetText().length ); //move cursor to end
        }
    }

//Called when user touches program spinner.
//http://dangerousprototypes.com/docs/Bus_Pirate_menu_options_guide
function spin_OnTouch( item ) {
    num = item.slice( -1 );
    var s = edt.GetText() + cmds[item];
    if ("MACRO" == cmds[item]) {
        s = "<"+num+"="+edt.GetText()+">";
        }
    if ("m3" == cmds[item]) { //UART needs baud, data/parity, stop, polarity, out
//http://dangerousprototypes.com/docs/UART
        dlgTxt = app.CreateDialog( "UART mode" );
        
        //Create a layout for dialog.
        layDlg = app.CreateLayout( "linear", "Vertical,Left" );
        //layDlg.SetPadding( 0.02, 0, 0.02, 0.02 );
        dlgTxt.AddLayout( layDlg );
        layDlgL1 = app.CreateLayout( "linear", "Horizontal,Left" );
        layDlg.AddChild(layDlgL1);

        UartBaud = ["1. 300","2. 1200","3. 2400","4. 4800","5. 9600","6. 19200"
                    "7. 38400","8. 57600","9. 115200"]
        spinBaud = app.CreateSpinner(UartBaud.join(",") , 0.4 );
        layDlgL1.AddChild( spinBaud );
        
        UartDP =["None 8","Even 8","Odd 8","None 9"];
        spinDP = app.CreateSpinner(UartDP.join(",") , 0.3 );
        layDlgL1.AddChild( spinDP );
        
        spinSB = app.CreateSpinner("1 ,2 " , 0.2 );
        layDlgL1.AddChild( spinSB );
    
        spinP = app.CreateSpinner("1 Idle 1,2 Idle 0" , 0.4 );
        layDlg.AddChild( spinP );
    
        spinOut = app.CreateSpinner("2 Normal (3.3/GND),1 OC (HiZ/GND)" , 0.6 );
        layDlg.AddChild( spinOut );
    
        btnUartOk = app.CreateButton( "Ok", 0.23, 0.1 ); 
        btnUartOk.SetOnTouch( btnUartOk_OnTouch ); 
        layDlg.AddChild( btnUartOk ); 
        
        dlgTxt.Show();
        }
    edt.SetText( s );
    edt.SetCursorPos( s.length ); //move cursor to end of string
    }

//called when user closes UART setup dialog
function btnUartOk_OnTouch(item) {
    var baud=spinBaud.GetText();
    baud = baud.slice(0,baud.indexOf("."))+" ";
    var DP = spinDP.GetText();
    for (var i=UartDP.length;i>=0;i--) {
        if (DP == UartDP[i]) { DP=(i+1)+" "; break; }
        }
    edt.SetText( "m3 "
        +baud
        +DP
        +spinSB.GetText().slice(0,2) 
        +spinP.GetText().slice(0,2) 
        +spinOut.GetText().slice(0,2) 
        );
    dlgTxt.Hide();
    } 

//Check connection and send data.  
function Send( s ) { 
    if( usb ) usb.Write( s+"\r" ); 
    else app.ShowPopup( "Please connect" ); 
    }

//Called when we get data from Espruino.
function usb_OnReceive( data ) {
    
    log += data;
    var logLines = log.split("\n");
    if( !maxLines ) maxLines = edtReply.GetMaxLines()-1;
    logLines = logLines.slice( -maxLines );
    log = logLines.join("\n").toString();
    edtReply.SetText( log );
    }

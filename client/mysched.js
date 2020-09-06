regadditions="MWF 10:10-10:30 Chapel\nT 11:10-11:30 Chapel\nTh 11:00-11:20 Chapel\n"
 regaddinterim="M-F 10:10-10:30 Chapel\n"
 regschedule=""
 woptions="menubar,scrollbars,resizable,alwaysRaised"
 nl="\n"
 sm=""
 haveloaded=false
 weekdays="U=Sunday M=Monday T=Tuesday W=Wednesday R=Thursday F=Friday A=Saturday"
 digits=" 0123456789"
 C=new Array()
 iautoload=(location.search.indexOf("?go")==0)
 BGColor=new Array()

function initialize()
{
 var i=0
 var s=""
 var ifirst=0
 var ilast=0
 firsttime=0
 lasttime=23
 minopen=25
 slotwidth=60
 slotsperday=(lasttime-firsttime)
 ifirst=timeof(document.frm.StartTime.value,0)
 ilast=timeof(document.frm.EndTime.value,0)
 document.frm.StartTime.value=hhmmof(ifirst)
 document.frm.EndTime.value=hhmmof(ilast)
 firsttime=ifirst
 lasttime=ilast
 slotwidth=parseInt(document.frm.SlotWidth.value)
 setslots(60/Math.ceil(60/slotwidth))
 ndays=7
 WEEKDAYS="UMTWRFA"
 WEEKDAYS=getdays(document.frm.Days.value,true)
 ndays=WEEKDAYS.length
 document.frm.Days.value=fixdays(WEEKDAYS,false)
}

function setslots(swidth){
 slotwidth=swidth
 document.frm.SlotWidth.value=slotwidth
 slotsperday=(lasttime-firsttime)*60/slotwidth
 FULLDAY=""
 NULLDAY=""
 for(i=0;i<slotsperday;i++)FULLDAY+="N"
 for(i=0;i<slotsperday;i++)NULLDAY+="Y"
}

//user interface

function dosave(){setcookie(0)}

function dodisplay(ismine){
 var s=displayof(ismine)
 docwrite(s,true)
}

function doshowhtml(ismine){
 var s=displayof(ismine).replace(/</g,"&lt;")
 docwrite("<body><pre>"+s+"</pre></body>",true)
}


//main functions

function fixfromregistrar(stext){
 var sout=""
 var isinterim=0
 var sline=""
 var scourse=""
 var ithis=-1
 var L=new Array()
 var S=stext.split("\n")
 var nac=0
 setslots(10)
 includekey=document.frm.includekey.checked=false
 regschedule="<pre>"+stext
 for (var i=0;i<S.length;i++){
	sline=S[i]
	if(sline.indexOf("Registered Courses for")>=0)stitle=sline
	if(sline.indexOf("Academic Year, ")>=0){
		nac++
		if(nac>1)break
		stitle+=" "+sline
		document.frm.title.value=stitle
		sout=(stitle.indexOf("Interim")>=0?regaddinterim:regadditions)
	}
	if(sline.length==0){
		ithis=i
		sout+="\n"
	}else if(ithis==i-1){
		scourse=sline.replace(/ /g,"").replace(/\(LAB\)/,"L")
	}else if((sline.indexOf("-1")>=0||sline.indexOf("-0")>=0)&&ithis==i-3){
		L=sline.split(" ")
		sout+=L[1]+" "+L[2]+" "+scourse+"\n"
		ithis=i-2
	}

 }
 return sout
}

var arefs = [];

function extractTimes() {
	var regexDays = new RegExp(/[M|T|W|H|F|\-|]+/g)
  var regexTimes = new RegExp(/[0|1|2|3|4|5|6|7|8|9|\:|A|P|M]+/g)
  
  var tokens = document.frm.mytimes.value.replace(/\s+/g," ").toUpperCase().replace(/ PM/g,"PM").replace(/ AM/g,"AM").split(" ")

  var snew = ""
  for (var i = tokens.length; --i >= 1;)
  	if ("0123456789".indexOf(tokens[i].charAt(0)) >= 0
				&& tokens[i-1].replace(regexDays, "").length == 0 
				&& tokens[i].replace(regexTimes, "") == "-") {
				if (tokens[i] == "0800-0900PM")
					tokens[i] = "0800PM-0900PM" // kludge for this ambiguity
	  	snew = tokens[i-1] + " " + tokens[i] + "\n" + snew
		} 
  document.frm.mytimes.value = snew
}

var arefkey = "#_#";

function displayof(ismine){
 var S=new Array()
 var s=""
 var i=0
 var ipt=0
 var itime=0
 var iprev=0
 var iday=0
 var sline=""
 var sinfo=new Array()
 initialize()
 var schedule=new Array(ndays+1)
 var tr=new Array(ndays+1)
 var suser=new Array()
 var stask=new Array()
 var stime=new Array()
 var sdata=new Array()
 var ndata=0
 var sdisplay=""
 var thisuser=""
 includekey=document.frm.includekey.checked
 includetime=document.frm.includetime.checked
 stitle=document.frm.title.value
 stext="\n"+getval("mytimes",false)
 regschedule=""
 if(stext.indexOf("Satisfies:")>=0)stext=fixfromregistrar(stext)



  arefs = [];
  var tokens = stext.split("\<a");
  for (var i = 1; i < tokens.length; i++) {
	var s = tokens[i].split("<\/a>");
	arefs.push("<a" + s[0] + "</a>");
	tokens[i] = arefkey + (arefs.length - 1) + arefkey + s[1]; 
  }
  stext = tokens.join("")

 var skey = "";
 while(stext.length){
  sline=getline()
  if(sline.indexOf("bgcolor:")==0){
	S=sline.split(":")
	BGColor[S[1]]=S[2]
	if(includekey)sdisplay+="\n<br>"+sline  
	sline=""	
  }
  if(sline.indexOf(" = ")>=0)sline=sline.split(" = ")[1]
  if(sline.length>0 && sline.indexOf(":")==sline.length-1 && sline.indexOf(" ")<0)thisuser=sline


  if (thisuser!=sline){
   sline=strsub(sline," AM","AM")
   sline=strsub(sline," am","AM")
   sline=strsub(sline," PM","PM")
   sline=strsub(sline," pm","PM")
   sline=strsub(sline," 0"," ")
   sline=strsub(sline,"-0","-")
   sinfo=sline.split(" ")
   if(sinfo.length>=2){
    ndata++ 
    if(digits.indexOf(sinfo[0].charAt(0))>0){
     sdata[ndata]=getweekcode(sinfo[1],sinfo[0])
    }else{
     sdata[ndata]=getweekcode(sinfo[0],sinfo[1])
    }
    suser[ndata]=thisuser
    stask[ndata]=(sinfo.length==2?(includetime ? "" : "BUSY"):includekey?ndata+" ("+sinfo[2]+")":sinfo[2])
    stime[ndata]=sinfo[0]+" "+sinfo[1]
    skey+="\n"+ndata+" = "+sline// + " //" + sinfo[0] + "//" + sinfo[1] + "// " + sdata[ndata] 
   }
  }
 }
 ipt=0
 for(iday=1;iday<=ndays;iday++){
  schedule[iday]=new Array(slotsperday)
  tr[iday]=new Array(slotsperday)
  for(itime=0;itime<slotsperday;itime++){
   s=""
   for(i=1;i<=ndata;i++)s+=(sdata[i].charAt(ipt)=="N"?"<br>"+suser[i]+stask[i]
+(includetime?"<br />"+stime[i]:""):"")
   schedule[iday][itime]=s
   if(itime>0 && schedule[iday][itime-1]==s){
    iprev=itime-1
    i=tr[iday][iprev]
    if(i<=0)iprev=-i
    tr[iday][iprev]++
    tr[iday][itime]=-iprev
   }else{
    tr[iday][itime]=1
   }
   ipt++
  }
  ipt++  //newline  
 }   
 tr[0]=new Array(slotsperday)
 for(itime=0;itime<slotsperday;itime++){
  var imin=1000
  for(iday=1;iday<=ndays;iday++){
   if(tr[iday][itime]>0){
	imin=Math.min(imin,tr[iday][itime])
   }else{
	imin=Math.min(imin,tr[iday][-tr[iday][itime]]-tr[iday][itime]-itime)
   }
  }
  tr[0][itime]=imin
 }
//alert(skey)
 s="<head>\n<title>"+stitle+"</title>\n<style>\n th{background-color:white;font-weight:bold;font-size:10pt}\n .open{color:red;background-color:white;font-size:10pt}\n .scheduled{background:lightgrey;font-size:10pt}\n .office{background:lightblue;font-size:10pt}\n.chapel{color:blue;background-color:yellow;font-size:10pt}\n</style>\n</head>\n"
// s="<head>\n<title>"+stitle+"</title>\n<style>\n th{background-color:white;font-weight:bold;font-size:10pt}\n .open{color:red;background-color:white;font-size:10pt}\n .scheduled{background:lightgrey;font-size:10pt}\n.chapel{color:blue;background-color:yellow;font-size:10pt}\n</style>\n</head>\n"

 sdisplay=s+"<body>\n<h3>"+stitle+"</h3>\n"+maketable(schedule,tr)+"<div style=display:" + (includekey ? "block":"none")+"><pre>\n"+skey+"\n</pre></div>\n"+regschedule+"</body>\n"
 tokens = sdisplay.split(arefkey);
 for (var i = 1; i < tokens.length; i+= 2) {
	tokens[i] = arefs[+tokens[i]];	
 }
 return tokens.join("");
}


function maketable(schedule,tr){
 var i=0
 var s=""
 var iday=0
 var itime=0
 var igroup=document.frm.grouptimes.checked
 var sopen=""
 var bgcolor=""
 var sout="\n<table border=1 width=100%>\n<tr>\n"
 if (!includetime)
	sout += "<td nowrap></td>"
 s="\n<th width="+Math.floor(100/(ndays+1))+"%>"
 for(iday=0;i<ndays;i++)sout+=s+fieldof(weekdays,WEEKDAYS.charAt(i))+"</th>"
 sout+="\n</tr>"
 for(itime=0;itime<slotsperday;itime++){
  sout +="\n<tr>"
  var th;

 if (!includetime) {
  if(igroup){
	i=tr[0][itime]
	s=hhmmof(itime)+" - "+hhmmof(itime+i)
	if(s.indexOf("AM")!=s.lastIndexOf("AM"))s=s.replace(/ AM/,"")
	if(s.indexOf("PM")!=s.lastIndexOf("PM"))s=s.replace(/ PM/,"")
	sout+= "<th"+(i>1?" rowspan="+i:"")+" nowrap>"+s+"</th>"	
  }else{
	sout+="<th nowrap>"+hhmmof(itime)+"</th>"
  }
 }

  for(iday=1;iday<=ndays;iday++){
   s=schedule[iday][itime]
   if(s.length){if(igroup){s=s+"<br>&nbsp;"}else{s=s.substring(4,s.length)}}
   i=tr[iday][itime]
   sopen=(i*slotwidth>minopen?"<br>OPEN<br>&nbsp;":"")
   bgcolor=getbgcolor(s)
      if(i>0)sout+="\n<td align=center"+(i>1?" rowspan="+i:"")
	 	+(s.indexOf("Chapel")>=0?" class=chapel>"+s
	 	 :s.indexOf("Office")==0?" class=office>"+s
		 :s.length?(bgcolor?bgcolor:" class=scheduled ")+">"+s:" class=open>"+sopen)+"</td>"

//   if(i>0)sout+="\n<td align=center"+(i>1?" rowspan="+i:"")+(s.indexOf("Chapel")>=0?" class=chapel>"+s:s.length?(bgcolor?bgcolor:" class=scheduled ")+">"+s:" class=open>"+sopen)+"</td>"
  }
  if(igroup){
	s=""
	for(iday=1;iday<=ndays;iday++)s+="<td></td>"
	for(var i=1;i<tr[0][itime];i++)sout+="\n</tr>\n<tr>"+s
	itime+=tr[0][itime]-1
  }
  sout+="\n</tr>"
 }   
 sout+="\n</table>"
 sout+="\n<p>\n<small>Created by A-Brockalypse: Varsha, Jason, Jack </small>\n"
 return sout
}

function getbgcolor(s){
 var c=""
 for(var i in BGColor){
	if(s.indexOf(i)>=0)c=" bgcolor="+BGColor[i]
 }
 return c
}

//utilities

function fieldof(slist,schar){
 var i=slist.indexOf(schar+"=")
 if(i<0)return ""
 var s=slist.substring(i+2,slist.length)
 var i=s.indexOf(" ")
 if(i<0)return s
 return s.substring(0,i)
}

function fixdays(sdays,toURA){
 var s=sdays
 if(toURA){
  if(s=="")s="MTWRF"
  s=s.toUpperCase()
  s=strsub(s,"SU","U")
  s=strsub(s,"SA","A")
  s=strsub(s,"TH","R")
  return s
 }
 s=strsub(s,"U","Su")
 s=strsub(s,"A","Sa")
 s=strsub(s,"R","Th")
 return s
}

function getval(swhat,donewline){
 var s=strclean(eval("document.frm."+swhat+".value"))
 if (!donewline)return s
 s=strsub(s,"/n",",")
 s=strsub(s," ",",")
 return s
}

function docwrite(swhat,doheader){
 s="<html>"+swhat+"</html>"
 sm=""+Math.random()
 sm=sm.substring(3,10)
 newwin=open('','MYSCHED_'+sm,woptions)
 newwin.document.write(s)
 newwin.document.close()
}

function timeof(stime,islate){
 var s=""
 var i=0
 var hh=0
 var mm=0
 var s=stime
 
 s=s.toUpperCase()
 var ispm=(s.indexOf("P")>0)
 var isam=(s.indexOf("A")>0)
 s=strsub(s,"P","")
 s=strsub(s,"A","")
 s=strsub(s,"M","")
 s=strsub(s," ","")
 i=s.indexOf(":")
 if (i<0&& s.length == 3) {
   // 300 from raw registrar data
   s = s.substring(0,i=1) + ":" + s.substring(1)
 }
 if(i<0&&s.length==4){
	isam=(s.charAt(0)=="0")
	s=s.substring(isam?1:0,2)+":"+s.substring(2,4)
 }
 if (s.indexOf(":")<0)s+=":00"
 var S=s.split(":")
 hh=parseInt(S[0])
 if(hh==12){
	isam=!isam
	ispm=!ispm
 }
 hh+=(!isam && (ispm || hh<firsttime)?12:0)
 hh=(hh-firsttime)*60/slotwidth
 s="1."+S[1]
 mm=parseFloat(s)-0.9999
 mm-=(islate?0.01:0)
 mm=mm*100/slotwidth
 i=Math.floor(hh+mm)
 if(i<0)i=0
 if(i>=slotsperday)i=slotsperday
 return i
}

function hhmmof(itime){
 var i=0
 var s=""
 var hh=0
 var mm=itime*slotwidth 
 hh=Math.floor(mm/60)
 mm=Math.floor(mm-hh*60) 
 hh+=firsttime
 var ispm=(hh>=12)
 if (hh>12) hh=hh-12
 smm="00"+mm
 smm=smm.substring(smm.length-2,smm.length)
 s=hh+":"+smm+" "+(ispm?"PM":"AM")
 return s
}


function getweekcode(dayinfo,timeinfo){
 var sdays=""
 var s=""
 var i=0
 var sout=""
 var daycode=getdaycode(timeinfo)
 sdays=getdays(dayinfo)
 for(i=0;i<ndays;i++){
  s=WEEKDAYS.charAt(i)
  sout+=(sdays.indexOf(s)>=0?daycode:NULLDAY)+"\n"
 }
 return sout
}

function getdays(dayinfo){
 var sdays=""
 var s=""
 var i=0
 var s1=""
 var s2=""
 var i1=0
 var i2=0
 sdays=fixdays(dayinfo,true)
 i=sdays.indexOf("-")
 if (i>0){
  s1=sdays.substring(i-1,i)
  s2=sdays.substring(i+1,i+2)
  i1=WEEKDAYS.indexOf(s1)
  i2=WEEKDAYS.indexOf(s2)
  if(i1>=0 && i2>i1)sdays=s1+WEEKDAYS.substring(i1+1,i2)+s2
 }
 return sdays
}

function getdaycode(timeinfo){
 var s=""
 var i=0
 var stimes= new Array()
 var itime1=0
 var itime2=0
 i=timeinfo.indexOf("-")
 if(i<=0)return NULLDAY
 stimes=timeinfo.split("-")
 itime1=timeof(stimes[0],0)
 itime2=timeof(stimes[1],1)+1
 if(itime2<=itime1)return NULLDAY
 s=NULLDAY.substring(0,itime1)+FULLDAY.substring(itime1,itime2)+NULLDAY.substring(itime2,slotsperday)
 //alert(timeinfo+"\n"+itime1+ "\n"+ s +"\n"+ itime2)
 return s
}

function getline(){ //get next line from stext
 var isok=false
 while(!isok){
  var ipt=stext.indexOf(nl)
  var tokens = (ipt < 0 ? stext : stext.substring(0, ipt)).split(" ")
  if (tokens.length >= 4 && tokens.length % 2 == 0) {
    // raw registrar data
    // T 0315-0515PM Th 0345-0545PM
    var key = " " + tokens[2] + " ";
    if (" M T W Th F ".indexOf(key) >= 0)
      ipt = stext.indexOf(key);
  }
  var s=""
  if (ipt<0){
   s=stext
   stext=""
   return s
  }else{
   s=stext.substring(0,ipt)
   stext=stext.substring(ipt+1)
  }
  isok=(s.length!=0 && s.charAt(1)!="/")
 }
 return s
}

function getword(){ //get next word from sline
 var ipt=sline.indexOf(" ")
 var s=""
 if (ipt<0){
  s=sline
  sline=""
  return s
 }
 s=sline.substring(0,ipt)
 sline=sline.substring(ipt+1,sline.length)
 return s 
}

function getrnd(n){return Math.floor(Math.random()*n)}


// string utilities

function strsub(ssub,ch1,ch2){
 if (ssub.length==0) return ""
 if (ch1.length==0 || ch2.length>0 && ch2.indexOf(ch1)>=0) return ssub
 var s=ssub
 var i=s.indexOf(ch1)
 while (i>=0){
  s=s.substring(0,i) + ch2 + s.substring(i+ch1.length,s.length)
  i=s.indexOf(ch1)
 }
 return s
}

function strchop(slist,swhat){
 var i=slist.indexOf(swhat)
 if (i<0)return slist
 if (i==0)return slist.substring(swhat.length+1,slist.length)
 return slist.substring(0,i-1)+slist.substring(i+swhat.length,slist.length)
}

function strclean(sclean){
 //tabs and multiple spaces removed
 var s=sclean
 s=strsub(s,"\r","\n")
 s=strsub(s,"\f","")
 s=strsub(s,"\t"," ")
 s=strsub(s,"  "," ")
 return s
}

function strfix(sstr){
 var s=strclean(sstr)
 s=strsub(s,"\n",",")
 s=strsub(s," ",",")
 s=strsub(s,",,",",")
 while(s.charAt(0)==",")s=s.substring(1,s.length)
 return s
}

//cookie services
function setbyname(swhat,sval,sitem){
 if(swhat=="test")return
 if(!iselement(document.frm,swhat))return
 if(sval!="null" && sval!="undefined")eval("document.frm."+swhat+".value=unescape('"+sval+"')")
}
//window utilities
function iselement(frm,swhat){
 for(var i=0;i<document.frm.elements.length;i++){
  if (document.frm.elements[i].name==swhat)return 1
 }
 return 0
}

function setcookie(mode){
// if(mode==-1)showcookie()
 var sexp="Wednesday, 30-Dec-2009 12:00:00 GMT"
 for (var i=0;i<document.frm.elements.length;i++){
//  document.cookie="C["+i+"]=\"setbyname('"+document.frm.elements[i].name+"','"+escape(document.frm.elements[i].value)+"','"+document.frm.elements[i].selectedIndex+"')\";expires="+sexp
  document.cookie="C["+i+"]=\"setbyname('"+document.frm.elements[i].name+"','"+escape(document.frm.elements[i].value)+"')\";expires="+sexp
 }
 var sexp="Sunday, 26-Aug-2001 12:00:00 GMT"
 if(mode==-1){
  for(var i=0;i<document.frm.elements.length;i++)document.cookie="C["+i+"]=\"setbyname('"+document.frm.elements[i].name+"','"+escape(document.frm.elements[i].value)+"')\";expires="+sexp
 }
 if(mode==1)showcookie()
}

function loadcookie(){eval(document.cookie);for(var i=0;i<C.length;i++)eval(C[i])}

function showcookie(){alert(unescape(document.cookie))}

function loadinfo(){
 if(document.frm.mytimes.value==""){
	document.frm.mytimes.value="example:\nMWF 3:00-5:00 testing\nM-F 12-1      lunch\n"
	document.frm.mytimes.focus()
	setTimeout('loadcookie()',200)
 }else if(iautoload){
	dodisplay(true)
 }
}
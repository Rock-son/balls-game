(this.webpackJsonpballs=this.webpackJsonpballs||[]).push([[0],{32:function(e,t,a){e.exports=a(64)},37:function(e,t,a){},38:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},50:function(e,t,a){},60:function(e,t,a){},62:function(e,t,a){},63:function(e,t,a){},64:function(e,t,a){"use strict";a.r(t);var n=a(1),i=a.n(n),o=a(13),l=a.n(o),s=(a(37),a(38),a(30)),r=a(26),c=a(27),u=a(7),m=a(29),d=a(31),h=a(17),v=function(e,t,a,n){if(!e.reactContext.state.pause){e.x+e.radius>(window.innerWidth<e.reactContext.canvasWidth?e.reactContext.canvasWidth:window.innerWidth)&&(e.velocity.x=-e.velocity.x),e.x-e.radius<0&&(e.velocity.x=-e.velocity.x),e.y+e.radius>(window.innerHeight<e.reactContext.canvasHeight?e.reactContext.canvasHeight:window.innerHeight)&&(e.velocity.y=-e.velocity.y),e.y-e.radius<0&&(e.velocity.y=-e.velocity.y);for(var i=0;i<t.length;i++)if(e.myID!==t[i].myID&&a(e.x,e.y,t[i].x,t[i].y)-2*e.radius<0){var o=t[i];o.contagion?(e.contagion=1,e.texture=n.resources.sheet.textures["ball-red.png"]):e.contagion&&(o.contagion=1,o.texture=n.resources.sheet.textures["ball-red.png"]),p(e,o)}e.x+=e.velocity.x,e.y+=e.velocity.y}};function g(e,t){return{x:e.x*Math.cos(t)-e.y*Math.sin(t),y:e.x*Math.sin(t)+e.y*Math.cos(t)}}function p(e,t){var a=e.velocity.x-t.velocity.x,n=e.velocity.y-t.velocity.y;if(a*(t.x-e.x)+n*(t.y-e.y)>=0){var i=-Math.atan2(t.y-e.y,t.x-e.x),o=g(e.velocity,i),l=g(t.velocity,i),s={x:l.x,y:o.y},r={x:o.x,y:l.y},c=g(s,-i),u=g(r,-i);e.velocity.x=c.x,e.velocity.y=c.y,t.velocity.x=u.x,t.velocity.y=u.y}}var y=a(14);function b(){var e=this;function t(e,t){return Math.floor(Math.random()*(t-e+1))+e}function a(e,t,a,n){var i=a-e,o=n-t;return Math.sqrt(Math.pow(i,2)+Math.pow(o,2))}var n=this.state.simulationSettings,i=n.size,o=n.speed,l=n.quantity,s=(n.deactivateAfter,n.showTime,n.showStats,n.autorestart,this.canvasRef.current),r=new y.a({autoresize:!0,backgroundColor:1644825,view:s,width:this.canvasWidth,height:this.canvasHeight,resolution:window.devicePixelRatio||1,autoDensity:!0}),c=y.b.shared;c.add("sheet","myBalls.json").on("progress",(function(e,t){return console.log(e.progress+"% loaded")})).on("load",(function(e,t){return console.log("Asset loaded"+t.name)})).on("error",(function(e){return console.error("load error",e)})).load(function(){for(var e=c.resources.sheet.textures["ball-white.png"],n=c.resources.sheet.textures["ball-red.png"],l=0;l<g;l++){u=0===l?1:0;var s=t(2*h,p),E=t(2*h,b);if(0!==l)for(var f=0;f<d.length;f++)a(s,E,d[f].x,d[f].y)-(h+d[f].radius)<0&&(s=t(2*h,p),E=t(2*h,b),f=-1);(m=u?new y.c(n):new y.c(e)).x=s,m.y=E,m.width=2*i,m.height=2*i,m.anchor.x=.5,m.anchor.y=.5,m.myID=l,m.contagion=u,m.radius=h,m.reactContext=this,m.velocity={x:(Math.random()-.5)*o,y:(Math.random()-.5)*o},d.push(m)}for(var w=d.length,S=0;S<w;S++)r.stage.addChild(d[S]),r.ticker.add(v.bind(null,d[S],d,a,c))}.bind(this));var u,m;window.addEventListener("resize",(function(){r.renderer.resize(window.innerWidth<e.canvasWidth?e.canvasWidth:window.innerWidth,window.innerHeight<e.canvasHeight?e.canvasHeight:window.innerHeight)}));var d=[],h=i,g=+l,p=this.canvasWidth-2.5*h,b=this.canvasHeight-2.5*h}var E=a(78),f=a(65),w=a(66),S=a(67),x=a(68),N=a(69),k=a(70),_=a(71),O=[{type:"small",value:3},"|",{type:"medium",value:6},"|",{type:"large",value:9}],T=["50","|","100","|","150","|","200","|","250","|","300","|","400","|","500"],M=[{type:"slow",value:.5},"|",{type:"medium",value:1},"|",{type:"fast",value:2}],C=["0","|","10","|","15","|","20","|","30","|","45","|","60"],j=[{type:"yes",value:!0},"|",{type:"no",value:!1}],I=(a(50),function(e){var t=e.isOpen,a=e.toggle,n=e.startSimulation,o=e.buttonText,l=e.setSimulationSettings,s=e.settings,r=s.size,c=s.speed,u=s.quantity,m=s.deactivateAfter,d=s.showTime,h=s.showStats,v=s.autorestart;return i.a.createElement(E.a,{key:"simulator",isOpen:t,toggle:a,centered:!0,className:"simulator-modal"},i.a.createElement(f.a,{charCode:"X",toggle:a}),i.a.createElement(w.a,null,i.a.createElement(S.a,null,i.a.createElement(x.a,{className:"choice"},i.a.createElement("div",null,"Size of balls"),i.a.createElement(N.a,{className:"choice__options"},O.map((function(e,t){return"object"!=typeof e?i.a.createElement(k.a,{key:t},e):i.a.createElement(k.a,{key:t,tabIndex:"0","data-option":"".concat(JSON.stringify({size:e.value})),onClick:l,active:e.value===r},e.type)}))))),i.a.createElement(S.a,null,i.a.createElement(x.a,{className:"choice"},i.a.createElement("div",null,"Number of balls"),i.a.createElement(N.a,{className:"choice__options"},T.map((function(e,t){return"|"===e?i.a.createElement(k.a,{key:t},e):i.a.createElement(k.a,{key:t,tabIndex:"0","data-option":"".concat(JSON.stringify({quantity:e})),onClick:l,active:e===u},e)}))))),i.a.createElement(S.a,null,i.a.createElement(x.a,{className:"choice"},i.a.createElement("div",null,"Speed of balls"),i.a.createElement(N.a,{className:"choice__options"},M.map((function(e,t){return"object"!=typeof e?i.a.createElement(k.a,{key:t},e):i.a.createElement(k.a,{key:t,tabIndex:"0","data-option":"".concat(JSON.stringify({speed:e.value})),onClick:l,active:e.value===c},e.type)}))))),i.a.createElement(S.a,null,i.a.createElement(x.a,{className:"choice"},i.a.createElement("div",null,"Deactivate ball after"),i.a.createElement(N.a,{className:"choice__options"},C.map((function(e,t){return"|"===e?i.a.createElement(k.a,{key:t},e):i.a.createElement(k.a,{key:t,tabIndex:"0","data-option":"".concat(JSON.stringify({deactivateAfter:e})),onClick:l,active:e===m},"0"===e?"no":"".concat(e,"s"))}))))),i.a.createElement(S.a,{className:"col-12"},i.a.createElement(x.a,{className:"col-4 choice"},i.a.createElement("div",null,"Show time"),i.a.createElement(N.a,{className:"choice__options"},j.map((function(e,t){return"object"!==typeof e?i.a.createElement(k.a,{key:t},e):i.a.createElement(k.a,{key:t,tabIndex:"0","data-option":"".concat(JSON.stringify({showTime:e.value})),onClick:l,active:e.value===d},e.type)})))),i.a.createElement(x.a,{className:"col-4 choice"},i.a.createElement("div",null,"Show stats"),i.a.createElement(N.a,{className:"choice__options"},j.map((function(e,t){return"object"!==typeof e?i.a.createElement(k.a,{key:t},e):i.a.createElement(k.a,{key:t,tabIndex:"0","data-option":"".concat(JSON.stringify({showStats:e.value})),onClick:l,active:e.value===h},e.type)})))),i.a.createElement(x.a,{className:"col-4 choice"},i.a.createElement("div",null,"Autorestart"),i.a.createElement(N.a,{className:"choice__options"},j.map((function(e,t){return"object"!==typeof e?i.a.createElement(k.a,{key:t},e):i.a.createElement(k.a,{key:t,tabIndex:"0","data-option":"".concat(JSON.stringify({autorestart:e.value})),onClick:l,active:e.value===v},e.type)})))))),i.a.createElement(_.a,{onClick:n,className:"simulator-modal__footer"},">>>\xa0\xa0 ",o," \xa0\xa0<<<"))}),A=a(72),W=a(73),H=a(74),D=a(75),z=a(76),V=a(77),R=function(e){var t=e.toggleNavbarItemsExpand,a=e.isNavbarExpanded,n=e.toggleNavbarVisibility,o=e.isNavbarVisible,l=e.toggleSimulationModal,s=e.toggleShareModal;return i.a.createElement(A.a,{dark:!0,className:"main__navbar ".concat(!o&&"hidden"," d-inline-flex justify-content-between")},i.a.createElement(W.a,{className:"main__navbar__toggler ".concat(o&&"hidden"),onClick:n,disabled:o},i.a.createElement("svg",{height:"15",width:"20"},i.a.createElement("path",{d:"M-2 2 l12 12 M10 15 l12 -13 Z",fill:"none",strokeWidth:"5",stroke:"white"}))),i.a.createElement(A.a,{dark:!0,className:"col-6 main__navbar__left d-inline-flex justify-content-between",expand:"sm"},i.a.createElement(H.a,{onClick:t}),i.a.createElement(D.a,{isOpen:a,navbar:!0},i.a.createElement(N.a,{className:"navbar__nav left",navbar:!0},i.a.createElement(z.a,null,i.a.createElement(k.a,{className:"navbar__nav__link",onClick:l},"Simulate")),i.a.createElement(z.a,null,i.a.createElement(k.a,{className:"d-none d-sm-block navbar__nav__separator"},"|")),i.a.createElement(z.a,null,i.a.createElement(k.a,{data:"game",className:"navbar__nav__link",onClick:s},"Play game")),i.a.createElement(z.a,null,i.a.createElement(k.a,{className:"d-none d-sm-block navbar__nav__separator"},"|")),i.a.createElement(z.a,null,i.a.createElement(k.a,{className:"navbar__nav__link",onClick:s},"Share")),i.a.createElement(z.a,null,i.a.createElement(k.a,{className:"d-none d-sm-block navbar__nav__separator"},"|")),i.a.createElement(z.a,null,i.a.createElement(k.a,{className:"navbar__nav__link",onClick:n},"Hide"))))),i.a.createElement(A.a,{dark:!0,className:"col-6 main__navbar__right d-inline-flex justify-content-between"},i.a.createElement(N.a,{className:"navbar__nav caption",navbar:!0},i.a.createElement(z.a,null,"TheCovidSimulator")),i.a.createElement(N.a,{className:"navbar__nav right ",navbar:!0},i.a.createElement(z.a,{className:" d-inline-flex justify-content-between"},i.a.createElement(V.a,null,"Stay safe. For more visit\xa0"),i.a.createElement(k.a,{href:"https://www.countdownkings.com/"},"CountdownKings.com")))))},J=(a(60),function(e){var t=e.isOpen,a=e.toggle,n=e.copy,o=e.shareModalTitle;return i.a.createElement(E.a,{key:"sharemodal",isOpen:t,toggle:a,centered:!0,className:"share-modal"},i.a.createElement(f.a,{charCode:"X",toggle:a},o),i.a.createElement(w.a,{className:"justify-content-center"},i.a.createElement(S.a,null,i.a.createElement(x.a,{className:"share"},"Share with your friends")),i.a.createElement(S.a,null,i.a.createElement(x.a,null,"https://www.covidsimulator.com")),i.a.createElement(S.a,null,i.a.createElement(x.a,null,i.a.createElement(W.a,{onClick:n},"Copy link")))),i.a.createElement(_.a,null,i.a.createElement(x.a,{className:"col-12 d-inline-flex justify-content-center"},"For more visit\xa0",i.a.createElement(k.a,{target:"_blank",rel:"noopener noreferrer",href:"https://www.countdownkings.com"},"CountdownKings.com"))))}),B=(a(61),a(62),function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).canvasRef=i.a.createRef(),n.state={simulation:!0,game:!1,hasError:!1,error:null,currentTime:(new Date).getTime(),canvasAnimating:!0,pause:!1,stop:!1,startButtonText:"STOP SIMULATION",isNavbarExpanded:!1,isNavbarVisible:!0,shareModalTitle:"",shareModalOpen:!1,simulationSettingsOpen:!1,simulationSettings:{size:6,speed:2,quantity:"250",deactivateAfter:"0",showTime:!0,showStats:!0,autorestart:!0}},n.interval=null,n.canvasWidth=window.innerWidth,n.canvasHeight=window.innerHeight,n._draw=b.bind(Object(u.a)(n)),n.playPause=n.playPause.bind(Object(u.a)(n)),n.intervalTime=n.intervalTime.bind(Object(u.a)(n)),n.handleResize=n.handleResize.bind(Object(u.a)(n)),n.toggleShareModal=n.toggleShareModal.bind(Object(u.a)(n)),n.copyToClipboard=n.copyToClipboard.bind(Object(u.a)(n)),n.stopStartSimulation=n.stopStartSimulation.bind(Object(u.a)(n)),n.setSimulationSettings=n.setSimulationSettings.bind(Object(u.a)(n)),n.toggleSimulationDialog=n.toggleSimulationDialog.bind(Object(u.a)(n)),n.toggleNavbarVisibility=n.toggleNavbarVisibility.bind(Object(u.a)(n)),n.toggleNavbarItemsExpand=n.toggleNavbarItemsExpand.bind(Object(u.a)(n)),n}return Object(c.a)(a,[{key:"componentDidCatch",value:function(e,t){}},{key:"componentDidMount",value:function(){window.addEventListener("resize",this.handleResize),this.interval=Object(h.setDriftlessInterval)(this.intervalTime,1e3),this._draw()}},{key:"componentWillUnmount",value:function(){Object(h.clearDriftless)(this.interval)}},{key:"intervalTime",value:function(){this.setState({currentTime:(new Date).getTime()})}},{key:"handleResize",value:function(e){this.canvasWidth=window.innerWidth<this.canvasWidth?this.canvasWidth:window.innerWidth,this.canvasHeight=window.innerHeight<this.canvasHeight?this.canvasHeight:window.innerHeight}},{key:"playPause",value:function(){this.state.canvasAnimating?(this.shouldAnimationStop=!0,this.setState({stop:!1,canvasAnimating:!1,pause:!0,startButtonText:"Resume Simulation"})):(this.shouldAnimationStop=!1,this.setState({stop:!1,canvasAnimating:!0,pause:!1,startButtonText:"Pause Simulation"}))}},{key:"stopStartSimulation",value:function(){this.state.stop?(this.setState({stop:!1,canvasAnimating:!0,pause:!1,startButtonText:"STOP SIMULATION",simulationSettingsOpen:!1}),this._draw()):this.setState({stop:!0,canvasAnimating:!1,pause:!0,startButtonText:"START SIMULATION"})}},{key:"setSimulationSettings",value:function(e){var t=e.currentTarget.getAttribute("data-option"),a=JSON.parse(t)||{};this.setState((function(e){return{simulationSettings:Object(s.a)({},e.simulationSettings,{},a)}}))}},{key:"toggleShareModal",value:function(e){var t=e.currentTarget.getAttribute("data");this.setState((function(e){return{shareModalOpen:!e.shareModalOpen,shareModalTitle:t?"GAME COMING SOON":""}}))}},{key:"toggleSimulationDialog",value:function(){this.setState((function(e){return{simulationSettingsOpen:!e.simulationSettingsOpen,pause:!e.pause}}))}},{key:"toggleNavbarItemsExpand",value:function(){this.setState((function(e){return{isNavbarExpanded:!e.isNavbarExpanded}}))}},{key:"toggleNavbarVisibility",value:function(){this.setState((function(e){return{isNavbarVisible:!e.isNavbarVisible}}))}},{key:"copyToClipboard",value:function(){navigator.permissions.query({name:"clipboard-write"}).then((function(e){"granted"!=e.state&&"prompt"!=e.state||navigator.clipboard.writeText("https://www.covidsimulator.com")}))}},{key:"render",value:function(){return i.a.createElement("section",{onClick:this.test,className:"main"},i.a.createElement(R,{toggleNavbarItemsExpand:this.toggleNavbarItemsExpand,toggleNavbarVisibility:this.toggleNavbarVisibility,isNavbarExpanded:this.state.isNavbarExpanded,isNavbarVisible:this.state.isNavbarVisible,toggleSimulationDialog:this.toggleSimulationDialog,toggleShareModal:this.toggleShareModal}),i.a.createElement(I,{startSimulation:this.stopStartSimulation,isOpen:this.state.simulationSettingsOpen,toggle:this.toggleSimulationDialog,buttonText:this.state.startButtonText,settings:this.state.simulationSettings,setSimulationSettings:this.setSimulationSettings}),i.a.createElement(J,{isOpen:this.state.shareModalOpen,toggle:this.toggleShareModal,copy:this.copyToClipboard,shareModalTitle:this.state.shareModalTitle}),i.a.createElement("article",{className:"main__canvas"},i.a.createElement("canvas",{onClick:this.toggleSimulationDialog,id:"canvas",ref:this.canvasRef,className:"canvas",width:this.canvasWidth,height:this.canvasHeight},"Sorry, your browser doesn't support HTML5 ")))}}],[{key:"getDerivedStateFromError",value:function(e){return{hasError:!0}}}]),a}(i.a.Component));a(63);var P=function(){return i.a.createElement("div",{className:"App"},i.a.createElement(B,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(P,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[32,1,2]]]);
//# sourceMappingURL=main.7e0d0483.chunk.js.map
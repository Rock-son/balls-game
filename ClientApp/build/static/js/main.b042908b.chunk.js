(this.webpackJsonpballs=this.webpackJsonpballs||[]).push([[0],{32:function(t,e,a){t.exports=a(65)},37:function(t,e,a){},49:function(t,e,a){},59:function(t,e,a){},60:function(t,e,a){},61:function(t,e,a){},63:function(t,e,a){},64:function(t,e,a){},65:function(t,e,a){"use strict";a.r(e);var i=a(0),n=a.n(i),s=a(18),o=a.n(s),l=(a(37),a(19)),r=a(12),c=a(13),u=a(5),m=a(14),d=a(15),h=a(23),g=function(t,e,a,i){t.x+t.radius>(window.innerWidth<t.reactContext.canvasWidth?t.reactContext.canvasWidth:window.innerWidth)&&(t.velocity.x=-t.velocity.x),t.x-t.radius<0&&(t.velocity.x=-t.velocity.x),t.y+t.radius>(window.innerHeight<t.reactContext.canvasHeight?t.reactContext.canvasHeight:window.innerHeight)&&(t.velocity.y=-t.velocity.y),t.y-t.radius<0&&(t.velocity.y=-t.velocity.y),t.reactContext.state.simulationSettings.deactivateAfter>0&&t.contagiousFrom&&(new Date).getTime()-t.contagiousFrom>t.reactContext.state.simulationSettings.deactivateAfter&&(t.contagion=0,t.contagiousFrom=null,t.texture=i.resources.sheet.textures["ball-white-15.png"],t.reactContext.setState((function(t){return{contagious:t.contagious-1,healthy:t.healthy+1}})));for(var n=0;n<e.length;n++)if(t.myID!==e[n].myID&&a(t.x,t.y,e[n].x,e[n].y)-2*t.radius<0){var s=e[n];t.reactContext.state.simulationSettings.deactivateAfter>0&&(s.contagion||t.contagion)&&(t.contagiousFrom=(new Date).getTime(),s.contagiousFrom=(new Date).getTime()),s.contagion&&!t.contagion?(t.reactContext.setState((function(t){return{contagious:t.contagious+1,healthy:t.healthy-1}})),t.contagion=1,t.texture=i.resources.sheet.textures["ball-red-15.png"],t.reactContext.state.simulationSettings.autorestart&&0===t.reactContext.state.healthy&&t.reactContext.simulationRestart()):t.contagion&&!s.contagion&&(t.reactContext.setState((function(t){return{contagious:t.contagious+1,healthy:t.healthy-1}})),s.contagion=1,s.texture=i.resources.sheet.textures["ball-red-15.png"],t.reactContext.state.simulationSettings.autorestart&&0===t.reactContext.state.healthy&&t.reactContext.simulationRestart()),v(t,s)}t.x+=t.velocity.x,t.y+=t.velocity.y};function p(t,e){return{x:t.x*Math.cos(e)-t.y*Math.sin(e),y:t.x*Math.sin(e)+t.y*Math.cos(e)}}function v(t,e){var a=t.velocity.x-e.velocity.x,i=t.velocity.y-e.velocity.y;if(a*(e.x-t.x)+i*(e.y-t.y)>=0){var n=-Math.atan2(e.y-t.y,e.x-t.x),s=p(t.velocity,n),o=p(e.velocity,n),l={x:o.x,y:s.y},r={x:s.x,y:o.y},c=p(l,-n),u=p(r,-n),m=y(t,c),d=y(e,u);t.velocity.x=m.x,t.velocity.y=m.y,e.velocity.x=d.x,e.velocity.y=d.y}}function y(t,e){var a=Math.sqrt(Math.pow(e.x,2)+Math.pow(e.y,2));return{x:e.x*t.startSpeed/a,y:e.y*t.startSpeed/a}}var b=a(10);function f(t){var e=this,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;this.autostart=t||!1,this.simulationApp=new b.a({backgroundColor:0,width:this.canvasWidth,height:this.canvasHeight,resolution:window.devicePixelRatio||1,autoDensity:!0,sharedLoader:!0}),document.getElementById("canvas-container").appendChild(this.simulationApp.view),null==this.simulationApp.loader.resources.sheet?this.simulationApp.loader.add("sheet","balls.json").on("progress",(function(t,e){return console.log(t.progress+"% loaded")})).on("load",(function(t,e){return console.log("Asset loaded"+e.name)})).on("error",(function(t){return console.error("load error",t)})).load(E.bind(this,a)):this.simulationApp.loader.load(E.bind(this,a));var i=function(t){e.simulationApp&&e.simulationApp.renderer.resize(window.innerWidth<e.canvasWidth?e.canvasWidth:window.innerWidth,window.innerHeight<e.canvasHeight?e.canvasHeight:window.innerHeight)};window.addEventListener("resize",i)}function S(t,e){return Math.floor(Math.random()*(e-t+1))+t}function x(t,e,a,i){var n=a-t,s=i-e;return Math.sqrt(Math.pow(n,2)+Math.pow(s,2))}function E(t){for(var e,a,i=null==t?this.state.simulationSettings:t,n=i.size,s=i.speed,o=[],l=+i.quantity,r=this.canvasWidth-2.5*n,c=this.canvasHeight-2.5*n,u=this.simulationApp.loader.resources.sheet.textures["ball-white-15.png"],m=this.simulationApp.loader.resources.sheet.textures["ball-red-15.png"],d=0;d<l;d++){e=0===d?1:0;var h=S(2*n,r),p=S(2*n,c);if(0!==d)for(var v=0;v<o.length;v++)x(h,p,o[v].x,o[v].y)-(n+o[v].radius)<0&&(h=S(2*n,r),p=S(2*n,c),v=-1);(a=e?new b.c(m):new b.c(u)).x=h,a.y=p,a.width=2*n,a.height=2*n,a.anchor.x=.5,a.anchor.y=.5,a.myID=d,a.radius=n,a.reactContext=this,a.contagion=e,a.contagiousFrom=null;var y=Math.random()-.5,f=Math.random()-.5;a.velocity={x:y<0&&y>-.3?y*s-s:y>0&&y<.3?y+s:y*s,y:f<0&&f>-.3?f*s-s:f>0&&f<.3?f+s:f*s},a.startSpeed=Math.sqrt(Math.pow(a.velocity.x,2)+Math.pow(a.velocity.y,2)),o.push(a)}var E=o.length;if(this.autostart)for(var w=0;w<E;w++)this.simulationApp.stage.addChild(o[w]),this.simulationApp.ticker.add(g.bind(null,o[w],o,x,this.simulationApp.loader));else for(var N=0;N<E;N++)this.simulationApp.stage.addChild(o[N]),this.simulationApp.ticker.addOnce(g.bind(null,o[N],o,x,this.simulationApp.loader))}var w=function(t,e,a,i){if(t.time&&(new Date).getTime()-t.time>2e4&&(t.x=-500,t.y=-500,t.time=null),t.time&&!t.reactContext.state.quarantineDropped&&t.myID===t.reactContext.state.draggedQuarantine.id&&(t.x=t.reactContext.state.draggedQuarantine.x,t.y=t.reactContext.state.draggedQuarantine.y),t.x+t.radius>(window.innerWidth<t.reactContext.canvasWidth?t.reactContext.canvasWidth:window.innerWidth)&&(t.velocity.x=-t.velocity.x),t.x-t.radius<0&&(t.velocity.x=-t.velocity.x),t.y+t.radius>(window.innerHeight<t.reactContext.canvasHeight?t.reactContext.canvasHeight:window.innerHeight)&&(t.velocity.y=-t.velocity.y),t.y-t.radius<0&&(t.velocity.y=-t.velocity.y),t.myID!==t.reactContext.state.draggedQuarantine.id||t.reactContext.state.quarantineDropped){for(var n=0;n<e.length;n++)if(t.myID!==e[n].myID&&(0!==e[n].velocity.x||0!==e[n].velocity.y)&&a(t.x,t.y,e[n].x,e[n].y)-(t.radius+e[n].radius)<0){var s=e[n];s.myID<t.reactContext.state.gameSettings.quantity&&t.myID<t.reactContext.state.gameSettings.quantity&&(s.contagion&&!t.contagion?(t.reactContext.setState((function(t){return{contagious:t.contagious+1,healthy:t.healthy-1}})),t.contagion=1,t.contagiousFrom=(new Date).getTime(),t.texture=i.resources.sheet.textures["ball-red-15.png"],t.reactContext.state.simulationSettings.autorestart&&0===t.reactContext.state.healthy&&t.reactContext.gameRestart()):t.contagion&&!s.contagion&&(t.reactContext.setState((function(t){return{contagious:t.contagious+1,healthy:t.healthy-1}})),s.contagion=1,s.contagiousFrom=(new Date).getTime(),s.texture=i.resources.sheet.textures["ball-red-15.png"],t.reactContext.state.simulationSettings.autorestart&&0===t.reactContext.state.healthy&&t.reactContext.gameRestart())),k(t,s,a)}0===t.velocity.x&&0===t.velocity.y?(t.x=t.x,t.y=t.y):(t.x+=t.velocity.x,t.y+=t.velocity.y)}};function N(t,e){return{x:t.x*Math.cos(e)-t.y*Math.sin(e),y:t.x*Math.sin(e)+t.y*Math.cos(e)}}function k(t,e,a){var i,n,s=t.reactContext.state.gameSettings.quantity;if(i=t.velocity.x-e.velocity.x,n=t.velocity.y-e.velocity.y,i*(e.x-t.x)+n*(e.y-t.y)>0){var o=-Math.atan2(e.y-t.y,e.x-t.x),l=N(t.velocity,o),r=N(e.velocity,o),c={x:r.x,y:l.y},u={x:l.x,y:r.y},m=N(c,-o),d=N(u,-o),h=A(t,m),g=A(e,d);t.velocity.x=h.x,t.velocity.y=h.y,e.velocity.x=g.x,e.velocity.y=g.y}else t.myID>=s&&a(t.x,t.y,e.x,e.y)-(t.radius+e.radius)<-2&&(t.velocity.x=0,t.velocity.y=0,e.velocity.x=0,e.velocity.y=0)}function A(t,e){var a=Math.sqrt(Math.pow(e.x,2)+Math.pow(e.y,2));return{x:e.x*t.startSpeed/a,y:e.y*t.startSpeed/a}}function O(t){var e=this,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;this.autostart=t||!1,this.gameApp=new b.a({backgroundColor:0,width:this.canvasWidth,height:this.canvasHeight,resolution:window.devicePixelRatio||1,autoDensity:!0,sharedLoader:!0}),document.getElementById("canvas-container").appendChild(this.gameApp.view),null==this.gameApp.loader.resources.sheet?this.gameApp.loader.add("sheet","balls.json").on("progress",(function(t,e){return console.log(t.progress+"% loaded")})).on("load",(function(t,e){return console.log("Asset loaded"+e.name)})).on("error",(function(t){return console.error("load error",t)})).load(_.bind(this,a)):this.gameApp.loader.load(_.bind(this,a));var i=function(t){e.gameApp&&e.gameApp.renderer.resize(window.innerWidth<e.canvasWidth?e.canvasWidth:window.innerWidth,window.innerHeight<e.canvasHeight?e.canvasHeight:window.innerHeight)};window.addEventListener("resize",i)}function C(t,e){return Math.floor(Math.random()*(e-t+1))+t}function T(t,e,a,i){var n=a-t,s=i-e;return Math.sqrt(Math.pow(n,2)+Math.pow(s,2))}function _(t){for(var e,a,i=null==t?this.state.gameSettings:t,n=i.size,s=i.speed,o=i.quantity,l=(i.difficulty,i.availableQuarantines,[]),r=1;r<this.state.availableQuarantines.length+1;r++){var c=C(50*r,70*r),u=c,m=c,d=c/2,h=new b.b;h.beginFill(),h.lineStyle(5,8774418,1),h.drawCircle(0,0,d),h.endFill();var g=h.generateCanvasTexture(),p=this.state.gameSettings.quantity+r-1,v=new b.c(g);v.x=-500,v.y=-500,v.alpha=.5,v.time=(new Date).getTime(),v.width=u,v.height=m,v.anchor.x=.5,v.anchor.y=.5,v.myID=p,v.radius=d,v.reactContext=this,v.contagion=0,v.contagiousFrom=null,v.velocity={x:0,y:0},v.startSpeed=0,l.push(v)}for(var y=[],f=+o,S=this.canvasWidth-2.5*n,x=this.canvasHeight-2.5*n,E=this.gameApp.loader.resources.sheet.textures["ball-white-15.png"],N=this.gameApp.loader.resources.sheet.textures["ball-red-15.png"],k=0;k<f;k++){e=0===k?1:0;var A=C(2*n,S),O=C(2*n,x);if(0!==k)for(var _=0;_<y.length;_++)T(A,O,y[_].x,y[_].y)-(n+y[_].radius)<0&&(A=C(2*n,S),O=C(2*n,x),_=-1);(a=e?new b.c(N):new b.c(E)).x=A,a.y=O,a.width=2*n,a.height=2*n,a.anchor.x=.5,a.anchor.y=.5,a.myID=k,a.radius=n,a.reactContext=this,a.contagion=e,a.contagiousFrom=0;var M=Math.random()-.5,D=Math.random()-.5;a.velocity={x:M<0&&M>-.3?M*s-s:M>0&&M<.3?M+s:M*s,y:D<0&&D>-.3?D*s-s:D>0&&D<.3?D+s:D*s},a.startSpeed=Math.sqrt(Math.pow(a.velocity.x,2)+Math.pow(a.velocity.y,2)),y.push(a)}l.forEach((function(t){return y.push(t)}));var q=y.length;if(this.autostart)for(var j=0;j<q;j++)this.gameApp.stage.addChild(y[j]),this.gameApp.ticker.add(w.bind(null,y[j],y,T,this.gameApp.loader));else for(var I=0;I<q;I++)this.gameApp.stage.addChild(y[I]),this.gameApp.ticker.addOnce(w.bind(null,y[I],y,T,this.gameApp.loader))}function M(){return this.simulationApp?this.simulationApp.ticker.stop():this.gameApp?this.gameApp.ticker.stop():void 0}function D(){return this.simulationApp?this.simulationApp.ticker.start():this.gameApp?this.gameApp.ticker.start():void 0}function q(){this.simulationApp?(this.simulationApp.destroy(!0),this.simulationApp=null):this.gameApp&&(this.gameApp.destroy(!0),this.gameApp=null)}var j=a(79),I=a(66),G=a(67),P=a(68),W=a(69),B=a(70),Q=a(71),H=a(72),z=[{type:"small",value:2.5},"|",{type:"medium",value:5},"|",{type:"large",value:7.5}],R={2.5:[100,"|",200,"|",300,"|",400,"|",500,"|",700,"|",800,"|",1e3],5:[100,"|",200,"|",300,"|",400,"|",500,"|",600,"|",700,"|",800],7.5:[50,"|",100,"|",150,"|",200,"|",300,"|",400,"|",500]},U=[{type:"slow",value:.3},"|",{type:"medium",value:.6},"|",{type:"fast",value:1}],F=[0,"|",1e4,"|",15e3,"|",2e4,"|",3e4,"|",45e3,"|",6e4],L=[{type:"yes",value:!0},"|",{type:"no",value:!1}],J=(a(49),function(t){Object(d.a)(a,t);var e=Object(m.a)(a);function a(){return Object(r.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"shouldComponentUpdate",value:function(t,e){return!!t.isSimulationActive&&(this.props.isOpen!==t.isOpen||this.props.buttonText!==t.buttonText||(this.props.settings.size!==t.settings.size||this.props.settings.speed!==t.settings.speed||this.props.settings.quantity!==t.settings.quantity||this.props.settings.deactivateAfter!==t.settings.deactivateAfter||this.props.settings.showTime!==t.settings.showTime||this.props.settings.showStats!==t.settings.showStats||this.props.settings.autorestart!==t.settings.autorestart))}},{key:"componentDidUpdate",value:function(t,e){if(!this.props.isSimulationActive)return!1;var a=R[this.props.settings.size][0]||0,i=R[this.props.settings.size].slice(-1)[0]||1e3;return this.props.settings.quantity>i?this.props.setSimulationSettings({quantity:i}):this.props.settings.quantity<a?this.props.setSimulationSettings({quantity:a}):void 0}},{key:"render",value:function(){var t=this.props,e=t.isOpen,a=t.toggle,i=t.startSimulation,s=t.buttonText,o=t.setSimulationSettings,l=t.settings,r=l.size,c=l.speed,u=l.quantity,m=l.deactivateAfter,d=l.showTime,h=l.showStats,g=l.autorestart;return n.a.createElement(j.a,{key:"simulator",isOpen:e,toggle:a,centered:!0,fade:!0,className:"simulator-modal"},n.a.createElement(I.a,{charCode:"X",toggle:a}),n.a.createElement(G.a,null,n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Size of balls"),n.a.createElement(B.a,{className:"choice__options"},z.map((function(t,e){return"object"!=typeof t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({size:t.value})),onClick:o,active:t.value===r},t.type)}))))),n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Number of balls"),n.a.createElement(B.a,{className:"choice__options"},R[r].map((function(t,e){return"|"===t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({quantity:t})),onClick:o,active:t===u},t)}))))),n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Speed of balls"),n.a.createElement(B.a,{className:"choice__options"},U.map((function(t,e){return"object"!=typeof t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({speed:t.value})),onClick:o,active:t.value===c},t.type)}))))),n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Deactivate ball after"),n.a.createElement(B.a,{className:"choice__options"},F.map((function(t,e){return"|"===t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({deactivateAfter:t})),onClick:o,active:t===m},0===t?"no":"".concat(t/1e3,"s"))}))))),n.a.createElement(P.a,{className:"col-12"},n.a.createElement(W.a,{className:"col-4 choice"},n.a.createElement("div",null,"Show time"),n.a.createElement(B.a,{className:"choice__options"},L.map((function(t,e){return"object"!==typeof t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({showTime:t.value})),onClick:o,active:t.value===d},t.type)})))),n.a.createElement(W.a,{className:"col-4 choice"},n.a.createElement("div",null,"Show stats"),n.a.createElement(B.a,{className:"choice__options"},L.map((function(t,e){return"object"!==typeof t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({showStats:t.value})),onClick:o,active:t.value===h},t.type)})))),n.a.createElement(W.a,{className:"col-4 choice"},n.a.createElement("div",null,"Autorestart"),n.a.createElement(B.a,{className:"choice__options"},L.map((function(t,e){return"object"!==typeof t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({autorestart:t.value})),onClick:o,active:t.value===g},t.type)})))))),n.a.createElement(H.a,{onClick:i,className:"simulator-modal__footer"},">>>\xa0\xa0 ",s," \xa0\xa0<<<"))}}]),a}(n.a.Component)),V=a(73),X=a(74),K=a(75),Y=a(76),Z=a(77),$=a(78),tt=function(t){var e=t.toggleNavbarItemsExpand,a=t.isNavbarExpanded,i=t.toggleNavbarVisibility,s=t.isNavbarVisible,o=t.contagious,l=t.healthy,r=t.toggleSimulationDialog,c=t.toggleShareDialog,u=t.toggleGameDialog,m=t.startTime,d=t.simulationSettings,h=d.showTime,g=d.showStats,p=m.getSeconds(),v=p<10?"0"+p:p;return n.a.createElement(V.a,{dark:!0,className:"main__navbar ".concat(!s&&"hidden"," d-inline-flex justify-content-between")},n.a.createElement(X.a,{className:"main__navbar__toggler ".concat(s&&"hidden"),onClick:i,disabled:s},n.a.createElement("svg",{height:"15",width:"20"},n.a.createElement("path",{d:"M-2 2 l12 12 M10 15 l12 -13 Z",fill:"none",strokeWidth:"5",stroke:"white"}))),n.a.createElement(V.a,{dark:!0,className:"col-6 main__navbar__left d-inline-flex justify-content-between",expand:"sm"},n.a.createElement(K.a,{onClick:e}),n.a.createElement(Y.a,{isOpen:a,navbar:!0},n.a.createElement(B.a,{className:"navbar__nav left",navbar:!0},n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"navbar__nav__link",onClick:r},"Simulate")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"d-none d-sm-block disabled stick"},"|")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{data:"game",className:"navbar__nav__link",onClick:u},"Play game")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"d-none d-sm-block disabled stick"},"|")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{data:"game",className:"navbar__nav__link"},"Stay Safe")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"d-none d-sm-block disabled stick"},"|")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"navbar__nav__link",onClick:c},"Share")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"d-none d-sm-block disabled stick"},"|")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"navbar__nav__link"},"About")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"d-none d-sm-block disabled stick"},"|")),n.a.createElement(Z.a,null,n.a.createElement(Q.a,{className:"navbar__nav__link",onClick:i},"Hide"))))),n.a.createElement(V.a,{dark:!0,className:"col-6 main__navbar__right d-inline-flex justify-content-between"},n.a.createElement(B.a,{className:"navbar__nav caption",navbar:!0},n.a.createElement(Z.a,null,"TheCovidSimulator")),n.a.createElement(B.a,{className:"navbar__nav right",navbar:!0},n.a.createElement(Z.a,{className:" d-inline-flex justify-content-between"},n.a.createElement($.a,null,"Stay safe. For more visit\xa0"),n.a.createElement(Q.a,{href:"https://www.countdownkings.com/",target:"_blank",rel:"nooperner noreferrer"},"CountdownKings.com")),n.a.createElement(Z.a,{className:"stats ".concat(!s&&"drop")},g?n.a.createElement(n.a.Fragment,null,n.a.createElement($.a,{className:"stats__infected"},"Infected:\xa0",o),n.a.createElement($.a,{className:"stats__healthy"},"Healthy:\xa0",l)):""),n.a.createElement(Z.a,{className:"timer ".concat(!s&&"drop")},h?"".concat(m.getMinutes(),":").concat(v):""))))},et=(a(59),function(t){var e=t.isOpen,a=t.toggle,i=t.copy,s=t.isCopied;return n.a.createElement(j.a,{key:"sharemodal",isOpen:e,toggle:a,centered:!0,className:"share-modal"},n.a.createElement(I.a,{charCode:"X",toggle:a}),n.a.createElement(G.a,{className:"justify-content-center"},n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"share"},"Share with your friends")),n.a.createElement(P.a,null,n.a.createElement(W.a,null,"https://www.covidsimulator.com")),n.a.createElement(P.a,null,n.a.createElement(W.a,null,s?n.a.createElement("div",{className:"copied__link"},"Link copied ",n.a.createElement("span",{role:"img","aria-label":"smiley face"},"\ud83d\ude03")):n.a.createElement(X.a,{onClick:i},"Copy link")))),n.a.createElement(H.a,null,n.a.createElement(W.a,{className:"col-12 d-inline-flex justify-content-center"},"For more visit\xa0",n.a.createElement(Q.a,{className:"footer__link",target:"_blank",rel:"noopener noreferrer",href:"https://www.countdownkings.com"},"CountdownKings.com"))))}),at=[{type:"Keep Uninfected",value:0},"|",{type:"Time Challenge",value:1}],it=[{type:"Easy",value:0},"|",{type:"Medium",value:1},"|",{type:"Hard",value:2}],nt=[{type:"Small",value:2.5},"|",{type:"Medium",value:5},"|",{type:"Large",value:7.5}],st={2.5:[100,"|",200,"|",300,"|",400,"|",500,"|",700,"|",800,"|",1e3],5:[100,"|",200,"|",300,"|",400,"|",500,"|",600,"|",700,"|",800],7.5:[50,"|",100,"|",150,"|",200,"|",300,"|",400,"|",500,"|",600]},ot={0:{2.5:{min:100,max:300},5:{min:100,max:300},7.5:{min:50,max:100}},1:{2.5:{min:300,max:500},5:{min:300,max:500},7.5:{min:150,max:300}},2:{2.5:{min:700,max:1e3},5:{min:600,max:800},7.5:{min:300,max:600}}},lt=[{type:"Slow",value:.3,difficulty:0},"|",{type:"Medium",value:.6,difficulty:1},"|",{type:"Fast",value:1,difficulty:2}],rt={0:.5,1:1,2:1.5},ct=(a(60),function(t){Object(d.a)(a,t);var e=Object(m.a)(a);function a(){return Object(r.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"shouldComponentUpdate",value:function(t,e){return!!t.isGameActive&&(this.props.isOpen!==t.isOpen||this.props.buttonText!==t.buttonText||(this.props.settings.mode!==t.settings.mode||this.props.settings.difficulty!==t.settings.difficulty||this.props.settings.size!==t.settings.size||this.props.settings.quantity!==t.settings.quantity||this.props.settings.speed!==t.settings.speed))}},{key:"componentDidUpdate",value:function(t,e){if(!this.props.isGameActive)return!1;var a=(ot[this.props.settings.difficulty][this.props.settings.size]||{min:0}).min,i=(ot[this.props.settings.difficulty][this.props.settings.size]||{max:1e3}).max,n=rt[this.props.settings.difficulty];return this.props.settings.quantity>i?this.props.setGameSettings({quantity:i,speed:n}):this.props.settings.quantity<a?this.props.setGameSettings({quantity:a,speed:n}):this.props.settings.speed!==n?this.props.setGameSettings({speed:n}):void 0}},{key:"render",value:function(){var t=this.props,e=t.isOpen,a=t.toggle,i=t.startGame,s=t.buttonText,o=t.setGameSettings,l=t.settings,r=l.mode,c=l.difficulty,u=l.size,m=l.quantity,d=l.speed;return n.a.createElement(j.a,{key:"game",isOpen:e,toggle:a,centered:!0,fade:!0,className:"simulator-modal"},n.a.createElement(I.a,{charCode:"X",toggle:a}),n.a.createElement(G.a,null,n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Game Mode"),n.a.createElement(B.a,{className:"choice__options"},at.map((function(t,e){return"object"!=typeof t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({mode:t.value})),onClick:o,active:t.value===r},t.type)}))))),n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Difficulty level (also affects Quarantine)"),n.a.createElement(B.a,{className:"choice__options"},it.map((function(t,e){return"|"===t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({difficulty:t.value})),onClick:o,active:t.value===c},t.type)}))))),n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Size of balls"),n.a.createElement(B.a,{className:"choice__options"},nt.map((function(t,e){return"object"!=typeof t?n.a.createElement(Q.a,{className:"disabled",key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({size:t.value})),onClick:o,active:t.value===u},t.type)}))))),n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Number of balls"),n.a.createElement(B.a,{className:"choice__options"},st[u].map((function(t,e){return"|"===t?n.a.createElement(Q.a,{className:"disabled",key:e},t):ot[c][u]&&t<ot[c][u].min||ot[c][u]&&t>ot[c][u].max?n.a.createElement(Q.a,{disabled:!0,key:e},t):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({quantity:t})),onClick:o,active:t===m},t)}))))),n.a.createElement(P.a,null,n.a.createElement(W.a,{className:"choice"},n.a.createElement("div",null,"Speed of balls"),n.a.createElement(B.a,{className:"choice__options"},lt.map((function(t,e){return"object"!=typeof t?n.a.createElement(Q.a,{className:"disabled",key:e},t):t.difficulty!==c?n.a.createElement(Q.a,{className:"disabled",key:e},t.type):n.a.createElement(Q.a,{key:e,tabIndex:"0","data-option":"".concat(JSON.stringify({speed:t.value})),onClick:o,active:t.value===d},t.type)})))))),n.a.createElement(H.a,{onClick:i,className:"simulator-modal__footer"},">>>\xa0\xa0 ",s," \xa0\xa0<<<"))}}]),a}(n.a.Component)),ut=(a(61),function(t){Object(d.a)(a,t);var e=Object(m.a)(a);function a(){return Object(r.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"shouldComponentUpdate",value:function(t,e){return t.quarantineButtonsActive!==this.props.quarantineButtonsActive}},{key:"render",value:function(){var t=this.props,e=t.quarantineButtonsActive,a=(t.quarantineAppearanceSettings,t.setQuarantineInMotion);return n.a.createElement(n.a.Fragment,null,n.a.createElement(X.a,{onClick:a,className:"btn btn-success quarantine__btn quarantine__btn--left-top ".concat(!e&&"disabled")},"Quarantine"),n.a.createElement(X.a,{onClick:a,className:"btn btn-success quarantine__btn quarantine__btn--left-bottom ".concat(!e&&"disabled")},"Quarantine"),n.a.createElement(X.a,{onClick:a,className:"btn btn-success quarantine__btn quarantine__btn--right-top ".concat(!e&&"disabled")},"Quarantine"),n.a.createElement(X.a,{onClick:a,className:"btn btn-success quarantine__btn quarantine__btn--right-bottom ".concat(!e&&"disabled")},"Quarantine"))}}]),a}(n.a.Component)),mt=(a(62),a(63),function(t){Object(d.a)(a,t);var e=Object(m.a)(a);function a(t){var i;return Object(r.a)(this,a),(i=e.call(this,t)).autostart=!0,i.simulationApp=null,i.gameApp=null,i.state={isSimulationActive:!0,isGameActive:!1,hasError:!1,error:null,currentTime:(new Date).getTime(),startTime:new Date(0),simulationPaused:!1,gamePaused:!0,simulationStopped:!1,gameStopped:!0,contagious:1,healthy:199,startButtonText:"CONTINUE SIMULATION",isCopied:!1,isNavbarExpanded:!1,isNavbarVisible:!0,shareModalOpen:!1,simulationSettingsOpen:!1,gameSettingsOpen:!1,quarantineButtonsActive:!1,quarantineDropped:!1,availableQuarantines:Array.apply(0,{length:5}).map((function(t,e){return e})),activeQuarantines:[],draggedQuarantine:{id:0,x:0,y:0},gameSettings:{mode:0,difficulty:0,size:window.innerWidth<800?2.5:5,quantity:100,speed:0},simulationSettings:{size:window.innerWidth<800?2.5:5,speed:1,quantity:200,deactivateAfter:0,showTime:!0,showStats:!0,autorestart:!0}},i.interval=null,i.canvasWidth=window.innerWidth,i.canvasHeight=window.innerHeight,i.stop=q.bind(Object(u.a)(i)),i.startSimulation=f.bind(Object(u.a)(i)),i.startGame=O.bind(Object(u.a)(i)),i.pause=M.bind(Object(u.a)(i)),i.unpause=D.bind(Object(u.a)(i)),i.shuffle=i.shuffle.bind(Object(u.a)(i)),i.toggleDialog=i.toggleDialog.bind(Object(u.a)(i)),i.onMouseMove=i.onMouseMove.bind(Object(u.a)(i)),i.toggleSimulationPause=i.toggleSimulationPause.bind(Object(u.a)(i)),i.toggleGamePause=i.toggleGamePause.bind(Object(u.a)(i)),i.intervalTime=i.intervalTime.bind(Object(u.a)(i)),i.handleResize=i.handleResize.bind(Object(u.a)(i)),i.handleBlur=i.handleBlur.bind(Object(u.a)(i)),i.handleRefocus=i.handleRefocus.bind(Object(u.a)(i)),i.copyToClipboard=i.copyToClipboard.bind(Object(u.a)(i)),i.gameRestart=i.gameRestart.bind(Object(u.a)(i)),i.stopStartGame=i.stopStartGame.bind(Object(u.a)(i)),i.setGameSettings=i.setGameSettings.bind(Object(u.a)(i)),i.toggleGameDialog=i.toggleGameDialog.bind(Object(u.a)(i)),i.setQuarantineInMotion=i.setQuarantineInMotion.bind(Object(u.a)(i)),i.simulationRestart=i.simulationRestart.bind(Object(u.a)(i)),i.toggleShareDialog=i.toggleShareDialog.bind(Object(u.a)(i)),i.stopStartSimulation=i.stopStartSimulation.bind(Object(u.a)(i)),i.setSimulationSettings=i.setSimulationSettings.bind(Object(u.a)(i)),i.toggleSimulationDialog=i.toggleSimulationDialog.bind(Object(u.a)(i)),i.toggleNavbarVisibility=i.toggleNavbarVisibility.bind(Object(u.a)(i)),i.toggleNavbarItemsExpand=i.toggleNavbarItemsExpand.bind(Object(u.a)(i)),i}return Object(c.a)(a,[{key:"componentDidMount",value:function(){this.startSimulation(!0),window.addEventListener("resize",this.handleResize),window.addEventListener("blur",this.handleBlur),window.addEventListener("focus",this.handleRefocus),this.interval=Object(h.setDriftlessInterval)(this.intervalTime,1e3)}},{key:"componentDidCatch",value:function(t,e){}},{key:"componentWillUnmount",value:function(){Object(h.clearDriftless)(this.interval),this.simulationApp&&this.simulationApp.destroy(!0),this.gameApp&&this.gameApp.destroy(!0)}},{key:"intervalTime",value:function(){var t=this;this.setState((function(e){return t.state.isSimulationActive&&(t.state.simulationPaused||t.state.simulationStopped)||t.state.isGameActive&&(t.state.gamePaused||t.state.gameStopped)?{currentTime:e.currentTime}:{currentTime:(new Date).getTime(),startTime:new Date(e.startTime.getTime()+1e3)}}))}},{key:"handleBlur",value:function(){this.state.isGameActive&&!this.state.gamePaused&&this.toggleDialog()}},{key:"handleRefocus",value:function(){this.state.isGameActive&&this.state.gamePaused&&this.toggleDialog()}},{key:"handleResize",value:function(t){this.canvasWidth=window.innerWidth<this.canvasWidth?this.canvasWidth:window.innerWidth,this.canvasHeight=window.innerHeight<this.canvasHeight?this.canvasHeight:window.innerHeight}},{key:"onMouseMove",value:function(t){if(this.state.quarantineButtonsActive){var e=t.pageX,a=t.pageY;this.setState((function(t){return{draggedQuarantine:Object(l.a)({},t.draggedQuarantine,{},{x:e,y:a})}}))}}},{key:"shuffle",value:function(t){for(var e,a,i=t.length;0!==i;)a=Math.floor(Math.random()*i),e=t[i-=1],t[i]=t[a],t[a]=e;return t}},{key:"stopStartSimulation",value:function(){this.state.simulationPaused&&!this.state.simulationStopped?this.toggleSimulationDialog():(this.stop(),this.startSimulation(!0),this.setState((function(t){return{startTime:new Date(0),simulationStopped:!1,simulationPaused:!1,startButtonText:"CONTINUE SIMULATION",simulationSettingsOpen:!1,healthy:t.simulationSettings.quantity-1,contagious:1}})))}},{key:"simulationRestart",value:function(){this.stop(),this.startSimulation(!0),this.setState((function(t){return{startTime:new Date(0),simulationStopped:!1,simulationPaused:!1,startButtonText:"CONTINUE SIMULATION",simulationSettingsOpen:!1,healthy:t.simulationSettings.quantity-1,contagious:1}}))}},{key:"setSimulationSettings",value:function(t){var e,a,i=this;t.currentTarget?(e=t.currentTarget.getAttribute("data-option"),a=JSON.parse(e)||{}):a=t,this.setState((function(t){var e=Object(l.a)({},t.simulationSettings,{},a);return a.size||a.quantity||a.speed?(i.stop(),i.startSimulation(!1,e),{simulationSettings:e,startTime:new Date(0),healthy:e.quantity-1,contagious:1,simulationStopped:!0,simulationPaused:!0,startButtonText:"START SIMULATION"}):{simulationSettings:e}}))}},{key:"stopStartGame",value:function(){if(this.state.gamePaused&&!this.state.gameStopped)this.toggleGameDialog();else{this.stop();var t=this.shuffle(this.state.availableQuarantines);this.setState((function(e){return{startTime:new Date(0),gameStopped:!1,gamePaused:!1,startButtonText:"CONTINUE GAME",gameSettingsOpen:!1,healthy:e.gameSettings.quantity-1,contagious:1,quarantineButtonsActive:!0,quarantineDropped:!0,availableQuarantines:t}})),this.startGame(!0)}}},{key:"gameRestart",value:function(){this.stop(),this.startGame(!0),this.setState((function(t){return{startTime:new Date(0),gameStopped:!1,gamePaused:!1,startButtonText:"CONTINUE SIMULATION",gameSettingsOpen:!1,healthy:t.gameSettings.quantity-1,contagious:1}}))}},{key:"setGameSettings",value:function(t){var e,a,i=this;t.currentTarget?(e=t.currentTarget.getAttribute("data-option"),a=JSON.parse(e)||{}):a=t,this.setState((function(t){var e=Object(l.a)({},t.gameSettings,{},a);return i.stop(),i.startGame(!1,e),{gameSettings:e,healthy:e.quantity-1,contagious:1,gameStopped:!0,gamePaused:!0,startButtonText:"START GAME"}}))}},{key:"setQuarantineInMotion",value:function(t){var e=this,a=t.pageX,i=t.pageY,n=this.state.gameSettings.quantity+this.state.availableQuarantines[this.state.activeQuarantines.length];this.setState((function(t){return{draggedQuarantine:Object(l.a)({},t.draggedQuarantine,{},{id:n,x:a,y:i}),quarantineButtonsActive:!0,quarantineDropped:!1,activeQuarantines:t.activeQuarantines.length===e.state.availableQuarantines.length?[]:t.activeQuarantines.concat(n)}}))}},{key:"toggleSimulationPause",value:function(){return this.state.simulationPaused&&!this.state.simulationStopped?this.unpause():this.pause()}},{key:"toggleGamePause",value:function(){return this.state.gamePaused&&!this.state.gameStopped?this.unpause():this.pause()}},{key:"toggleDialog",value:function(t){t&&t.currentTarget;this.state.isSimulationActive?this.toggleSimulationDialog():this.state.quarantineButtonsActive&&!this.state.quarantineDropped?this.setState({quarantineButtonsActive:!1,quarantineDropped:!0}):this.toggleGameDialog()}},{key:"toggleShareDialog",value:function(t){var e=this;this.state.isSimulationActive?(this.toggleSimulationPause(),this.setState((function(t){return{simulationPaused:!t.simulationPaused,shareModalOpen:!t.shareModalOpen}}))):(this.toggleGamePause(),this.setState((function(t){return{gamePaused:!t.gamePaused,shareModalOpen:!t.shareModalOpen}}))),setTimeout((function(){e.setState({isCopied:!1})}),1e3)}},{key:"toggleSimulationDialog",value:function(){this.state.isGameActive?(this.stop(),this.setState((function(t){return{simulationSettingsOpen:!0,simulationPaused:!0,startButtonText:"START SIMULATION",isSimulationActive:!0,isGameActive:!1,gamePaused:!0,gameStopped:!0}}))):(this.toggleSimulationPause(),this.setState((function(t){return{simulationSettingsOpen:!t.simulationSettingsOpen,simulationPaused:!t.simulationPaused,startButtonText:t.simulationStopped?"START SIMULATION":"CONTINUE SIMULATION",isSimulationActive:!0,isGameActive:!1,gamePaused:!0,gameStopped:!0}})))}},{key:"toggleGameDialog",value:function(){this.state.isSimulationActive?(this.stop(),this.setState((function(t){return{gameSettingsOpen:!0,gamePaused:!0,startButtonText:"START GAME",isSimulationActive:!1,isGameActive:!0,simulationPaused:!0,simulationStopped:!0}}))):(this.toggleGamePause(),this.setState((function(t){return{gameSettingsOpen:!t.gameSettingsOpen,gamePaused:!t.gamePaused,startButtonText:t.gameStopped?"START GAME":"CONTINUE GAME",isSimulationActive:!1,isGameActive:!0,simulationPaused:!0,simulationStopped:!0}})))}},{key:"toggleNavbarItemsExpand",value:function(){this.setState((function(t){return{isNavbarExpanded:!t.isNavbarExpanded}}))}},{key:"toggleNavbarVisibility",value:function(){this.setState((function(t){return{isNavbarVisible:!t.isNavbarVisible}}))}},{key:"copyToClipboard",value:function(){var t=this;navigator.permissions.query({name:"clipboard-write"}).then((function(e){"granted"!==e.state&&"prompt"!==e.state||(navigator.clipboard.writeText("https://www.covidsimulator.com"),t.setState({isCopied:!0}))}))}},{key:"render",value:function(){return n.a.createElement("section",{className:"main"},n.a.createElement(tt,{currentTime:this.state.currentTime,startTime:this.state.startTime,toggleNavbarItemsExpand:this.toggleNavbarItemsExpand,toggleNavbarVisibility:this.toggleNavbarVisibility,isNavbarExpanded:this.state.isNavbarExpanded,isNavbarVisible:this.state.isNavbarVisible,toggleSimulationDialog:this.toggleSimulationDialog,toggleShareDialog:this.toggleShareDialog,toggleGameDialog:this.toggleGameDialog,simulationSettings:this.state.simulationSettings,gameSettings:this.state.gameSettings,isSimulationActive:this.state.isSimulationActive,contagious:this.state.contagious,healthy:this.state.healthy}),n.a.createElement(J,{startSimulation:this.stopStartSimulation,isSimulationActive:this.state.isSimulationActive,isOpen:this.state.simulationSettingsOpen,toggle:this.toggleSimulationDialog,buttonText:this.state.startButtonText,settings:this.state.simulationSettings,setSimulationSettings:this.setSimulationSettings}),n.a.createElement(ct,{startGame:this.stopStartGame,isOpen:this.state.gameSettingsOpen,isGameActive:this.state.isGameActive,toggle:this.toggleGameDialog,buttonText:this.state.startButtonText,settings:this.state.gameSettings,setGameSettings:this.setGameSettings}),n.a.createElement(et,{isOpen:this.state.shareModalOpen,toggle:this.toggleShareDialog,copy:this.copyToClipboard,isCopied:this.state.isCopied}),n.a.createElement(ut,{quarantineButtonsActive:this.state.quarantineButtonsActive,setQuarantineInMotion:this.setQuarantineInMotion}),n.a.createElement("article",{id:"canvas-container",onClick:this.toggleDialog,onMouseMove:this.onMouseMove}))}}],[{key:"getDerivedStateFromError",value:function(t){return{hasError:!0}}}]),a}(n.a.Component));a(64);var dt=function(){return n.a.createElement("div",{className:"App"},n.a.createElement(mt,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(dt,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[32,1,2]]]);
//# sourceMappingURL=main.b042908b.chunk.js.map
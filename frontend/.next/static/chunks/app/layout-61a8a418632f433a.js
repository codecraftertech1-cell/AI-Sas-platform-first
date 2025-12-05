(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{7809:function(e,t,o){Promise.resolve().then(o.bind(o,8810)),Promise.resolve().then(o.t.bind(o,3445,23)),Promise.resolve().then(o.t.bind(o,2445,23)),Promise.resolve().then(o.bind(o,5925))},826:function(e,t,o){"use strict";o.d(t,{BG:function(){return m},JY:function(){return u},Nq:function(){return y},XF:function(){return f},Yv:function(){return c},_v:function(){return b},cF:function(){return d},d9:function(){return h},h7:function(){return p},iJ:function(){return n},rp:function(){return g},tG:function(){return l},xU:function(){return i}});var a=o(4829);let r=o(2601).env.NEXT_PUBLIC_API_URL||"http://localhost:5000/api",s=a.Z.create({baseURL:r,headers:{"Content-Type":"application/json"}});s.interceptors.request.use(e=>{let t=localStorage.getItem("token");return t&&(e.headers.Authorization="Bearer ".concat(t)),e}),s.interceptors.response.use(e=>e,e=>{var t;return(null===(t=e.response)||void 0===t?void 0:t.status)===401&&(localStorage.removeItem("token"),window.location.href="/login"),Promise.reject(e)});let n={register:e=>s.post("/auth/register",e),login:e=>s.post("/auth/login",e),getMe:()=>s.get("/auth/me")},i={getAll:()=>s.get("/chat"),getOne:e=>s.get("/chat/".concat(e)),create:e=>s.post("/chat",e),sendMessage:(e,t,o,a)=>s.post("/chat/".concat(e,"/message"),{message:t,fileData:o,fileUrl:a}),updateTitle:(e,t)=>s.patch("/chat/".concat(e,"/title"),{title:t}),share:e=>s.post("/chat/".concat(e,"/share")),delete:e=>s.delete("/chat/".concat(e))},l={getAll:()=>s.get("/documents"),getOne:e=>s.get("/documents/".concat(e)),upload:e=>{let t=new FormData;return t.append("file",e),s.post("/documents/upload",t,{headers:{"Content-Type":"multipart/form-data"}})},chat:(e,t)=>s.post("/documents/".concat(e,"/chat"),{message:t}),export:(e,t)=>s.post("/documents/".concat(e,"/export"),{format:t}),delete:e=>s.delete("/documents/".concat(e))},c={getAll:()=>s.get("/presentations"),getOne:e=>s.get("/presentations/".concat(e)),create:e=>s.post("/presentations",e),update:(e,t)=>s.patch("/presentations/".concat(e),t),export:(e,t)=>s.post("/presentations/".concat(e,"/export"),{format:t}),delete:e=>s.delete("/presentations/".concat(e))},d={getAll:()=>s.get("/websites"),getOne:e=>s.get("/websites/".concat(e)),generate:e=>s.post("/websites/generate",e),generateCode:e=>s.post("/websites/generate-code",e),preview:e=>s.get("/websites/preview/".concat(e)),export:e=>s.get("/websites/export/".concat(e)),update:(e,t)=>s.patch("/websites/".concat(e),t),download:e=>s.get("/websites/".concat(e,"/download")),delete:e=>s.delete("/websites/".concat(e))},u={getAll:()=>s.get("/mobile-apps"),getOne:e=>s.get("/mobile-apps/".concat(e)),generate:e=>s.post("/mobile-apps/generate",e),update:(e,t)=>s.patch("/mobile-apps/".concat(e),t),download:e=>s.get("/mobile-apps/".concat(e,"/download")),share:e=>s.post("/mobile-apps/".concat(e,"/share")),delete:e=>s.delete("/mobile-apps/".concat(e))},p={getCurrent:()=>s.get("/subscriptions"),checkout:e=>s.post("/subscriptions/checkout",{plan:e}),getInvoices:()=>s.get("/subscriptions/invoices")},m={getProfile:()=>s.get("/user/profile"),updateProfile:e=>s.patch("/user/profile",e),getUsage:e=>s.get("/user/usage",{params:e}),getDashboard:()=>s.get("/user/dashboard")},f={upload:e=>{let t=new FormData;return t.append("file",e),s.post("/media/upload",t,{headers:{"Content-Type":"multipart/form-data"}})},chat:(e,t)=>s.post("/media/".concat(e,"/chat"),{message:t})},g={login:()=>s.post("/linkedin/login"),oauthCallback:e=>s.get("/linkedin/oauth/callback?code=".concat(e)),generatePost:e=>s.post("/linkedin/generate-post",e),schedule:e=>s.post("/linkedin/schedule",e),autoMessage:e=>s.post("/linkedin/auto-message",e),autoComment:e=>s.post("/linkedin/auto-comment",e)},h={generate:e=>s.post("/social-media/generate",e),schedule:e=>s.post("/social-media/schedule",e),getScheduled:()=>s.get("/social-media/scheduled")},b={connect:e=>s.post("/email/connect",e),generateReply:e=>s.post("/email/generate-reply",e),getSuggestions:e=>s.post("/email/suggestions",e),getInbox:()=>s.get("/email/inbox")},y={getUsers:e=>s.get("/admin/users",{params:e}),getUser:e=>s.get("/admin/users/".concat(e)),updateUser:(e,t)=>s.patch("/admin/users/".concat(e),t),deleteUser:e=>s.delete("/admin/users/".concat(e)),getAnalytics:e=>s.get("/admin/analytics",{params:e}),getUsageLogs:e=>s.get("/admin/usage-logs",{params:e})}},8810:function(e,t,o){"use strict";o.r(t),o.d(t,{AuthProvider:function(){return i},useAuth:function(){return l}});var a=o(7437),r=o(2265),s=o(826);let n=(0,r.createContext)(void 0);function i(e){let{children:t}=e,[o,i]=(0,r.useState)(null),[l,c]=(0,r.useState)(null),[d,u]=(0,r.useState)(!0);(0,r.useEffect)(()=>{let e=localStorage.getItem("token");e?(c(e),p()):u(!1)},[]);let p=async()=>{try{let e=await s.iJ.getMe();i(e.data.user)}catch(e){localStorage.removeItem("token"),c(null)}finally{u(!1)}},m=async(e,t)=>{let{user:o,token:a}=(await s.iJ.login({email:e,password:t})).data;localStorage.setItem("token",a),c(a),i(o)},f=async(e,t,o)=>{let{user:a,token:r}=(await s.iJ.register({email:e,password:t,name:o})).data;localStorage.setItem("token",r),c(r),i(a)};return(0,a.jsx)(n.Provider,{value:{user:o,token:l,login:m,register:f,logout:()=>{localStorage.removeItem("token"),c(null),i(null)},loading:d},children:t})}function l(){let e=(0,r.useContext)(n);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},2445:function(){},3445:function(e){e.exports={style:{fontFamily:"'__Inter_f367f3', '__Inter_Fallback_f367f3'",fontStyle:"normal"},className:"__className_f367f3"}},5925:function(e,t,o){"use strict";let a,r;o.r(t),o.d(t,{CheckmarkIcon:function(){return K},ErrorIcon:function(){return Y},LoaderIcon:function(){return X},ToastBar:function(){return el},ToastIcon:function(){return eo},Toaster:function(){return ep},default:function(){return em},resolveValue:function(){return C},toast:function(){return M},useToaster:function(){return B},useToasterStore:function(){return z}});var s,n=o(2265);let i={data:""},l=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i},c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,p=(e,t)=>{let o="",a="",r="";for(let s in e){let n=e[s];"@"==s[0]?"i"==s[1]?o=s+" "+n+";":a+="f"==s[1]?p(n,s):s+"{"+p(n,"k"==s[1]?"":t)+"}":"object"==typeof n?a+=p(n,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=n&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=p.p?p.p(s,n):s+":"+n+";")}return o+(t&&r?t+"{"+r+"}":r)+a},m={},f=e=>{if("object"==typeof e){let t="";for(let o in e)t+=o+f(e[o]);return t}return e},g=(e,t,o,a,r)=>{var s;let n=f(e),i=m[n]||(m[n]=(e=>{let t=0,o=11;for(;t<e.length;)o=101*o+e.charCodeAt(t++)>>>0;return"go"+o})(n));if(!m[i]){let t=n!==e?e:(e=>{let t,o,a=[{}];for(;t=c.exec(e.replace(d,""));)t[4]?a.shift():t[3]?(o=t[3].replace(u," ").trim(),a.unshift(a[0][o]=a[0][o]||{})):a[0][t[1]]=t[2].replace(u," ").trim();return a[0]})(e);m[i]=p(r?{["@keyframes "+i]:t}:t,o?"":"."+i)}let l=o&&m.g?m.g:null;return o&&(m.g=m[i]),s=m[i],l?t.data=t.data.replace(l,s):-1===t.data.indexOf(s)&&(t.data=a?s+t.data:t.data+s),i},h=(e,t,o)=>e.reduce((e,a,r)=>{let s=t[r];if(s&&s.call){let e=s(o),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+a+(null==s?"":s)},"");function b(e){let t=this||{},o=e.call?e(t.p):e;return g(o.unshift?o.raw?h(o,[].slice.call(arguments,1),t.p):o.reduce((e,o)=>Object.assign(e,o&&o.call?o(t.p):o),{}):o,l(t.target),t.g,t.o,t.k)}b.bind({g:1});let y,v,x,w=b.bind({k:1});function k(e,t){let o=this||{};return function(){let a=arguments;function r(s,n){let i=Object.assign({},s),l=i.className||r.className;o.p=Object.assign({theme:v&&v()},i),o.o=/ *go\d+/.test(l),i.className=b.apply(o,a)+(l?" "+l:""),t&&(i.ref=n);let c=e;return e[0]&&(c=i.as||e,delete i.as),x&&c[0]&&x(i),y(c,i)}return t?t(r):r}}var E=e=>"function"==typeof e,C=(e,t)=>E(e)?e(t):e,I=(a=0,()=>(++a).toString()),_=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},A="default",O=(e,t)=>{let{toastLimit:o}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,o)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return O(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},P=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},S={},$=(e,t=A)=>{S[t]=O(S[t]||N,e),P.forEach(([e,o])=>{e===t&&o(S[t])})},j=e=>Object.keys(S).forEach(t=>$(e,t)),D=e=>Object.keys(S).find(t=>S[t].toasts.some(t=>t.id===e)),T=(e=A)=>t=>{$(t,e)},U={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},z=(e={},t=A)=>{let[o,a]=(0,n.useState)(S[t]||N),r=(0,n.useRef)(S[t]);(0,n.useEffect)(()=>(r.current!==S[t]&&a(S[t]),P.push([t,a]),()=>{let e=P.findIndex(([e])=>e===t);e>-1&&P.splice(e,1)}),[t]);let s=o.toasts.map(t=>{var o,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(o=e[t.type])?void 0:o.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||U[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...o,toasts:s}},F=(e,t="blank",o)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...o,id:(null==o?void 0:o.id)||I()}),L=e=>(t,o)=>{let a=F(t,e,o);return T(a.toasterId||D(a.id))({type:2,toast:a}),a.id},M=(e,t)=>L("blank")(e,t);M.error=L("error"),M.success=L("success"),M.loading=L("loading"),M.custom=L("custom"),M.dismiss=(e,t)=>{let o={type:3,toastId:e};t?T(t)(o):j(o)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let o={type:4,toastId:e};t?T(t)(o):j(o)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,o)=>{let a=M.loading(t.loading,{...o,...null==o?void 0:o.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?C(t.success,e):void 0;return r?M.success(r,{id:a,...o,...null==o?void 0:o.success}):M.dismiss(a),e}).catch(e=>{let r=t.error?C(t.error,e):void 0;r?M.error(r,{id:a,...o,...null==o?void 0:o.error}):M.dismiss(a)}),e};var R=1e3,B=(e,t="default")=>{let{toasts:o,pausedAt:a}=z(e,t),r=(0,n.useRef)(new Map).current,s=(0,n.useCallback)((e,t=R)=>{if(r.has(e))return;let o=setTimeout(()=>{r.delete(e),i({type:4,toastId:e})},t);r.set(e,o)},[]);(0,n.useEffect)(()=>{if(a)return;let e=Date.now(),r=o.map(o=>{if(o.duration===1/0)return;let a=(o.duration||0)+o.pauseDuration-(e-o.createdAt);if(a<0){o.visible&&M.dismiss(o.id);return}return setTimeout(()=>M.dismiss(o.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[o,a,t]);let i=(0,n.useCallback)(T(t),[t]),l=(0,n.useCallback)(()=>{i({type:5,time:Date.now()})},[i]),c=(0,n.useCallback)((e,t)=>{i({type:1,toast:{id:e,height:t}})},[i]),d=(0,n.useCallback)(()=>{a&&i({type:6,time:Date.now()})},[a,i]),u=(0,n.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:s}=t||{},n=o.filter(t=>(t.position||s)===(e.position||s)&&t.height),i=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<i&&e.visible).length;return n.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[o]);return(0,n.useEffect)(()=>{o.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[o,s]),{toasts:o,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}},H=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,J=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Y=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${H} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${J} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${q} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,G=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,X=k("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${G} 1s linear infinite;
`,Z=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,V=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,K=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${V} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Q=k("div")`
  position: absolute;
`,W=k("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ee=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,et=k("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ee} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,eo=({toast:e})=>{let{icon:t,type:o,iconTheme:a}=e;return void 0!==t?"string"==typeof t?n.createElement(et,null,t):t:"blank"===o?null:n.createElement(W,null,n.createElement(X,{...a}),"loading"!==o&&n.createElement(Q,null,"error"===o?n.createElement(Y,{...a}):n.createElement(K,{...a})))},ea=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,er=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,es=k("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,en=k("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ei=(e,t)=>{let o=e.includes("top")?1:-1,[a,r]=_()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ea(o),er(o)];return{animation:t?`${w(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},el=n.memo(({toast:e,position:t,style:o,children:a})=>{let r=e.height?ei(e.position||t||"top-center",e.visible):{opacity:0},s=n.createElement(eo,{toast:e}),i=n.createElement(en,{...e.ariaProps},C(e.message,e));return n.createElement(es,{className:e.className,style:{...r,...o,...e.style}},"function"==typeof a?a({icon:s,message:i}):n.createElement(n.Fragment,null,s,i))});s=n.createElement,p.p=void 0,y=s,v=void 0,x=void 0;var ec=({id:e,className:t,style:o,onHeightUpdate:a,children:r})=>{let s=n.useCallback(t=>{if(t){let o=()=>{a(e,t.getBoundingClientRect().height)};o(),new MutationObserver(o).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return n.createElement("div",{ref:s,className:t,style:o},r)},ed=(e,t)=>{let o=e.includes("top"),a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:_()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...a}},eu=b`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ep=({reverseOrder:e,position:t="top-center",toastOptions:o,gutter:a,children:r,toasterId:s,containerStyle:i,containerClassName:l})=>{let{toasts:c,handlers:d}=B(o,s);return n.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(o=>{let s=o.position||t,i=ed(s,d.calculateOffset(o,{reverseOrder:e,gutter:a,defaultPosition:t}));return n.createElement(ec,{id:o.id,key:o.id,onHeightUpdate:d.updateHeight,className:o.visible?eu:"",style:i},"custom"===o.type?C(o.message,o):r?r(o):n.createElement(el,{toast:o,position:s}))}))},em=M}},function(e){e.O(0,[737,971,458,744],function(){return e(e.s=7809)}),_N_E=e.O()}]);
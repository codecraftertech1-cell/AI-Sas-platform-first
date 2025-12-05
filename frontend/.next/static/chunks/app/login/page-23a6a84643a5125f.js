(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[626],{6733:function(e,t,a){Promise.resolve().then(a.bind(a,8623))},8623:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return d}});var o=a(7437),r=a(2265),s=a(4033),n=a(1396),i=a.n(n),l=a(8810),c=a(5925);function d(){let[e,t]=(0,r.useState)(""),[a,n]=(0,r.useState)(""),[d,u]=(0,r.useState)(!1),{login:p,user:m,loading:g}=(0,l.useAuth)(),f=(0,s.useRouter)();(0,r.useEffect)(()=>{!g&&m&&f.push("/dashboard")},[m,g,f]);let h=async t=>{t.preventDefault(),u(!0);try{await p(e,a),c.default.success("Logged in successfully!"),window.location.href="/dashboard"}catch(e){var o,r;c.default.error((null===(r=e.response)||void 0===r?void 0:null===(o=r.data)||void 0===o?void 0:o.error)||"Login failed"),u(!1)}};return(0,o.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4",children:(0,o.jsxs)("div",{className:"max-w-md w-full bg-white rounded-2xl shadow-xl p-8",children:[(0,o.jsxs)("div",{className:"text-center mb-8",children:[(0,o.jsx)("h1",{className:"text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2",children:"Welcome Back"}),(0,o.jsx)("p",{className:"text-gray-600",children:"Sign in to your account"})]}),(0,o.jsxs)("form",{onSubmit:h,className:"space-y-6",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700 mb-2",children:"Email"}),(0,o.jsx)("input",{id:"email",type:"email",value:e,onChange:e=>t(e.target.value),required:!0,className:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition",placeholder:"you@example.com"})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700 mb-2",children:"Password"}),(0,o.jsx)("input",{id:"password",type:"password",value:a,onChange:e=>n(e.target.value),required:!0,className:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition",placeholder:"••••••••"})]}),(0,o.jsx)("button",{type:"submit",disabled:d,className:"w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed",children:d?"Signing in...":"Sign In"})]}),(0,o.jsx)("div",{className:"mt-6 text-center",children:(0,o.jsxs)("p",{className:"text-gray-600",children:["Don't have an account?"," ",(0,o.jsx)(i(),{href:"/register",className:"text-red-500 hover:text-red-600 font-semibold",children:"Sign up"})]})})]})})}},826:function(e,t,a){"use strict";a.d(t,{BG:function(){return m},JY:function(){return u},Nq:function(){return y},XF:function(){return g},Yv:function(){return c},_v:function(){return b},cF:function(){return d},d9:function(){return h},h7:function(){return p},iJ:function(){return n},rp:function(){return f},tG:function(){return l},xU:function(){return i}});var o=a(4829);let r=a(2601).env.NEXT_PUBLIC_API_URL||"http://localhost:5000/api",s=o.Z.create({baseURL:r,headers:{"Content-Type":"application/json"}});s.interceptors.request.use(e=>{let t=localStorage.getItem("token");return t&&(e.headers.Authorization="Bearer ".concat(t)),e}),s.interceptors.response.use(e=>e,e=>{var t;return(null===(t=e.response)||void 0===t?void 0:t.status)===401&&(localStorage.removeItem("token"),window.location.href="/login"),Promise.reject(e)});let n={register:e=>s.post("/auth/register",e),login:e=>s.post("/auth/login",e),getMe:()=>s.get("/auth/me")},i={getAll:()=>s.get("/chat"),getOne:e=>s.get("/chat/".concat(e)),create:e=>s.post("/chat",e),sendMessage:(e,t,a,o)=>s.post("/chat/".concat(e,"/message"),{message:t,fileData:a,fileUrl:o}),updateTitle:(e,t)=>s.patch("/chat/".concat(e,"/title"),{title:t}),share:e=>s.post("/chat/".concat(e,"/share")),delete:e=>s.delete("/chat/".concat(e))},l={getAll:()=>s.get("/documents"),getOne:e=>s.get("/documents/".concat(e)),upload:e=>{let t=new FormData;return t.append("file",e),s.post("/documents/upload",t,{headers:{"Content-Type":"multipart/form-data"}})},chat:(e,t)=>s.post("/documents/".concat(e,"/chat"),{message:t}),export:(e,t)=>s.post("/documents/".concat(e,"/export"),{format:t}),delete:e=>s.delete("/documents/".concat(e))},c={getAll:()=>s.get("/presentations"),getOne:e=>s.get("/presentations/".concat(e)),create:e=>s.post("/presentations",e),update:(e,t)=>s.patch("/presentations/".concat(e),t),export:(e,t)=>s.post("/presentations/".concat(e,"/export"),{format:t}),delete:e=>s.delete("/presentations/".concat(e))},d={getAll:()=>s.get("/websites"),getOne:e=>s.get("/websites/".concat(e)),generate:e=>s.post("/websites/generate",e),generateCode:e=>s.post("/websites/generate-code",e),preview:e=>s.get("/websites/preview/".concat(e)),export:e=>s.get("/websites/export/".concat(e)),update:(e,t)=>s.patch("/websites/".concat(e),t),download:e=>s.get("/websites/".concat(e,"/download")),delete:e=>s.delete("/websites/".concat(e))},u={getAll:()=>s.get("/mobile-apps"),getOne:e=>s.get("/mobile-apps/".concat(e)),generate:e=>s.post("/mobile-apps/generate",e),update:(e,t)=>s.patch("/mobile-apps/".concat(e),t),download:e=>s.get("/mobile-apps/".concat(e,"/download")),share:e=>s.post("/mobile-apps/".concat(e,"/share")),delete:e=>s.delete("/mobile-apps/".concat(e))},p={getCurrent:()=>s.get("/subscriptions"),checkout:e=>s.post("/subscriptions/checkout",{plan:e}),getInvoices:()=>s.get("/subscriptions/invoices")},m={getProfile:()=>s.get("/user/profile"),updateProfile:e=>s.patch("/user/profile",e),getUsage:e=>s.get("/user/usage",{params:e}),getDashboard:()=>s.get("/user/dashboard")},g={upload:e=>{let t=new FormData;return t.append("file",e),s.post("/media/upload",t,{headers:{"Content-Type":"multipart/form-data"}})},chat:(e,t)=>s.post("/media/".concat(e,"/chat"),{message:t})},f={login:()=>s.post("/linkedin/login"),oauthCallback:e=>s.get("/linkedin/oauth/callback?code=".concat(e)),generatePost:e=>s.post("/linkedin/generate-post",e),schedule:e=>s.post("/linkedin/schedule",e),autoMessage:e=>s.post("/linkedin/auto-message",e),autoComment:e=>s.post("/linkedin/auto-comment",e)},h={generate:e=>s.post("/social-media/generate",e),schedule:e=>s.post("/social-media/schedule",e),getScheduled:()=>s.get("/social-media/scheduled")},b={connect:e=>s.post("/email/connect",e),generateReply:e=>s.post("/email/generate-reply",e),getSuggestions:e=>s.post("/email/suggestions",e),getInbox:()=>s.get("/email/inbox")},y={getUsers:e=>s.get("/admin/users",{params:e}),getUser:e=>s.get("/admin/users/".concat(e)),updateUser:(e,t)=>s.patch("/admin/users/".concat(e),t),deleteUser:e=>s.delete("/admin/users/".concat(e)),getAnalytics:e=>s.get("/admin/analytics",{params:e}),getUsageLogs:e=>s.get("/admin/usage-logs",{params:e})}},8810:function(e,t,a){"use strict";a.r(t),a.d(t,{AuthProvider:function(){return i},useAuth:function(){return l}});var o=a(7437),r=a(2265),s=a(826);let n=(0,r.createContext)(void 0);function i(e){let{children:t}=e,[a,i]=(0,r.useState)(null),[l,c]=(0,r.useState)(null),[d,u]=(0,r.useState)(!0);(0,r.useEffect)(()=>{let e=localStorage.getItem("token");e?(c(e),p()):u(!1)},[]);let p=async()=>{try{let e=await s.iJ.getMe();i(e.data.user)}catch(e){localStorage.removeItem("token"),c(null)}finally{u(!1)}},m=async(e,t)=>{let{user:a,token:o}=(await s.iJ.login({email:e,password:t})).data;localStorage.setItem("token",o),c(o),i(a)},g=async(e,t,a)=>{let{user:o,token:r}=(await s.iJ.register({email:e,password:t,name:a})).data;localStorage.setItem("token",r),c(r),i(o)};return(0,o.jsx)(n.Provider,{value:{user:a,token:l,login:m,register:g,logout:()=>{localStorage.removeItem("token"),c(null),i(null)},loading:d},children:t})}function l(){let e=(0,r.useContext)(n);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},1396:function(e,t,a){e.exports=a(5250)},4033:function(e,t,a){e.exports=a(5313)},5925:function(e,t,a){"use strict";let o,r;a.r(t),a.d(t,{CheckmarkIcon:function(){return W},ErrorIcon:function(){return Y},LoaderIcon:function(){return X},ToastBar:function(){return el},ToastIcon:function(){return ea},Toaster:function(){return ep},default:function(){return em},resolveValue:function(){return E},toast:function(){return M},useToaster:function(){return B},useToasterStore:function(){return U}});var s,n=a(2265);let i={data:""},l=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i},c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,p=(e,t)=>{let a="",o="",r="";for(let s in e){let n=e[s];"@"==s[0]?"i"==s[1]?a=s+" "+n+";":o+="f"==s[1]?p(n,s):s+"{"+p(n,"k"==s[1]?"":t)+"}":"object"==typeof n?o+=p(n,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=n&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=p.p?p.p(s,n):s+":"+n+";")}return a+(t&&r?t+"{"+r+"}":r)+o},m={},g=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+g(e[a]);return t}return e},f=(e,t,a,o,r)=>{var s;let n=g(e),i=m[n]||(m[n]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(n));if(!m[i]){let t=n!==e?e:(e=>{let t,a,o=[{}];for(;t=c.exec(e.replace(d,""));)t[4]?o.shift():t[3]?(a=t[3].replace(u," ").trim(),o.unshift(o[0][a]=o[0][a]||{})):o[0][t[1]]=t[2].replace(u," ").trim();return o[0]})(e);m[i]=p(r?{["@keyframes "+i]:t}:t,a?"":"."+i)}let l=a&&m.g?m.g:null;return a&&(m.g=m[i]),s=m[i],l?t.data=t.data.replace(l,s):-1===t.data.indexOf(s)&&(t.data=o?s+t.data:t.data+s),i},h=(e,t,a)=>e.reduce((e,o,r)=>{let s=t[r];if(s&&s.call){let e=s(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+o+(null==s?"":s)},"");function b(e){let t=this||{},a=e.call?e(t.p):e;return f(a.unshift?a.raw?h(a,[].slice.call(arguments,1),t.p):a.reduce((e,a)=>Object.assign(e,a&&a.call?a(t.p):a),{}):a,l(t.target),t.g,t.o,t.k)}b.bind({g:1});let y,v,x,w=b.bind({k:1});function k(e,t){let a=this||{};return function(){let o=arguments;function r(s,n){let i=Object.assign({},s),l=i.className||r.className;a.p=Object.assign({theme:v&&v()},i),a.o=/ *go\d+/.test(l),i.className=b.apply(a,o)+(l?" "+l:""),t&&(i.ref=n);let c=e;return e[0]&&(c=i.as||e,delete i.as),x&&c[0]&&x(i),y(c,i)}return t?t(r):r}}var j=e=>"function"==typeof e,E=(e,t)=>j(e)?e(t):e,N=(o=0,()=>(++o).toString()),C=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},I="default",S=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:o}=t;return S(e,{type:e.toasts.find(e=>e.id===o.id)?1:0,toast:o});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},A=[],O={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},D={},P=(e,t=I)=>{D[t]=S(D[t]||O,e),A.forEach(([e,a])=>{e===t&&a(D[t])})},$=e=>Object.keys(D).forEach(t=>P(e,t)),_=e=>Object.keys(D).find(t=>D[t].toasts.some(t=>t.id===e)),T=(e=I)=>t=>{P(t,e)},L={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},U=(e={},t=I)=>{let[a,o]=(0,n.useState)(D[t]||O),r=(0,n.useRef)(D[t]);(0,n.useEffect)(()=>(r.current!==D[t]&&o(D[t]),A.push([t,o]),()=>{let e=A.findIndex(([e])=>e===t);e>-1&&A.splice(e,1)}),[t]);let s=a.toasts.map(t=>{var a,o,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(o=e[t.type])?void 0:o.duration)||(null==e?void 0:e.duration)||L[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...a,toasts:s}},z=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||N()}),F=e=>(t,a)=>{let o=z(t,e,a);return T(o.toasterId||_(o.id))({type:2,toast:o}),o.id},M=(e,t)=>F("blank")(e,t);M.error=F("error"),M.success=F("success"),M.loading=F("loading"),M.custom=F("custom"),M.dismiss=(e,t)=>{let a={type:3,toastId:e};t?T(t)(a):$(a)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let a={type:4,toastId:e};t?T(t)(a):$(a)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,a)=>{let o=M.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?E(t.success,e):void 0;return r?M.success(r,{id:o,...a,...null==a?void 0:a.success}):M.dismiss(o),e}).catch(e=>{let r=t.error?E(t.error,e):void 0;r?M.error(r,{id:o,...a,...null==a?void 0:a.error}):M.dismiss(o)}),e};var R=1e3,B=(e,t="default")=>{let{toasts:a,pausedAt:o}=U(e,t),r=(0,n.useRef)(new Map).current,s=(0,n.useCallback)((e,t=R)=>{if(r.has(e))return;let a=setTimeout(()=>{r.delete(e),i({type:4,toastId:e})},t);r.set(e,a)},[]);(0,n.useEffect)(()=>{if(o)return;let e=Date.now(),r=a.map(a=>{if(a.duration===1/0)return;let o=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(o<0){a.visible&&M.dismiss(a.id);return}return setTimeout(()=>M.dismiss(a.id,t),o)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[a,o,t]);let i=(0,n.useCallback)(T(t),[t]),l=(0,n.useCallback)(()=>{i({type:5,time:Date.now()})},[i]),c=(0,n.useCallback)((e,t)=>{i({type:1,toast:{id:e,height:t}})},[i]),d=(0,n.useCallback)(()=>{o&&i({type:6,time:Date.now()})},[o,i]),u=(0,n.useCallback)((e,t)=>{let{reverseOrder:o=!1,gutter:r=8,defaultPosition:s}=t||{},n=a.filter(t=>(t.position||s)===(e.position||s)&&t.height),i=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<i&&e.visible).length;return n.filter(e=>e.visible).slice(...o?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[a]);return(0,n.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[a,s]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}},q=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,H=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,J=w`
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

  animation: ${q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${H} 0.15s ease-out forwards;
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
    animation: ${J} 0.15s ease-out forwards;
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
}`,W=k("div")`
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
`,K=k("div")`
  position: absolute;
`,Q=k("div")`
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
`,ea=({toast:e})=>{let{icon:t,type:a,iconTheme:o}=e;return void 0!==t?"string"==typeof t?n.createElement(et,null,t):t:"blank"===a?null:n.createElement(Q,null,n.createElement(X,{...o}),"loading"!==a&&n.createElement(K,null,"error"===a?n.createElement(Y,{...o}):n.createElement(W,{...o})))},eo=e=>`
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
`,ei=(e,t)=>{let a=e.includes("top")?1:-1,[o,r]=C()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[eo(a),er(a)];return{animation:t?`${w(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},el=n.memo(({toast:e,position:t,style:a,children:o})=>{let r=e.height?ei(e.position||t||"top-center",e.visible):{opacity:0},s=n.createElement(ea,{toast:e}),i=n.createElement(en,{...e.ariaProps},E(e.message,e));return n.createElement(es,{className:e.className,style:{...r,...a,...e.style}},"function"==typeof o?o({icon:s,message:i}):n.createElement(n.Fragment,null,s,i))});s=n.createElement,p.p=void 0,y=s,v=void 0,x=void 0;var ec=({id:e,className:t,style:a,onHeightUpdate:o,children:r})=>{let s=n.useCallback(t=>{if(t){let a=()=>{o(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return n.createElement("div",{ref:s,className:t,style:a},r)},ed=(e,t)=>{let a=e.includes("top"),o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:C()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...a?{top:0}:{bottom:0},...o}},eu=b`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ep=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:o,children:r,toasterId:s,containerStyle:i,containerClassName:l})=>{let{toasts:c,handlers:d}=B(a,s);return n.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let s=a.position||t,i=ed(s,d.calculateOffset(a,{reverseOrder:e,gutter:o,defaultPosition:t}));return n.createElement(ec,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?eu:"",style:i},"custom"===a.type?E(a.message,a):r?r(a):n.createElement(el,{toast:a,position:s}))}))},em=M}},function(e){e.O(0,[737,250,971,458,744],function(){return e(e.s=6733)}),_N_E=e.O()}]);
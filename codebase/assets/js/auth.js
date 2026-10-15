(function(){
  "use strict";
  const SESSION_KEY="tt-demo-auth";
  const GENERATION_KEY="tt-demo-auth-generation";
  const TOKEN_KEYS=[SESSION_KEY,"tt-demo-access-token","tt-demo-refresh-token","tt-demo-token-expires-at"];
  const VALID_ROLES=["admin","trainer","teacher"];
  let expiryTimer=null;
  function storageRemoveAppTokens(storage){try{const keys=[];for(let i=0;i<storage.length;i++){const key=storage.key(i);if(key&&key!==GENERATION_KEY&&(/^tt-role$/i.test(key)||/^tt[-_]demo[-_].*(?:token|session|auth|role|expiry|expires)/i.test(key)))keys.push(key)}keys.forEach(key=>storage.removeItem(key));TOKEN_KEYS.forEach(key=>storage.removeItem(key))}catch(e){}}
  function expireAll(){if(expiryTimer){clearTimeout(expiryTimer);expiryTimer=null}storageRemoveAppTokens(window.localStorage);storageRemoveAppTokens(window.sessionStorage)}
  function makeToken(prefix){let id="";try{if(window.crypto&&typeof window.crypto.randomUUID==="function")id=window.crypto.randomUUID()}catch(e){}if(!id)id=Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);return "demo."+prefix+"."+id}
  function start(role){if(!VALID_ROLES.includes(role))return false;const now=Date.now(),expiresAt=now+30*60*1000,generation=makeToken("generation");const session={role,generation,accessToken:makeToken("access"),refreshToken:makeToken("refresh"),issuedAt:now,accessExpiresAt:expiresAt,refreshExpiresAt:expiresAt};try{window.localStorage.setItem(GENERATION_KEY,generation);window.sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));window.sessionStorage.setItem("tt-demo-access-token",session.accessToken);window.sessionStorage.setItem("tt-demo-refresh-token",session.refreshToken);window.sessionStorage.setItem("tt-demo-token-expires-at",String(expiresAt))}catch(e){expireAll();return false}return true}
  function get(){try{return JSON.parse(window.sessionStorage.getItem(SESSION_KEY)||"null")}catch(e){return null}}
  function isValid(){const s=get();if(!s||!VALID_ROLES.includes(s.role))return false;const now=Date.now();try{return !!s.accessToken&&!!s.refreshToken&&s.accessExpiresAt>now&&s.refreshExpiresAt>now&&window.sessionStorage.getItem("tt-demo-access-token")==s.accessToken&&window.sessionStorage.getItem("tt-demo-refresh-token")==s.refreshToken&&window.localStorage.getItem(GENERATION_KEY)===s.generation}catch(e){return false}}
  function requireSession(){if(!isValid()){document.documentElement.classList.add("demo-auth-locked");expireAll();window.location.replace("index.html?session=expired");return false}document.documentElement.classList.remove("demo-auth-locked");if(expiryTimer)clearTimeout(expiryTimer);const s=get();expiryTimer=setTimeout(function(){if(!isValid()){expireAll();document.documentElement.classList.add("demo-auth-locked");window.location.replace("index.html?session=expired")}else requireSession()},Math.max(0,s.accessExpiresAt-Date.now()+20));return true}
  function logout(){try{window.localStorage.setItem(GENERATION_KEY,makeToken("revoked"))}catch(e){}expireAll()}
  window.DemoAuth={start,get,isValid,requireSession,expireAll,logout};
  window.addEventListener("storage",function(event){if(event.key===GENERATION_KEY&&!isValid()){expireAll();document.documentElement.classList.add("demo-auth-locked");window.location.replace("index.html?session=logout")}});
})();
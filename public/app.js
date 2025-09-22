//app.js
//enable website launch on localhost on port 5000
const API = location.origin.includes('localhost') ? 'http://localhost:5000' : '';

//token management for user authentication
function setToken(t){ 
  localStorage.setItem('token', t) 

}

function getToken(){ 
  return localStorage.getItem('token') 

}

function clearToken(){ 
  localStorage.removeItem('token') 

}

function toast(msg){
  const el = document.querySelector('.toast');
  if(!el) return alert(msg);
  el.textContent = msg; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 2200);

}

//check to ensure that the token has been generated after login if the token has not been created the user will be redirected back to the login page
async function apiFetch(path, opts={}){
  const headers = Object.assign({'Content-Type':'application/json'}, opts.headers || {});
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if(res.status === 401){
    clearToken();
    window.location.href = 'login.html';
    return;
  }
  if(res.headers.get('content-type')?.includes('application/json')) return res.json();
  return res.text();

}

//ensure the token is present before entering the website
function requireAuth(){
  if(!getToken()){
    window.location.href = 'login.html';

  }
}

//after the user has logged out of the website the token is cleared and the user is redirected back to the login page
function logout(){
  clearToken();
  window.location.href = 'login.html';

}

//fetch all aliases for that user
async function loadAliases(){
  return apiFetch('/api/aliases', { method:'GET' });

}

//returns the number of aliases and grouping them by context
function renderCounts(aliases){
  const counts = {
    total: aliases.length,
    professional: aliases.filter(a=>a.context==='professional').length,
    casual: aliases.filter(a=>a.context==='casual').length,
    anonymous: aliases.filter(a=>a.context==='anonymous').length,
    public: aliases.filter(a=>a.visibility==='public').length,
    private: aliases.filter(a=>a.visibility==='private').length,

  };
  for(const k in counts){
    const el = document.querySelector(`[data-count="${k}"]`);
    if(el) el.textContent = counts[k];

  }
}

function badgeForVisibility(v){
  return v === 'public' ? '<span class="badge badge--pub">Public</span>' : '<span class="badge badge--priv">Private</span>';

}
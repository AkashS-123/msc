import {useState} from 'react';import {Routes,Route,Navigate,useParams,NavLink} from 'react-router-dom';
import {AuthCtx,useAuth,api} from './lib';import * as P from './pages';
const NAV:any={admin:[['dashboard','Dashboard'],['customers','Customers'],['devices','Devices'],['technicians','Technicians'],['service-requests','Service requests'],['job-cards','Job cards'],['inventory','Inventory'],['billing','Billing'],['reports','Reports']],
receptionist:[['dashboard','Dashboard'],['customers','Customers'],['devices','Devices'],['service-requests','Service requests'],['job-cards','Job cards']],
technician:[['dashboard','Dashboard'],['assigned-jobs','Assigned jobs'],['repair-updates','Repair updates'],['parts-used','Parts used']],
customer:[['dashboard','Dashboard'],['devices','My devices'],['service-requests','Requests'],['repair-status','Repair status'],['bills','Bills'],['history','History']]};
const PAGES:any={admin:{dashboard:P.Dashboard,customers:P.Customers,devices:P.Devices,technicians:P.Technicians,'service-requests':P.Requests,'job-cards':P.JobCards,inventory:P.Inventory,billing:P.Billing,reports:P.Reports},
receptionist:{dashboard:P.Dashboard,customers:P.Customers,devices:P.Devices,'service-requests':P.Requests,'job-cards':P.JobCards},
technician:{dashboard:P.Dashboard,'assigned-jobs':()=><P.Jobs mode="list"/>,'repair-updates':()=><P.Jobs mode="update"/>,'parts-used':()=><P.Jobs mode="parts"/>},
customer:{dashboard:P.Dashboard,devices:P.Devices,'service-requests':()=><P.Requests readOnly/>,'repair-status':()=><P.Track mode="status"/>,bills:P.Billing,history:()=><P.Track mode="history"/>}};
function Shell({nav,children}:any){const {user,logout}=useAuth();const [open,setOpen]=useState(false);
const link=({isActive}:any)=>`block px-3 py-2.5 rounded-lg text-sm ${isActive?'bg-tag text-white font-bold':'text-white/75 hover:bg-white/10'}`;
const side=(<><div className="flex items-center gap-2 mb-6"><div className="w-8 h-8 rounded-full border-4 border-tag grid place-items-center"><div className="w-2 h-2 rounded-full bg-white"/></div><span className="font-head font-extrabold text-xl">Bench</span><button aria-label="Close menu" className="md:hidden ml-auto text-xl px-2" onClick={()=>setOpen(false)}>✕</button></div>
<nav className="space-y-1">{nav.map(([p,l]:any)=><NavLink key={p} to={`/${user.role}/${p}`} className={link} onClick={()=>setOpen(false)}>{l}</NavLink>)}</nav>
<div className="mt-6 pt-4 border-t border-white/15 text-sm"><p className="font-bold">{user.name}</p><p className="text-white/60 capitalize mb-2">{user.role}</p><button className="btn2 !text-white !border-white/30" onClick={logout}>Sign out</button></div></>);
return(<div className="md:flex min-h-screen">
<header className="md:hidden sticky top-0 z-40 bg-teal text-white flex items-center gap-3 px-3 py-2"><button aria-label="Open menu" className="text-2xl leading-none p-2 -ml-2" onClick={()=>setOpen(true)}>☰</button><span className="font-head font-extrabold text-xl">Bench</span><span className="ml-auto text-xs text-white/70 capitalize">{user.role}</span></header>
{open&&<div className="md:hidden fixed inset-0 z-50 flex"><aside className="w-64 max-w-[80%] bg-teal text-white p-3 overflow-y-auto">{side}</aside><div className="flex-1 bg-black/50" onClick={()=>setOpen(false)}/></div>}
<aside className="hidden md:block md:w-56 bg-teal text-white md:sticky md:top-0 md:h-screen p-3 shrink-0 overflow-y-auto">{side}</aside>
<main className="flex-1 p-4 md:p-8 min-w-0">{children}</main></div>)}
function Guard(){const {role,page}:any=useParams();const {user}=useAuth();if(!user)return <Navigate to="/login"/>;if(role!==user.role)return <Navigate to={`/${user.role}/dashboard`}/>;const C=PAGES[role]?.[page];return <Shell nav={NAV[role]}>{C?<C key={page}/>:<p>Page not found.</p>}</Shell>}
function Login(){const {login,user}=useAuth();const [e,setE]=useState('');const [p,setP]=useState('');const [err,setErr]=useState('');
if(user)return <Navigate to={`/${user.role}/dashboard`}/>;
const go=async()=>{if(!e||!p)return setErr('Enter your email and password');try{const r=await api.get('/users',{params:{email:e,password:p}});r.data[0]?login(r.data[0]):setErr('Email or password is wrong')}catch{setErr('Cannot reach the API. Run npm run api.')}};
const demo=[['Admin','admin@bench.com','admin123'],['Reception','reception@bench.com','desk123'],['Technician','tech@bench.com','tech123'],['Customer','customer@bench.com','cust123']];
return(<div className="min-h-screen grid place-items-center p-4"><div className="tagcard w-full max-w-sm !p-6 !pt-10"><h1 className="text-3xl font-extrabold mb-1">Drop it off. Track it live.</h1><p className="text-sm text-teal/70 mb-4">Sign in to the Bench service desk.</p>
<input className="inp mb-2" placeholder="Email" value={e} onChange={x=>setE(x.target.value)}/><input className="inp mb-2" type="password" placeholder="Password" value={p} onChange={x=>setP(x.target.value)} onKeyDown={x=>x.key==='Enter'&&go()}/>
{err&&<p className="text-sm text-red-600 mb-2">{err}</p>}<button className="btn w-full" onClick={go}>Sign in</button>
<div className="mt-4 pt-3 border-t border-dashed border-teal/30"><p className="text-xs text-teal/60 mb-2">Demo accounts</p><div className="flex flex-wrap gap-1">{demo.map(d=><button key={d[0]} className="btn2" onClick={()=>{setE(d[1]);setP(d[2])}}>{d[0]}</button>)}</div></div></div></div>)}
export default function App(){const [user,setUser]=useState<any>(()=>{try{return JSON.parse(localStorage.getItem('u')||'null')}catch{return null}});
const login=(u:any)=>{localStorage.setItem('u',JSON.stringify(u));setUser(u)};const logout=()=>{localStorage.removeItem('u');setUser(null)};
return(<AuthCtx.Provider value={{user,login,logout}}><Routes><Route path="/login" element={<Login/>}/><Route path="/:role/:page" element={<Guard/>}/><Route path="*" element={<Navigate to={user?`/${user.role}/dashboard`:'/login'}/>}/></Routes></AuthCtx.Provider>)}

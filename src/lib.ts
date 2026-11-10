import axios from 'axios';import {createContext,useContext,useEffect,useState,useCallback} from 'react';
export const api=axios.create({baseURL:import.meta.env.PROD?'/api':'http://localhost:3001'});
export const STATUSES=['Device Received','Job Card Created','Diagnosis','Technician Assigned','Repair in Progress','Quality Check','Ready for Pickup','Delivered'];
export const EXTRA=['Cancelled','Repair Failed'];
export const ALL=[...STATUSES,...EXTRA];
export const DONE=['Delivered','Cancelled','Repair Failed'];
export const canMove=(from:string,to:string)=>{if(DONE.includes(from)||from===to)return false;if(EXTRA.includes(to))return true;return STATUSES.indexOf(to)===STATUSES.indexOf(from)+1};
export const nextOptions=(s:string)=>ALL.filter(x=>canMove(s,x));
export const money=(n:any)=>'₹'+Number(n||0).toLocaleString('en-IN');
export const today=()=>new Date().toISOString().slice(0,10);
export const log=(text:string)=>api.post('/activities',{text,at:new Date().toISOString()}).catch(()=>{});
export function useList(res:string){const [data,setData]=useState<any[]>([]);const [loading,setL]=useState(true);const [error,setE]=useState('');
const reload=useCallback(()=>{setL(true);api.get('/'+res).then(r=>{setData(r.data);setE('')}).catch(e=>setE(e.message)).finally(()=>setL(false))},[res]);
useEffect(()=>{reload()},[reload]);return {data,loading,error,reload}}
export const comb=(...l:any[])=>({loading:l.some(x=>x.loading),error:l.find(x=>x.error)?.error||''});
export const AuthCtx=createContext<any>(null);export const useAuth=()=>useContext(AuthCtx);

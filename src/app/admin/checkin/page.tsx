"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, ScanLine, Search, ShieldCheck, ShieldX } from "lucide-react";
import { Avatar, Badge, Button, Card, PageHeader, Ring, beep, cn } from "@/components/ui";
import { checkinFeed, members } from "@/lib/demo";
type ScanResult = { name: string; ok: boolean; why?: string };
type DetectedCode = { rawValue: string };
type Detector = { detect: (source: HTMLVideoElement) => Promise<DetectedCode[]> };

export default function CheckIn() {
  const [q,setQ]=useState(""); const [result,setResult]=useState<ScanResult|null>(null);
  const [log,setLog]=useState(checkinFeed); const [cameraOn,setCameraOn]=useState(false);
  const [cameraError,setCameraError]=useState(""); const [scanning,setScanning]=useState(false);
  const videoRef=useRef<HTMLVideoElement>(null); const streamRef=useRef<MediaStream|null>(null);
  const timerRef=useRef<ReturnType<typeof setInterval>|null>(null); const busyRef=useRef(false);
  const inside=38;
  function check(name:string,status:string) {
    const blocked=["Frozen","Cancelled","Blacklisted","Expired"].includes(status);
    const expired=status==="Expiring" && name==="Karan Singh"; const ok=!blocked&&!expired;
    const why=blocked?`Membership ${status.toLowerCase()}`:expired?"Plan expired 3 days ago":undefined;
    setResult({name,ok,why}); setLog(l=>[{name,t:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),ok,why},...l].slice(0,8)); beep(ok);
  }
  function handleQr(raw:string) {
    let token=raw.trim();
    try { const parsed=new URL(token); token=parsed.searchParams.get("member")??parsed.searchParams.get("id")??token; } catch {}
    token=token.replace(/^rackhouse:/i,"").trim();
    const member=members.find(m=>m.id.toLowerCase()===token.toLowerCase()||m.name.toLowerCase()===token.toLowerCase());
    if(member) check(member.name,member.status);
    else { setResult({name:"Unrecognised QR code",ok:false,why:"No matching member was found. Search by name or scan a valid member QR."}); beep(false); }
  }
  async function startCamera() {
    setCameraError("");
    const Ctor=(window as Window & {BarcodeDetector?:new(options?:{formats:string[]})=>Detector}).BarcodeDetector;
    if(!navigator.mediaDevices?.getUserMedia) { setCameraError("This browser cannot access a camera. Use manual member search instead."); return; }
    if(!Ctor) { setCameraError("Live QR detection is not supported by this browser. Try the latest Chrome or use manual search."); return; }
    try {
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
      streamRef.current=stream;
      if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();}
      setCameraOn(true);setScanning(true);const detector=new Ctor({formats:["qr_code"]});
      timerRef.current=setInterval(async()=>{
        if(busyRef.current||!videoRef.current||videoRef.current.readyState<2)return;
        busyRef.current=true;
        try { const codes=await detector.detect(videoRef.current);if(codes.length&&codes[0].rawValue){handleQr(codes[0].rawValue);stopCamera();} }
        catch { setCameraError("Could not read this QR. Keep it inside the frame or use manual search."); }
        finally { busyRef.current=false; }
      },300);
    } catch(error) { setCameraError(error instanceof Error&&error.name==="NotAllowedError"?"Camera permission was denied. Allow camera access in browser settings.":"Could not start the camera. Check that another app is not using it.");stopCamera(); }
  }
  function stopCamera() {
    if(timerRef.current)clearInterval(timerRef.current);timerRef.current=null;
    streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;
    if(videoRef.current)videoRef.current.srcObject=null;setCameraOn(false);setScanning(false);
  }
  useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current);streamRef.current?.getTracks().forEach(t=>t.stop());},[]);
  const matches=q?members.filter(m=>m.name.toLowerCase().includes(q.toLowerCase())||m.id.toLowerCase().includes(q.toLowerCase())).slice(0,5):[];
  return <>
    <PageHeader title="Front desk scanner" sub="Scan a valid member QR with your camera, or search and select a member manually."/>
    <div className="grid min-w-0 gap-4 xl:grid-cols-3">
      <Card className="min-w-0 p-4 sm:p-5 xl:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold">QR check-in</h2><p className="mt-1 text-sm text-muted">Keep the QR inside the camera frame.</p></div><Button onClick={cameraOn?stopCamera:startCamera}>{cameraOn?<CameraOff size={17}/>:<Camera size={17}/>} {cameraOn?"Stop camera":"Start camera"}</Button></div>
        {cameraOn?<div className="relative mt-4 overflow-hidden rounded-xl bg-black"><video ref={videoRef} muted playsInline className="aspect-video w-full object-cover"/><div className="pointer-events-none absolute inset-[14%] rounded-xl border-2 border-mat shadow-[0_0_0_999px_rgba(0,0,0,.18)]"/><div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">{scanning?"Camera active · looking for QR":"Camera paused"}</div></div>:<div className="mt-4 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-line p-5 text-center"><ScanLine size={32} className="text-plate"/><p className="mt-2 font-semibold">Scanner ready</p><p className="mt-1 max-w-sm text-sm text-muted">Start the camera to read a valid QR code. Camera access requires HTTPS and browser permission.</p></div>}
        {cameraError&&<p role="status" className="mt-3 rounded-lg border border-ember/40 bg-ember/10 p-3 text-sm">{cameraError}</p>}
        <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line"/><span>OR SEARCH MANUALLY</span><span className="h-px flex-1 bg-line"/></div>
        <label className="text-sm font-semibold" htmlFor="member-search">Member name or ID</label><div className="mt-2 flex gap-2"><div className="relative min-w-0 flex-1"><Search size={17} className="absolute left-3 top-3.5 text-muted"/><input id="member-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search member…" className="w-full rounded-md border border-line bg-transparent py-3 pl-9 pr-3"/></div><Button variant="ghost" disabled={!matches.length} onClick={()=>{if(matches[0]){check(matches[0].name,matches[0].status);setQ("");}}}>Check first</Button></div>
        {matches.length>0&&<ul className="mt-3 space-y-2">{matches.map(m=><li key={m.id}><button onClick={()=>{check(m.name,m.status);setQ("");}} className="flex w-full items-center gap-3 rounded-lg border border-line p-3 text-left hover:bg-ink/5 active:scale-[0.99]"><Avatar name={m.name}/><span className="min-w-0 flex-1"><span className="block font-semibold">{m.name}</span><span className="block text-xs text-muted">ID {m.id}</span></span><Badge>{m.status}</Badge></button></li>)}</ul>}
        <div className="mt-5 min-h-[130px]">{result?<motion.div key={result.name+log.length} initial={{scale:.98,opacity:0}} animate={{scale:1,opacity:1}} className={cn("flex flex-wrap items-center gap-4 rounded-xl border-2 p-4 sm:p-6",result.ok?"border-mat bg-mat/10":"border-ember bg-ember/10")}>{result.ok?<ShieldCheck size={30} className="text-mat"/>:<ShieldX size={30} className="text-ember"/>}<div className="min-w-0 flex-1"><p className="text-xl font-bold">{result.name}</p><p className="text-sm text-muted">{result.ok?"Entry allowed. Have a great session.":result.why}</p></div><Badge tone={result.ok?"ok":"warn"}>{result.ok?"Allowed":"Denied"}</Badge></motion.div>:<p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">Waiting for a scan or manual selection.</p>}</div>
      </Card>
      <div className="space-y-4"><Card className="flex items-center gap-4 p-5"><Ring pct={inside} size={88} stroke={9} color="rgb(var(--mat))"><span className="text-xl font-bold">{inside}</span></Ring><div><p className="font-bold">Inside now</p><p className="text-sm text-muted">Demo count · Capacity 100</p></div></Card><Card className="p-5"><h2 className="mb-3 font-bold">Recent scans</h2><ul className="space-y-3 text-sm">{log.map((c,i)=><li key={c.name+c.t+i} className="flex items-center justify-between gap-2"><span className="min-w-0 font-semibold">{c.name}</span><Badge tone={c.ok?"ok":"warn"}>{c.ok?c.t:"Denied"}</Badge></li>)}</ul></Card></div>
    </div>
  </>;
}

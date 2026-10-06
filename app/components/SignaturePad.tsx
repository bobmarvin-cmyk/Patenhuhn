'use client'
import {useEffect,useRef,useState} from 'react'

export default function SignaturePad({value,onSave}:{value?:string;onSave:(dataUrl:string)=>void}){
 const canvasRef=useRef<HTMLCanvasElement|null>(null);const drawing=useRef(false);const[last,setLast]=useState<{x:number,y:number}|null>(null)
 useEffect(()=>{const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;ctx.clearRect(0,0,c.width,c.height);if(value){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,c.width,c.height);img.src=value}},[value])
 function pos(e:React.PointerEvent<HTMLCanvasElement>){const r=e.currentTarget.getBoundingClientRect();return{x:(e.clientX-r.left)*(e.currentTarget.width/r.width),y:(e.clientY-r.top)*(e.currentTarget.height/r.height)}}
 function down(e:React.PointerEvent<HTMLCanvasElement>){drawing.current=true;const p=pos(e);setLast(p);e.currentTarget.setPointerCapture(e.pointerId)}
 function move(e:React.PointerEvent<HTMLCanvasElement>){if(!drawing.current||!last)return;const p=pos(e);const ctx=e.currentTarget.getContext('2d');if(ctx){ctx.lineWidth=3;ctx.lineCap='round';ctx.strokeStyle='#1f2d22';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke()}setLast(p)}
 function up(){drawing.current=false;setLast(null)}
 function clear(){const c=canvasRef.current;if(c)c.getContext('2d')?.clearRect(0,0,c.width,c.height);onSave('')}
 function save(){const c=canvasRef.current;if(c)onSave(c.toDataURL('image/png'))}
 return <div className="signaturePad"><canvas ref={canvasRef} width={700} height={180} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}/><div className="signatureActions"><button type="button" className="btn secondary" onClick={clear}>Löschen</button><button type="button" className="btn" onClick={save}>Unterschrift speichern</button></div></div>
}

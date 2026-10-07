import {NextResponse} from 'next/server'
export async function POST(){
  return NextResponse.json({ok:false,message:'E-Mail-Versand erfolgt in dieser Version über mailto.'},{status:410})
}

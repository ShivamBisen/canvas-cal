import React, { useEffect, useRef, useState } from "react"
import { SWATCHES } from "@/constants"

import { ColorSwatch,Group } from "@mantine/core"
import axios from "axios"


interface Response {
    expression: string
    result: string
    assign: boolean
}

interface GeneratedResult{
    expression: string
    result: string
}


const Screen = () => {

    const canvasref = useRef<HTMLCanvasElement>(null)
    const [isdrawing, setIsdrawing] = useState(false)
    const [color, setColor] = useState('rgb(255,255,255)')
    const [reset,setReset] = useState(false)
    const [result,setResult] = useState<GeneratedResult[]>([])
    const [dictOfVar,setDictOfVar] = useState<{[key:string]:number}>({})



    useEffect(()=>{
        if(reset){
            resetCanvas();
            setReset(false)
        }
    },[reset])

    useEffect(()=>{
        const canvas = canvasref.current;
        if(canvas){
            const ctx = canvas.getContext('2d')
            if(ctx){
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 5;
            }
        }
    },[])

    const resetCanvas = () =>{
        const canvas = canvasref.current;
        if(canvas){
            const ctx = canvas.getContext('2d')
            if(ctx){
                ctx.clearRect(0,0,canvas.width,canvas.height)
            }
        }
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasref.current;
        if(canvas){
            canvas.style.background = 'black'
            const ctx = canvas.getContext('2d')
            if(ctx){
                ctx.beginPath()
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                setIsdrawing(true)
            }

        }
    }
    const stopDrawing =() => {
        setIsdrawing(false)
    }
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!isdrawing){
            return;

        }
        const canvas = canvasref.current;
        if(canvas){
            const ctx = canvas.getContext('2d')
            if(ctx){
                ctx.strokeStyle = color
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                ctx.stroke()
            }
        }
    }

    const SendData = async () => {
        const canvas = canvasref.current;
        if(canvas){
            const response = await axios.post('http://localhost:5000/api/evaluate',{
                data:{
                    image: canvas.toDataURL('image/png'),
                    dictOfVar: dictOfVar
                }
            })

            const responseData = await response.data as Response

            console.log(responseData)
        }
    }

  return (
    <div className="flex flex-col items-center">
        <div className="  flex gap-5">
            <button 
                onClick={()=>{setReset(true)}}
                className="bg-red-500 text-white p-2 z-20 rounded-md"

            >
                Reset
            </button>
            <Group className="z-20">
                {SWATCHES.map((swatchcolor:string)=>{
                    return(
                        <ColorSwatch
                            key={swatchcolor}
                            color={swatchcolor}
                            onClick={()=>{setColor(swatchcolor)}}
                        />
                    )
                })}

            </Group>
            <button
                onClick={SendData}
                className="bg-red-500 z-20 text-white p-2 rounded-md"
                
            >
                Calculate
            </button>
        </div>
        <canvas
            ref={canvasref}
            id="canvas"
            className="absolute top-0 left-0 w-full h-full "
            onMouseDown={startDrawing}
            onMouseOut={stopDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
              
        >

        </canvas>
    </div>
  )
}

export default Screen
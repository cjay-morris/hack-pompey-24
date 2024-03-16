import { useEffect, useState } from 'react'
import React from 'react'

interface PreviewButtonProps {
    track: string
    className?: string
}

const PreviewButton = ({track, className}: PreviewButtonProps) => {
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        console.log(track)
        const audio = new Audio(track)
        audio.load()
        if (isPlaying) {
            void audio.play()
        } else {
            audio.pause()
        }
        return () => {
            audio.pause()
        }
    }, [isPlaying])
    
    return (
        <div className={className}>
            <button
                className={!isPlaying ? "bg-green-500 text-white p-2 rounded-full" : "bg-red-500 text-white p-2 rounded-full"}
                onClick={() => {
                    setIsPlaying(!isPlaying)
                }
            }
            >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                    
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>

                )}
            </button>
        </div>
    )
}

export default PreviewButton

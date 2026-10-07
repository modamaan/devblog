"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { levels } from "./levels"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"

export default function FlexboxFroggy() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [currentLevelId, setCurrentLevelId] = useState(1)
    const [userCss, setUserCss] = useState("")
    const [isCorrect, setIsCorrect] = useState(false)

    const level = levels.find(l => l.id === currentLevelId) || levels[0]

    // Load saved level on mount
    useEffect(() => {
        const savedLevel = localStorage.getItem("froggy_level")
        if (savedLevel) {
            setCurrentLevelId(parseInt(savedLevel))
        }
        setIsLoaded(true)
    }, [])

    // Reset user CSS and check correctness when level or input changes
    useEffect(() => {
        if (!isLoaded) return;
        
        // Very basic validation logic for MVP (ignoring whitespace/semicolons)
        const normalizeCss = (css: string) => css.replace(/\s+/g, '').replace(/;$/, '').toLowerCase();
        
        if (normalizeCss(userCss) === normalizeCss(level.expectedCss)) {
            setIsCorrect(true)
        } else {
            setIsCorrect(false)
        }

    }, [userCss, level, isLoaded])

    const handleNextLevel = () => {
        if (currentLevelId < levels.length) {
            const nextLevel = currentLevelId + 1;
            setCurrentLevelId(nextLevel)
            setUserCss("")
            localStorage.setItem("froggy_level", nextLevel.toString())
        } else {
            alert("You beat all the levels! More coming soon.")
        }
    }

    if (!isLoaded) return null;

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)] bg-neutral-900 text-neutral-100 font-sans">
            
            {/* Editor Pane (Left) */}
            <div className="w-full lg:w-1/3 flex flex-col border-r border-neutral-700 bg-neutral-800">
                
                {/* Header */}
                <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/games" className="text-neutral-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                            Flexbox Froggy
                        </h1>
                    </div>
                    <div className="text-sm font-medium bg-neutral-700 px-3 py-1 rounded-full text-neutral-300">
                        Level {level.id} of {levels.length}
                    </div>
                </div>

                {/* Instructions */}
                <div className="p-6 flex-grow overflow-y-auto">
                    <div 
                        className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&_code]:bg-neutral-700 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded text-[15px]"
                        dangerouslySetInnerHTML={{ __html: level.instructions }}
                    />
                    
                    {/* CSS Editor */}
                    <div className="mt-8 bg-neutral-950 rounded-lg border border-neutral-700 overflow-hidden font-mono text-sm shadow-inner">
                        <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-700 text-neutral-500 flex justify-between">
                            <span>style.css</span>
                        </div>
                        <div className="p-4 text-neutral-300 leading-loose">
                            <div className="text-blue-400">#pond <span className="text-neutral-300">{`{`}</span></div>
                            <div className="pl-4">display: <span className="text-orange-300">flex</span>;</div>
                            <div className="flex pl-4 focus-within:ring-1 ring-indigo-500 rounded my-1 bg-neutral-900">
                                <textarea
                                    value={userCss}
                                    onChange={(e) => setUserCss(e.target.value)}
                                    className="w-full bg-transparent outline-none resize-none min-h-[60px] text-orange-300 p-1"
                                    placeholder="/* type your css here */"
                                    spellCheck={false}
                                />
                            </div>
                            <div>{`}`}</div>
                        </div>
                    </div>
                    
                    {/* Next Button */}
                    <div className="mt-6">
                        <Button 
                            onClick={handleNextLevel}
                            disabled={!isCorrect}
                            className={`w-full py-6 text-lg font-bold rounded-lg shadow-lg transition-all ${
                                isCorrect 
                                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                                : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                            }`}
                        >
                            Next Level
                        </Button>
                    </div>
                </div>
            </div>

            {/* Visualizer Pane (Right) */}
            <div className="w-full lg:w-2/3 bg-[#1F2937] relative flex flex-col p-6 overflow-hidden min-h-[500px]">
                {/* Background Pond Area */}
                <div className="absolute inset-4 rounded-xl border-4 border-emerald-900/30 bg-blue-500/20 shadow-inner"></div>
                
                {/* The Game Board */}
                <div className="relative w-full h-full flex-grow flex">
                    
                    {/* Target Lilypads (Rendered with Expected CSS) */}
                    <div 
                        className="absolute inset-0 flex p-4 pointer-events-none"
                        style={{
                            // We parse the expected CSS into an object for React
                            ...parseCssString(level.expectedCss)
                        }}
                    >
                        {level.id === 1 && <div className="w-24 h-24 rounded-full bg-green-800/40 border-2 border-green-700/50 flex-shrink-0 animate-pulse"></div>}
                        {level.id === 2 && (
                            <>
                                <div className="w-24 h-24 rounded-full bg-green-800/40 border-2 border-green-700/50 flex-shrink-0"></div>
                                <div className="w-24 h-24 rounded-full bg-yellow-800/40 border-2 border-yellow-700/50 flex-shrink-0"></div>
                            </>
                        )}
                        {level.id === 3 && (
                            <>
                                <div className="w-24 h-24 rounded-full bg-green-800/40 border-2 border-green-700/50 flex-shrink-0"></div>
                                <div className="w-24 h-24 rounded-full bg-yellow-800/40 border-2 border-yellow-700/50 flex-shrink-0"></div>
                                <div className="w-24 h-24 rounded-full bg-red-800/40 border-2 border-red-700/50 flex-shrink-0"></div>
                            </>
                        )}
                    </div>

                    {/* Frogs (Rendered with User CSS) */}
                    <div 
                        className="absolute inset-0 flex p-4 transition-all duration-500 ease-in-out z-10"
                        style={{
                            // Safely apply the user's CSS
                            ...parseCssString(userCss)
                        }}
                    >
                        {level.id === 1 && <Frog color="green" />}
                        {level.id === 2 && <><Frog color="green" /><Frog color="yellow" /></>}
                        {level.id === 3 && <><Frog color="green" /><Frog color="yellow" /><Frog color="red" /></>}
                    </div>

                </div>
            </div>
        </div>
    )
}

// Helper component for Frogs
function Frog({ color }: { color: 'green' | 'yellow' | 'red' }) {
    const colorClasses = {
        green: 'bg-green-500',
        yellow: 'bg-yellow-400',
        red: 'bg-red-500'
    };
    
    return (
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg flex-shrink-0 transform transition-transform hover:scale-110 ${colorClasses[color]}`}>
            🐸
        </div>
    )
}

// Helper to convert "justify-content: center;" string into React style object { justifyContent: 'center' }
function parseCssString(css: string): React.CSSProperties {
    const style: any = {};
    if (!css) return style;
    
    css.split(';').forEach(rule => {
        const [property, value] = rule.split(':');
        if (property && value) {
            const formattedProperty = property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            style[formattedProperty] = value.trim();
        }
    });
    return style;
}

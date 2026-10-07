import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, ArrowRight } from "lucide-react"

export default function GamesPage() {
    return (
        <div className="mx-auto max-w-6xl py-12 px-4 sm:px-6 min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl flex items-center gap-3">
                    <Gamepad2 className="h-10 w-10 text-indigo-600" />
                    Dev Arcade
                </h1>
                <p className="mt-4 text-lg text-neutral-600 max-w-2xl">
                    Take a break from reading and sharpen your developer skills with our interactive mini-games. 
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                
                {/* Flexbox Froggy Card */}
                <Link href="/games/flexbox-froggy" className="group block h-full">
                    <Card className="h-full border-2 border-transparent bg-white shadow-sm transition-all duration-200 hover:border-indigo-600 hover:shadow-md dark:bg-neutral-950">
                        <div className="h-48 w-full bg-emerald-500 rounded-t-lg flex items-center justify-center overflow-hidden relative">
                            {/* Simple visual representation for the card */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🐸</span>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                                Flexbox Froggy
                                <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                            </CardTitle>
                            <CardDescription className="text-sm">
                                A game for learning CSS flexbox. Guide the frogs to their lilypads using CSS properties!
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                {/* Coming Soon Placeholder */}
                <Card className="h-full border border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center text-center p-8 opacity-60">
                    <div className="p-4 bg-neutral-200 rounded-full mb-4">
                        <Gamepad2 className="h-8 w-8 text-neutral-400" />
                    </div>
                    <CardTitle className="text-lg text-neutral-500">More Games Coming Soon</CardTitle>
                    <CardDescription>We're building more tech challenges.</CardDescription>
                </Card>

            </div>
        </div>
    )
}

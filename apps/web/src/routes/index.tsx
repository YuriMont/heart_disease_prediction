import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
    component: Home,
})

function Home(){
    return (
        <div className="text-red-500 w-full h-full flex items-center justify-center">
            Hello world!
        </div>
    )
}
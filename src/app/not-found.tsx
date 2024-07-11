export default function NotFound(){
    return <div className="flex h-screen items-center justify-center bg-white">
        <div>
            <div className="flex items-center space-x-5 text-[10rem] font-bold text-tertiary">
                <span>4</span>
                <img className="mx-auto h-32" src="/images/logo.svg" alt="EcoVision" />
                <span>4</span>
            </div>
            <div className="mt-20 flex justify-center">
                <a
                    href="/"
                    className="rounded-full bg-neutral-200 px-7 py-4 text-center text-[0.825rem] uppercase tracking-wider transition duration-150 ease-in hover:bg-neutral-300"
                >
                    Voltar à página inicial
                </a>
            </div>
        </div>
    </div>
}
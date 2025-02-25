export default function NotFound(){
    return <div className="flex h-screen items-center justify-center bg-white">
        <div>
            <div className="flex items-center space-x-5 text-[10rem] font-bold text-tertiary">
                <img className="mx-auto h-32" src="/assets/images/logo_maua.svg" alt="Instituto de ecnologia Mauá" />
                <span>4</span>
                <span>0</span>
                <span>4</span>
            </div>
            <div className="mt-20 flex justify-center">
                <a
                    href="/"
                    className="rounded-full bg-neutral-200 px-7 py-4 text-center text-[0.825rem] uppercase tracking-wider transition duration-150 ease-in hover:bg-neutral-300"
                >
                    Voltar à Página Inicial
                </a>
            </div>
        </div>
    </div>
}
import Head from 'next/head';

const Reservatorios = () => {
    const reservatories = [
        {
            name: 'Reservatório 1',
            data_counter: 250,
            volume: 500,
            height: 10,
        },
        {
            name: 'Reservatório 2',
            data_counter: 150,
            volume: 300,
            height: 8,
        },
        // Add more static reservatories as needed
    ];
    const measureUnit = 'L';
    const dangerValue = 300;

    return (
        <div>
            <Head>
                <title>Reservatórios</title>
            </Head>

            <div className="sticky top-0 z-40 w-full bg-neutral-50/30 p-8 backdrop-blur-sm dark:bg-[#121212]/30">
                <div
                    className="flex w-fit min-w-52 items-center space-x-14 rounded-full bg-white px-7 py-2 dark:bg-neutral-900"
                    style={{ boxShadow: '8px 8px 25px rgba(0,0,0,.2)' }}
                >
                    <div>
                        <div className="flex items-center space-x-1">
                            <p className="text-[0.8rem] font-medium tracking-wide text-neutral-900 dark:text-neutral-100">
                                Nível de Risco
                            </p>
                            <div className="group relative">
                                <p className="cursor-default leading-none text-neutral-900 dark:text-neutral-100">🛈</p>
                                <div
                                    className="animate-fade-in absolute left-4 top-4 z-40 hidden w-max border border-neutral-300 bg-white px-2 py-1 group-hover:block dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    <p className="text-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                                        Defina o nível de risco de volume dos reservatórios.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 flex space-x-1">
                            <input
                                value={dangerValue}
                                readOnly
                                className="w-[5.5rem] rounded-full bg-transparent px-2.5 text-neutral-900 shadow-inner-light focus:outline-none focus:ring-2 focus:ring-primary dark:border-neutral-600 dark:text-neutral-100 dark:shadow-inner-dark"
                                type="text"
                            />
                            <p className="w-[1rem] text-nowrap font-medium text-neutral-900 dark:text-neutral-100">
                                {measureUnit}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[0.8rem] font-medium tracking-wide text-neutral-900 dark:text-neutral-100">
                            Unidade de Medida
                        </p>
                        <div className="mt-1 flex space-x-2">
                            <button className={`w-12 py-0.5 text-sm font-medium water-button-pressed`}>L</button>
                            <button className={`w-12 py-0.5 text-sm font-medium water-button-unpressed`}>m³</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="3xl:grid-cols-6 grid grid-cols-3 justify-items-center gap-y-10 xl:grid-cols-4 2xl:grid-cols-5">
                {reservatories.map((reservatory, index) => (
                    <div
                        key={index}
                        className="animate-fade-in relative flex size-48 flex-col justify-end overflow-hidden rounded-xl bg-white dark:bg-neutral-900 dark:shadow-black"
                        style={{ boxShadow: '8px 8px 25px rgba(0,0,0,.2)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full" height="20">
                            <g className="transition-transform duration-500">
                                <path
                                    className={`water ${reservatory.data_counter <= dangerValue ? 'fill-red' : 'fill-cyan'}`}
                                    d="M420 20.0047C441.5 19.6047 458.8 17.5047 471.1 15.5047C484.5 13.3047 497.6 10.3047 498.4 10.1047C514 6.50474 518 4.70474 528.5 2.70474C535.6 1.40474 546.4 -0.0952561 560 0.00474393V20.0047H420ZM420 20.0047C398.5 19.6047 381.2 17.5047 368.9 15.5047C355.5 13.3047 342.4 10.3047 341.6 10.1047C326 6.50474 322 4.70474 311.5 2.70474C304.3 1.40474 293.6 -0.0952561 280 0.00474393V20.0047H420ZM140 20.0047C118.5 19.6047 101.2 17.5047 88.9 15.5047C75.5 13.3047 62.4 10.3047 61.6 10.1047C46 6.50474 42 4.70474 31.5 2.70474C24.3 1.40474 13.6 -0.0952561 0 0.00474393V20.0047H140ZM140 20.0047C161.5 19.6047 178.8 17.5047 191.1 15.5047C204.5 13.3047 217.6 10.3047 218.4 10.1047C234 6.50474 238 4.70474 248.5 2.70474C255.6 1.40474 266.4 -0.0952561 280 0.00474393V20.0047H140Z"
                                />
                            </g>
                        </svg>
                        <div
                            className={`w-full ${reservatory.data_counter <= dangerValue ? 'bg-red' : 'bg-cyan'}`}
                            style={{ height: `${Math.floor((11 * reservatory.data_counter) / reservatory.volume)}rem` }}
                        ></div>
                        <div className="absolute bottom-0 right-0 hidden h-[4.15rem] w-full bg-black/60 dark:block"></div>
                        <div
                            className={`absolute bottom-2 right-3 text-right dark:shadow-black dark:drop-shadow-2xl ${reservatory.data_counter <= dangerValue ? 'text-red' : 'text-cyan'}`}
                        >
                            <h1 className="text-3xl font-semibold">
                                {Number(reservatory.data_counter).toFixed(2)}<span className="text-base font-medium opacity-75">/{Number(reservatory.volume).toFixed(2)}{measureUnit}</span>
                            </h1>
                            <p className="text-sm font-medium">{reservatory.name}</p>
                        </div>
                        {reservatory.data_counter <= dangerValue && (
                            <div className="absolute right-12 top-2.5 p-1">
                                <svg
                                    className="mb-1 animate-pulse text-red-950 dark:text-red-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M2.725 21q-.275 0-.5-.137t-.35-.363q-.125-.225-.137-.488t.137-.512l9.25-16q.15-.25.388-.375T12 3q.25 0 .488.125t.387.375l9.25 16q.15.25.138.513t-.138.487q-.125.225-.35.363t-.5.137zM12 18q.425 0 .713-.288T13 17q0-.425-.288-.712T12 16q-.425 0-.712.288T11 17q0 .425.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10q-.425 0-.712.288T11 11v3q0 .425.288.713T12 15"
                                    />
                                </svg>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 flex h-[11rem] flex-col justify-between *:border-black *:dark:border-white dark:*:border-white">
                            <div className="relative w-3 border">
                                <div className="absolute -top-2 left-3.5 text-xs font-medium dark:text-white">Máx</div>
                            </div>
                            <div className="w-2 border"></div>
                            <div className="w-2 border"></div>
                            <div className="w-2 border"></div>
                            <div className="w-2 border"></div>
                            <div className="w-3 border"></div>
                            <div className="w-2 border"></div>
                            <div className="w-2 border"></div>
                            <div className="w-2 border"></div>
                            <div className="w-2 border"></div>
                            <div className="w-0 border"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reservatorios;

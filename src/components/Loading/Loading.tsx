import React from 'react'

type Props = {
    state: 'loading' | 'error' | 'success',
    message?: string
    overlay?: boolean
}

export default function Loading({ state, message, overlay }: Props) {
    return (
        <div className={`flex items-center justify-center w-full h-screen ${overlay ? 'overlay' : ''}`}>
            <div
                className={`transition-all duration-500 ease-in-out ${overlay ? 'bg-white shadow-lg' : ''} h-[250px] w-[400px] rounded-xl p-6 flex items-center justify-center`}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${state === 'loading' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'} pointer-events-none`}
                    >
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
                        <span className="ml-4 text-blue-600">{message || "Loading..."}</span>
                    </div>
                    <div
                        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${state === 'error' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'} pointer-events-none text-red-600`}
                    >
                        <svg className="border-4 rounded-full h-20 w-20 mb-2 animate-fadeIn" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className='text-xl'>{message || "Something went wrong."}</span>
                    </div>
                    <div
                        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${state === 'success' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'} pointer-events-none text-green-600`}
                    >
                        <svg className="border-4 rounded-full h-20 w-20 mb-2 animate-fadeIn" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className='text-xl'>{message || "Success!"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const EmptyCard = ({ imgSrc, message, buttonText, onClick }) => {
    return (
        <div className="bg-gray-100/50 flex flex-col items-center justify-center mt-6 py-20 rounded-lg">
            <img src={imgSrc} alt="No notes" className="w-auto h-36" />
        
        <p className="w-2/3 text-xs md:text-[14px] text-slate-900 text-center">
            {message}
        </p>

        {
            buttonText && (
                <button className="btn-small px-6 py-2 mt-7" onClick={onClick}>
                    {buttonText}
                </button>
            )
        }
        
        </div>
    )
}

export default EmptyCard
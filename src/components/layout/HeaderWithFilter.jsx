import { useState } from "react";
import { IoCloseOutline, IoFilterOutline } from "react-icons/io5";
import { POLL_TYPE } from "../../../utils/data";


const HeaderWithFilter = ({
    title,
    filterType,
    setFilterType,
    stats = []
}) => {

    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="sm:text-xl font-medium text-black">{title}</h2>

                <button
                    className={`flex items-center gap-3 text-sm text-white 
                    bg-primary px-4 py-2
                    ${open ? 'rounded-t-lg' : 'rounded-lg'}`}
                    onClick={() => {
                        if (filterType !== '') setFilterType('');
                        setOpen(!open);
                    }}
                >
                    {filterType !== '' ? (
                        <>
                            <IoCloseOutline className="text-lg" />
                            Clear
                        </>
                    ) : (
                        <>
                            <IoFilterOutline className="text-lg" />
                            Filter
                        </>
                    )}
                </button>
            </div>

            {open && (
                <div className="flex flex-wrap gap-4 bg-primary p-4 rounded-l-lg rounded-b-lg">
                    {[{ label: 'All', value: '' }, ...POLL_TYPE].map((type) => {
                        // If type has value (not "All"), check if it has stats
                        if (type.value && stats.length > 0) {
                            const stat = stats.find(s => s.type === type.value);
                            // Only show filter if there are polls of this type
                            if (!stat || stat.count === 0) {
                                return null;
                            }
                        }

                        return (
                            <button
                                key={type.value}
                                className={`text-[12px] px-4 py-1 rounded-lg text-nowrap
                            ${filterType === type.value ? 'bg-sky-900 text-white' : 'text-[12px] bg-sky-100'}
                            `}
                                onClick={() => {
                                    setFilterType(type.value);
                                }}
                            >
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default HeaderWithFilter
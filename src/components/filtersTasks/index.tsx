import { ReactNode } from "react";

interface FilterTaskProps{
    onClick: () => void;
    filter: string;
    icon: ReactNode;
    nameFilter: string;
}

export function FilterTasks({ onClick, filter, icon, nameFilter}: FilterTaskProps){
    return(
        <div
            onClick={onClick}
            className={`flex items-center gap-2 rounded-xl px-2.5 md:px-4 py-2 transition-all duration-300 hover:scale-103 cursor-pointer ${filter}`}
        >
            {icon}
            <span className="text-white">{nameFilter}</span>
        </div>
    )
}
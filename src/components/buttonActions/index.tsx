import { ReactNode } from "react";

interface ButtonActionsProps{
    title: string;
    disabled: boolean;
    onClick: () => void;
    children: ReactNode;
}

export function ButtonActions({ title, disabled, onClick, children }: ButtonActionsProps){
    return(
        <button
            type="button"
            title={title}
            disabled={disabled}
            className={`transition-transform duration-300 hover:scale-120 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={onClick}
            >
            {children}
        </button>
    )
}
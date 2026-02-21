
interface ButtonModalProps{
    title: string;
    style: string;
    onClick: () => void;
}

export function ButtonModal({ title, style, onClick }: ButtonModalProps){
    return(
        <button
            type="button"
            className={`px-4 py-1.5 rounded text-white cursor-pointer duration-300 ${style}`}
            onClick={onClick}
        >
            {title}
        </button>
    )
}
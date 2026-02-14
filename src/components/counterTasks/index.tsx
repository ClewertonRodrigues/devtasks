
interface CounterTasks{
    counter: number;
    color: string;
    nameCounter: string;
}

export function CounterTasks({ counter, color, nameCounter }: CounterTasks){
    return(
        <div className="flex flex-col items-center">
            <strong className={`text-xl ${color}`}>{counter}</strong>
            <span className="text-white text-sm">{nameCounter}</span>
        </div>
    )
}
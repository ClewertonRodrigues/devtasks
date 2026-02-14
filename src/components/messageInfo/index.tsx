import { ReactNode } from "react";

interface MessageInfoProps{
    icon: ReactNode;
    message: string;
}

export function MessageInfo({ icon, message }: MessageInfoProps) {
  return (
    <>
      <div className="bg-white/20 p-4 rounded-full">
        {icon}
      </div>
      <p className="text-lg text-gray-400 my-2">{message}</p>
    </>
  );
}

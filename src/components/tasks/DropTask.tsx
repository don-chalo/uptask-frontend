import { useDroppable } from "@dnd-kit/core";


type DropTask = {
    status: string
}

function DropTask({ status }: DropTask) {

    const { isOver, setNodeRef} = useDroppable({
        id: status
    });

    const style = { opacity: isOver ? 0.4 : undefined };

    return (
        <div className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500"
            ref={setNodeRef}
            style={style}>
            Soltar acá
        </div>
    );
}

export default DropTask;

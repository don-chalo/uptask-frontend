import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type NoteDetailProps = {
    note: Note;
};

function NoteDetail({ note }: NoteDetailProps) {
    const { data, isLoading } = useAuth();
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get("view-task")!;
    const projectId = params.projectId!;

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            toast.success("Nota eliminada exitosamente");
            queryClient.invalidateQueries({ queryKey: ["task", taskId] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    if (isLoading) return <p>Cargando...</p>;

    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    {note.content} por: <span className="font-bold">{note.createdBy.name}</span>
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(note.createdAt)}
                </p>
            </div>
            { 
                canDelete &&
                <button className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
                    type="button"
                    onClick={() => mutate({ noteId: note._id, taskId, projectId })}>
                    Eliminar
                </button>
            }
        </div>
    );
}

export default NoteDetail;

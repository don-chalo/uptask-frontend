import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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

    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            toast.success("Nota eliminada exitosamente");
            queryClient.invalidateQueries({ queryKey: ["task", taskId] });
            setLoading(false);
        },
        onError: (error) => {
            toast.error(error.message);
            setLoading(false);
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
                <button className={`bg-red-400 p-2 text-xs text-white font-bold transition-colors ${loading ? 'opacity-40 cursor-default' : 'hover:bg-red-500 cursor-pointer'}`}
                    disabled={loading}
                    type="button"
                    onClick={
                        () => {
                            setLoading(true); 
                            mutate({ noteId: note._id, taskId, projectId });
                        }
                    }>
                    Eliminar
                </button>
            }
        </div>
    );
}

export default NoteDetail;

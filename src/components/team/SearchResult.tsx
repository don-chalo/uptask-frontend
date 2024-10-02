import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { addMemberToProject } from "@/api/TeamAPI";
import { TeamMember } from "@/types/index";

type SearchResultProps = {
    reset: () => void,
    user: TeamMember
}

function SearchResult({ user, reset }: SearchResultProps) {

     const params = useParams();
     const projectId = params.projectId!;

     const navigate = useNavigate();

     const queryCliente = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: addMemberToProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Miembro añadido exitosamente");
            reset();
            navigate(location.pathname, { replace: true });
            queryCliente.invalidateQueries({ queryKey: ['projectTeam', projectId] });
        }
    });

    const handleClick = () => {
        const data = {
            projectId,
            id: user._id
        };
        mutate(data);
    }

    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado: </p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
                    onClick={handleClick}>
                    Agregar al proyecto
                </button>
            </div>
        </>
    );
}

export default SearchResult;
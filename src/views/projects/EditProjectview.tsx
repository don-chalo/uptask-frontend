import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/proyects/EditProjectForm";

function EditProjectview() {
    const params = useParams();
    const projectId = params.projectId!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    });

    if (isLoading) {
        return <p>Cargando...</p>
    }

    if (isError) {
        return <Navigate to={"/404"}></Navigate>
    }

    if (data) {
        return (
            <EditProjectForm data={data} projectId={projectId} />
        );
    }
}

export default EditProjectview;

import { toast } from "sonner";

const handleError = (error) => {
    console.error(error);
    if (error?.message === "Network Error") {
       return toast.error("Server is down. Please try again in a moment.", {id: "Network Error"});
    }
    if(error) {
        return toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.response?.data || error?.message || "An unexpected error occurred", {
            id: "response-Error"
        });
    }
}

export default handleError;
import prismadb from "@/lib/prismadb";
import { CompanionForm } from "./components/companion-form";
// import { currentUser } from "@clerk/nextjs/server";

interface CompanionIdPageProps {
    params:{
        companionId: string;
    }
}


const CampanionIdPage = async ({
    params
}: CompanionIdPageProps ) => {
    // const {userId}= currentUser();
    const companion = await prismadb.companion.findUnique({
        where: {
            id: params.companionId,
        },
    })

    const categories = await prismadb.category.findMany();

    return(
        <CompanionForm
            initialData={companion}
            categories={categories}
        />
    )
};

export default CampanionIdPage;
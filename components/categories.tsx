"use client";

import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';


interface CategoriesProp{
    data: Category[];
};

export const Categories =({
    data
}:CategoriesProp )=>{

    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');


    const onCLick = (id: string | undefined) => {
        const query = {
            categoryId: id || undefined,
        };

        const url = qs.stringifyUrl({
            url: window.location.href,
            query,
        },{skipEmptyString: true, skipNull: true});
        
        router.push(url);
    }

    return(
        <div className='w-full overflow-x-auto space-x-2 flex p-1'>
            <button
            onClick={()=>onCLick(undefined)}
            className={cn(`
                flex
                items-center
                text-center
                text-xs
                md:text-sm
                px-2
                md:px-4
                py-2
                md:py-3
                rounded-md
                bg-primary/10
                hover-opacity-75
                transition
            `,
                !categoryId? "bg-primary/25" : "bg-primary/10"
            )}>
                Newest
            </button>
            {data.map((items)=>(
                <button
                onClick={()=>onCLick(items.id)}
                key={items.id}
                className={cn(`
                    flex
                    items-center
                    text-center
                    text-xs
                    md:text-sm
                    px-2
                    md:px-4
                    py-2
                    md:py-3
                    rounded-md
                    bg-primary/10
                    hover-opacity-75
                    transition
                `,
                    items.id === categoryId ? 'bg-primary/25' : 'bg-primary/10' 
                )}>
                    {items.name}
                </button>
            ))}
        </div>
    )
}

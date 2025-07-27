import {Category as CategoryType} from "@/types/board";
import AddTaskButton from "@/components/board/task/AddTaskButton";
import Task from "@/components/board/task/Task";

interface CategoryProps {
    category: CategoryType
}

const Category = ({category}: CategoryProps) => {
    return (
        <div className="shrink-0 border-transparent border-1
                          text-secondary rounded-md bg-gray-700
                          w-[250px] min-h-[150px] h-fit max-h-full
                          flex flex-col px-2 items-center gap-2 pb-4 overflow-y-auto"
        >
            <h1 className="pt-1">{category.title}</h1>
            {category.tasks.map((task) => (
                <Task key={task.id} task={task} />
            ))}
            <AddTaskButton boardId={category.boardId} categoryId={category.id} />
        </div>
    );
};

export default Category;
import {Task as TaskType} from "@/types/board";

interface TaskProps {
    task: TaskType
}

const Task = ({task}: TaskProps) => {
    return (
        <div className="shrink-0 border-transparent border-1 border-dashed
                    bg-card w-[210px] h-[110px] rounded-md flex flex-col items-center justify-center"
        >
            <p
                className="text-center truncate overflow-hidden whitespace-pre-wrap text-sm w-full"
            >
                {task.description}
            </p>
        </div>
    );
};

export default Task;
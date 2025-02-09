export const Progress = ({ value, className = "" }) => {
    return (
        <div
            className={`relative w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
        >
            <div
                className="h-full bg-lime-500 transition-all duration-300"
                style={{ width: `${value}%` }}
            />
        </div>
    );
};

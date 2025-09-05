const TextForm = ({ typeData, setTypeData }: any) => {
    return (
        <div className="w-full mb-2">
            <input
                type="text"
                placeholder="Content"
                value={typeData.textContent || ""}
                onChange={(e) => setTypeData({ ...typeData, textContent: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
            />
        </div>
    )
}

export default TextForm;
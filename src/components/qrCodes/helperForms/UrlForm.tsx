const UrlForm = ({ typeData, setTypeData }: any) => {
    return (
        <div className="w-full mb-2">
            <input
                type="text"
                placeholder="Enter URL"
                value={typeData.url || ""}
                onChange={(e) => setTypeData({ ...typeData, url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
        </div>

    )
}

export default UrlForm
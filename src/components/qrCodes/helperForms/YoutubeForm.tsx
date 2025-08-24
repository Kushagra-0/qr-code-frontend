const YoutubeForm = ({ typeData, setTypeData }: any) => {
    return (
        <input
            type="text"
            placeholder="Enter Youtube Link"
            value={typeData.youtubeLink || ""}
            onChange={(e) => setTypeData({ ...typeData, youtubeLink: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
    )
}

export default YoutubeForm;
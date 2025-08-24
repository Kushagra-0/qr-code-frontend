const EmailForm = ({ typeData, setTypeData }: any) => {
    return (
        <div className="w-full mb-2">
            <input
                type="email"
                placeholder="Email Address"
                value={typeData.email || ""}
                onChange={(e) => setTypeData({ ...typeData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
            />
            <input
                type="text"
                placeholder="Subject"
                value={typeData.emailSubject || ""}
                onChange={(e) => setTypeData({ ...typeData, emailSubject: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
            />
            <input
                type="text"
                placeholder="Body"
                value={typeData.emailBody || ""}
                onChange={(e) => setTypeData({ ...typeData, emailBody: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
            />
        </div>
    )
}

export default EmailForm;
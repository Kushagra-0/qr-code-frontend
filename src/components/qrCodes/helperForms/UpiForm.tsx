const UpiForm = ({ typeData, setTypeData }: any) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-gray-700 font-semibold mb-1">UPI ID</label>
                <input
                    type="text"
                    placeholder="example@upi"
                    value={typeData.upiId || ""}
                    onChange={(e) => setTypeData({ ...typeData, upiId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">Payee Name</label>
                <input
                    type="text"
                    placeholder="John Doe"
                    value={typeData.payeeName || ""}
                    onChange={(e) => setTypeData({ ...typeData, payeeName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">Amount (INR)</label>
                <input
                    type="number"
                    placeholder="100"
                    value={typeData.amount || ""}
                    onChange={(e) =>
                        setTypeData({
                            ...typeData,
                            amount: parseFloat(e.target.value || "0").toFixed(2),
                        })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">Transaction Note</label>
                <input
                    type="text"
                    placeholder="Payment for services"
                    value={typeData.note || ""}
                    onChange={(e) => setTypeData({ ...typeData, note: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
            </div>
        </div>
    );
};

export default UpiForm;

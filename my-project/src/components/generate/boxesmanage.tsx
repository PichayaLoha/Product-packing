import { useEffect, useState } from 'react'
import Menupage from '../menupage'

interface Box {
    box_id: number;
    box_name: string;
    box_width: string;
    box_length: string;
    box_height: string;
    box_maxweight: string;
    box_amount: string;
    box_cost: string;
}

function Boxesmanage() {
    const [boxes, setBoxes] = useState<Box[]>([]);

    const [box_name, setBoxname] = useState("");
    const [box_width, setBoxwidth] = useState<string>("");
    const [box_length, setBoxlength] = useState<string>("");
    const [box_height, setheBoxheight] = useState<string>("");
    const [box_maxweight, setBoxmaxweight] = useState<string>("");
    const [box_amount, setBoxamount] = useState<string>("");
    const [box_cost, setBoxcost] = useState<string>("");
    const [box_id, setBoxid] = useState("");
    const [nameError, setNameError] = useState<string>("");

    const [isDisabled, setIsDisabled] = useState(true);
    //ed is edit zone 
    const [box_name_ed, setBoxname_ed] = useState("");
    const [box_width_ed, setBoxwidth_ed] = useState<string>("");
    const [box_length_ed, setBoxlength_ed] = useState<string>("");
    const [box_height_ed, setheBoxheight_ed] = useState<string>("");
    const [box_maxweight_ed, setBoxmaxweight_ed] = useState<string>("");
    const [box_amount_ed, setBoxamount_ed] = useState<string>("");
    const [box_cost_ed, setBoxcost_ed] = useState<string>("");
    const [box_id_ed, setBoxid_ed] = useState("");
    const [nameErrorEd, setNameErrorEd] = useState<string>("");

    const fetchOrdersAndBoxes = async (): Promise<void> => {
        try {
            const responseBoxes = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes`);

            if (!responseBoxes.ok) {
                throw new Error('Failed to fetch data');
            }
            const dataBoxes = await responseBoxes.json();
            console.log(dataBoxes.boxes);
            setBoxes(dataBoxes.boxes);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchOrdersAndBoxes(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด
    }, []);

    // Function to check for duplicate box names
    const checkDuplicateName = (name: string, currentId?: string): boolean => {
        return boxes.some(box =>
            box.box_name.toLowerCase() === name.toLowerCase() &&
            (currentId === undefined || box.box_id.toString() !== currentId)
        );
    };

    const selectupdateboxes = (boxId: number): void => {
        const selectedBox = boxes.find(({ box_id }) => box_id === boxId);
        if (!selectedBox) {
            console.error("Box not found");
            return;
        }
        else {
            setBoxname_ed(selectedBox.box_name)
            setBoxwidth_ed(selectedBox.box_width)
            setBoxlength_ed(selectedBox.box_length)
            setheBoxheight_ed(selectedBox.box_height)
            setBoxmaxweight_ed(selectedBox.box_maxweight)
            setBoxamount_ed(selectedBox.box_amount)
            setBoxcost_ed(selectedBox.box_cost)
            setBoxid_ed(selectedBox.box_id.toString())
            setNameErrorEd("");
            setIsDisabled(false);
        }
    }

    const clearAddboxes = () => {
        setBoxname("")
        setBoxwidth("")
        setBoxlength("")
        setheBoxheight("")
        setBoxmaxweight("")
        setBoxamount("")
        setBoxcost("")
        setBoxid("")
        setNameError("");
    }
    const clearUpdateboxesed = () => {
        setBoxname_ed("")
        setBoxwidth_ed("")
        setBoxlength_ed("")
        setheBoxheight_ed("")
        setBoxmaxweight_ed("")
        setBoxamount_ed("")
        setBoxid_ed("")
        setBoxcost_ed("")
        setNameErrorEd("");
        setIsDisabled(true);
    }

    const handleAddboxes = async () => {
        // Validate box name
        if (!box_name.trim()) {
            setNameError("Please enter the box name.");
            return;
        }

        // Check for duplicate box name
        if (checkDuplicateName(box_name)) {
            setNameError("The box name already exists.");
            return;
        }

        const newItem = {
            box_name,
            box_height: parseFloat(box_height),
            box_length: parseFloat(box_length),
            box_width: parseFloat(box_width),
            box_maxweight: parseFloat(box_maxweight),
            box_amount: parseInt(box_amount),
            box_cost: parseFloat(box_cost),
            box_id: parseInt(box_id)
        };
        console.log(JSON.stringify(newItem))
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            console.log(newItem)
            if (response.ok) {
                // นำทางไปยังหน้าผลลัพธ์
                alert("adding box complete");
                clearAddboxes();
                fetchOrdersAndBoxes();
            } else {
                console.error('Error adding item:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdateboxes = async () => {
        // Validate box name
        if (!box_name_ed.trim()) {
            setNameErrorEd("Please enter the box name.");
            return;
        }

        // Check for duplicate box name, excluding the current box being edited
        if (checkDuplicateName(box_name_ed, box_id_ed)) {
            setNameErrorEd("The box name already exists.");
            return;
        }

        const newItem = {
            box_name: box_name_ed,
            box_height: parseFloat(box_height_ed),
            box_length: parseFloat(box_length_ed),
            box_width: parseFloat(box_width_ed),
            box_maxweight: parseFloat(box_maxweight_ed),
            box_amount: parseInt(box_amount_ed),
            box_cost: parseFloat(box_cost_ed), // Fixed to use box_cost_ed
            // box_id: parseInt(box_id_ed)
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes/${box_id_ed}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            console.log(newItem)
            if (response.ok) {
                // นำทางไปยังหน้าผลลัพธ์
                alert("Updating box complete");
                fetchOrdersAndBoxes();
                clearUpdateboxesed();
                setIsDisabled(!isDisabled);

            } else {
                console.error('Error adding item:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteboxes = async (boxId: number): Promise<void> => {
        const confirmDelete = window.confirm("Are you sure you want to delete this box?");
        if (confirmDelete) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes/${boxId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setBoxes(prevOrders => prevOrders.filter(order => order.box_id !== boxId));
                    alert("Box has been successfully deleted.");
                } else {
                    console.error('Error deleting product:', response.statusText);
                    alert("An error occurred while deleting the box.");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // Handle box name change to validate in real-time
    const handleBoxNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setBoxname(newName);

        if (!newName.trim()) {
            setNameError("Please enter the box name.");
        } else if (checkDuplicateName(newName)) {
            setNameError("The box name already exists.");
        } else {
            setNameError("");
        }
    };

    // Handle edit box name change to validate in real-time
    const handleBoxNameEdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setBoxname_ed(newName);

        if (!newName.trim()) {
            setNameErrorEd("Please enter the box name.");
        } else if (checkDuplicateName(newName, box_id_ed)) {
            setNameErrorEd("The box name already exists.");
        } else {
            setNameErrorEd("");
        }
    };

    return (
        <div>
            <div className="grid grid-cols-12 h-screen">
                <Menupage />
                <div className="col-span-6">
                    <div className='m-7 '>
                        <div className='mb-3 flex items-center'>
                            <p className='text-2xl font-semibold'>Boxes</p>
                        </div>
                        <div className='flex justify-start'>
                            <div style={{ width: "100%" }}>
                                <div className="overflow-x-auto border rounded-xl border-slate-200">
                                    <table className="table table-zebra text-center">
                                        <thead>
                                            <tr className='bg-cyan-700 text-white text-base'>
                                                <th>Number</th>
                                                <th>Boxsize</th>
                                                <th>Box cost</th>
                                                <th>Amount</th>
                                                <th>Width</th>
                                                <th>Length</th>
                                                <th>Height</th>
                                                <th>Maxweight</th>

                                                <th></th>
                                            </tr>
                                        </thead>
                                        {boxes.length > 0 &&
                                            <tbody>
                                                {boxes.map((item, index) => (
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <td>{item.box_name}</td>
                                                        <td>{item.box_cost}</td>
                                                        <td>{item.box_amount}</td>
                                                        <td>{item.box_width}</td>
                                                        <td>{item.box_length}</td>
                                                        <td>{item.box_height}</td>
                                                        <td>{item.box_maxweight}</td>

                                                        <td>

                                                            <button className='btn btn-xs bg-orange-300' onClick={() => { selectupdateboxes(item.box_id) }}>Edit</button>

                                                            <button
                                                                className='btn btn-xs ml-5 bg-red-400'
                                                                onClick={() => handleDeleteboxes(item.box_id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
                    {/* addboxes */}
                    <div className='flex justify-center items-center m-12'>
                        <div className="card bg-base-100 w-96 shadow-xl">
                            <div className="card-body">
                                <div className="card-title justify-center"><h2 >Add new box</h2></div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Box name</span>
                                        <input
                                            type="text"
                                            placeholder="name"
                                            value={box_name}
                                            onChange={handleBoxNameChange}
                                            className={`input input-bordered input-sm w-full max-w-xs ${nameError ? 'input-error' : ''}`} />
                                        {nameError && <span className="text-xs text-red-500">{nameError}</span>}
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Width</span>
                                        <input
                                            type="text"
                                            placeholder="cm."
                                            value={box_width}
                                            onChange={(e) => setBoxwidth(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Length</span>
                                        <input
                                            type="text"
                                            placeholder="cm."
                                            value={box_length}
                                            onChange={(e) => setBoxlength(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Height</span>
                                        <input
                                            type="text"
                                            placeholder="cm."
                                            value={box_height}
                                            onChange={(e) => setheBoxheight(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Max weight</span>
                                        <input
                                            type="text"
                                            placeholder="kg."
                                            value={box_maxweight}
                                            onChange={(e) => setBoxmaxweight(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Box Price</span>
                                        <input
                                            type="text"
                                            placeholder="baht"
                                            value={box_cost}
                                            onChange={(e) => setBoxcost(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Amount</span>
                                        <input
                                            type="text"
                                            placeholder="amount"
                                            value={box_amount}
                                            onChange={(e) => setBoxamount(e.target.value)} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                </div>
                                <div className="card-actions justify-center">
                                    <button className="btn bg-green-400 btn-sm" onClick={handleAddboxes}>Add</button>

                                    <button className="btn btn-info btn-sm" onClick={clearAddboxes}>Clear</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* addboxes */}
                    {/* editboxes */}
                    <div className='flex justify-center items-center'>
                        <div className="card bg-base-100 w-96 shadow-xl">
                            <div className="card-body">
                                <div className="card-title justify-center"><h2 >Edit box detail</h2></div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Box name</span>
                                        <input
                                            type="text"
                                            placeholder="name"
                                            value={box_name_ed}
                                            onChange={handleBoxNameEdChange}
                                            disabled={isDisabled}
                                            className={`input input-bordered input-sm w-full max-w-xs ${nameErrorEd ? 'input-error' : ''}`} />
                                        {nameErrorEd && <span className="text-xs text-red-500">{nameErrorEd}</span>}
                                    </label>

                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Width</span>
                                        <input
                                            type="text"
                                            placeholder="cm."
                                            value={box_width_ed}
                                            onChange={(e) => setBoxwidth_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Length</span>
                                        <input
                                            type="text"
                                            placeholder="cm."
                                            value={box_length_ed}
                                            onChange={(e) => setBoxlength_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Height</span>
                                        <input
                                            type="text"
                                            placeholder="cm."
                                            value={box_height_ed}
                                            onChange={(e) => setheBoxheight_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Max weight</span>
                                        <input
                                            type="text"
                                            placeholder="kg."
                                            value={box_maxweight_ed}
                                            onChange={(e) => setBoxmaxweight_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Box price</span>
                                        <input
                                            type="text"
                                            placeholder="baht"
                                            value={box_cost_ed}
                                            onChange={(e) => setBoxcost_ed(e.target.value)}
                                            disabled={isDisabled} // อัปเดต state
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                    <label className="form-control w-full max-w-xs">
                                        <span className="label-text">Amount</span>
                                        <input
                                            type="text"
                                            placeholder="amount"
                                            value={box_amount_ed}
                                            onChange={(e) => setBoxamount_ed(e.target.value)} // อัปเดต state
                                            disabled={isDisabled}
                                            className="input input-bordered input-sm w-full max-w-xs" />
                                    </label>
                                </div>
                                <div className="card-actions justify-center">
                                    <button className="btn bg-green-400 btn-sm" onClick={handleUpdateboxes}>Confirm</button>

                                    <button className="btn btn-info btn-sm" onClick={clearUpdateboxesed}>Clear</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* editboxes */}
                </div>
            </div>
        </div>
    )
}

export default Boxesmanage
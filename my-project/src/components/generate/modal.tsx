import React, { useState } from "react";

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    firstname: string;
    lastname: string;
    address: string;
    postal: string;
    phone: string;
  }) => void;
}

const Modal: React.FC<MyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (firstname === "" || lastname === "" || address === "" || postal === "") {
      alert("คุณยังไม่กรอกข้อมูล");
    }
    else if (!/^\d{10}$/.test(phone)) {
      alert("เบอร์โทรศัพท์ ไม่ถูกต้อง");
    }
    else {
      onSubmit({ firstname, lastname, address, postal, phone });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">กรอกข้อมูล Customer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">FirstName</label>
            <input
              type="text"
              value={firstname}
              placeholder="ชื่อจริง"
              onChange={(e) => setFirstname(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">LastName</label>
            <input
              type="text"
              value={lastname}
              placeholder="นามสกุล"
              onChange={(e) => setLastname(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
              <input
              type="text"
              value={address}
              placeholder="ที่อยู่"
              onChange={(e) => setAddress(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Postal</label>
            <input
              type="text"
              value={postal}
              placeholder="เลขไปรษณีย์"
              onChange={(e) => setPostal(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
            <input
              type="text"
              value={phone}
              placeholder="เบอร์โทรศัพท์"
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
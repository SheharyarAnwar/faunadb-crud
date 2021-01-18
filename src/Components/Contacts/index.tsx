import React, { useState } from "react"
export interface ContactsProps {
  name: string
  phoneNumber: string
  docId: string
  onDelete: (docId: string) => void
  onUpdate: (docId: string, data: { name: string; phoneNumber: string }) => void
}

const Index: React.FC<ContactsProps> = ({
  docId,
  name,
  phoneNumber,
  onDelete,
  onUpdate,
}) => {
  const [contactName, setName] = useState<string>(name)
  const [contactPhoneNumber, setPhoneNumber] = useState<string>(phoneNumber)
  return (
    <div>
      <label htmlFor="name">Name</label>
      <input
        required
        value={contactName}
        type="text"
        onChange={e => setName(e.target.value)}
      ></input>
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        required
        value={contactPhoneNumber}
        type="text"
        onChange={e => {
          const regex = /^[0-9]*$/
          e.target.value.match(regex)
            ? setPhoneNumber(e.target.value)
            : setPhoneNumber(contactPhoneNumber)
        }}
      ></input>
      <button onClick={() => onDelete(docId)}>Delete</button>
      <button
        onClick={() =>
          onUpdate(docId, {
            name: contactName,
            phoneNumber: contactPhoneNumber,
          })
        }
      >
        Update
      </button>
    </div>
  )
}

export default Index

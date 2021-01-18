import React, { useEffect, useState } from "react"
import axios from "axios"
import Contacts from "../Components/Contacts"

interface Contact {
  phoneNumber: string
  name: string
  ref: string
}
const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [changed, setChanged] = useState<boolean>(false)
  const onDelete = async (docId: string) => {
    setLoading(true)
    axios
      .post("/.netlify/functions/delete", { docId })
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err.response)
      })
      .finally(() => {
        setLoading(false)
        setChanged(prev => !prev)
      })
  }
  const onUpdate = (docId: string, { name, phoneNumber }) => {
    setLoading(true)
    axios
      .put("/.netlify/functions/update", { docId, name, phoneNumber })
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err.response)
      })
      .finally(() => {
        setChanged(prev => !prev)
        setLoading(false)
      })
  }
  const onCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const data = {}
    for (var [key, value] of formData.entries()) {
      data[key] = value
    }
    setLoading(true)
    axios
      .post("/.netlify/functions/create", data)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err.response)
      })
      .finally(() => {
        setLoading(false)
        setChanged(prev => !prev)
      })
  }
  useEffect(() => {
    setLoading(true)
    axios
      .get("/.netlify/functions/read")
      .then(res => {
        const processedResults = res.data.results.map(val => {
          return {
            phoneNumber: val.data.phoneNumber,
            name: val.data.name,
            ref: val.ref["@ref"].id,
          }
        })
        setContacts(processedResults)
      })
      .catch(err => {
        console.log("error", err.response)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [changed])
  const renderedContacts = contacts.map(val => (
    <Contacts
      onDelete={onDelete}
      onUpdate={onUpdate}
      key={val.ref}
      docId={val.ref}
      name={val.name}
      phoneNumber={val.phoneNumber}
    />
  ))
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Add New Contact</h1>
        <form onSubmit={onCreate}>
          <label htmlFor="name">Name</label>
          <input required name="name" type="text"></input>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            placeholder="Numbers only"
            required
            name="phoneNumber"
            type="tel"
            pattern="[0,9]"
          ></input>
          <button disabled={loading} type="submit">
            Add Record
          </button>
        </form>
        <div>
          <h1>Saved Contacts</h1>
          {loading ? <p>Loading ...</p> : renderedContacts}
        </div>
      </div>
    </>
  )
}

export default Index

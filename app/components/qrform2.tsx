import {  useRef, useState } from 'react'
import { Input } from './ui/input'
import { generateVCardString } from '#app/utils/vcard.js'

import QRCode from 'react-qr-code'
import useDebounce from "#app/utils/hooks/use-debounce.js"


interface QRFormState {
  firstName: string
  lastName: string
  mobileNumber?: string
  phoneNumber?: string
  email?: string
  company?: string
  website?: string
  mobileCountryCode?: string
}

export default function QrFormA() {
  const [isQrVisible, setIsQrVisible] = useState(false)
  const [qrString, setQRString] = useState<string>('')

  const ref = useRef<HTMLDivElement>(null)

  const [formState, setFormState] = useState<QRFormState>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    phoneNumber: '',
    email: '',
    company: '',
    website: '',
    mobileCountryCode: '+91',
  })

  const onChangeChange = (e) => {
    setFormState((formState: QRFormState) => ({
      ...formState,
      [e.target.name]: e.target.value,
    }))
  }

  const [, cancel] = useDebounce(
    (e) => {
      if (formState?.firstName?.length > 0 && formState?.lastName?.length > 0) {
        setIsQrVisible(true)

        //TODO: @throttle this function call
        let stringA = generateVCardString(formState)

        stringA && setQRString(stringA)
      } else {
        setIsQrVisible(false)
      }
    },
    500,
    [formState],
  )

  return (
    <div>
      <Input name="firstName" onChange={onChangeChange} placeholder="FirstName" />
      <Input name="lastName" onChange={onChangeChange} placeholder="LastName" />
	  
	  
	  <Input name="mobileCountryCode" onChange={onChangeChange} placeholder="Country Code" />
	  <Input name="mobileNumber" onChange={onChangeChange} placeholder="Mobile Number" />
	  
	  <Input name="phoneNumber" onChange={onChangeChange} placeholder="Phone Number" />
	  <Input name="email" onChange={onChangeChange} placeholder="Email" />
	  <Input name="company" onChange={onChangeChange} placeholder="Company" />
	  <Input name="website" onChange={onChangeChange} placeholder="Website" />
	  

      {isQrVisible ? (
        <div
          style={{
            marginTop: '50px',
            padding: '20px',
            border: '2px solid blue',
          }}
          className="mx-auto flex items-center justify-center"
          ref={ref}>
          <QRCode
            id="QRCode"
            value={qrString}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      ) : null}
    </div>
  )
}

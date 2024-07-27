import {
	TelProperty,
	EmailProperty,
	OrgProperty,
	URLProperty,
	PrefParameter,
	IntegerType,
	URIType,
	TypeParameter,
	TextType,
	FNProperty,
	SpecialValueType,
	NProperty,
	VCARD,
	ValueParameter,
	ParameterValueType,
  } from "vcard4";
  
  export function generateVCardString(data: Record<string, string>) {
	let val;
  
	const {
	  firstName,
	  lastName,
	  mobileNumber,
	  phoneNumber,
	  email,
	  company,
	  website,
	  mobileCountryCode
	} = data;
  
	const fields = [];
	if (firstName !== "") {
	  const fn = new FNProperty([], new TextType(`${firstName} ${lastName}`));
  
	  const nArr = new Array(5);
	  nArr[0] = new TextType(firstName);
	  nArr[1] = new TextType(lastName);
	  const n = new NProperty([], new SpecialValueType("nproperty", nArr));
	  fields.push(fn, n);
	}
  
	if (phoneNumber && phoneNumber !== "") {
	  const tel1 = new TelProperty(
		[
		  new ValueParameter(new TextType(phoneNumber)),
		  new TypeParameter("telproperty", [
			new ParameterValueType("work"),
			new ParameterValueType("voice"),
		  ]),
		  new PrefParameter(new IntegerType(1)),
		],
		new TextType(phoneNumber)
	  );
  
	  fields.push(tel1);
	}
  
	if (mobileNumber && mobileNumber !== "" && mobileCountryCode !== "") {
	  const tel2 = new TelProperty(
		[
		  new ValueParameter(new TextType(`${mobileCountryCode}${mobileNumber}`)),
		  new TypeParameter("telproperty", [
			new ParameterValueType("home"),
			new ParameterValueType("voice"),
		  ]),
		  new PrefParameter(new IntegerType(1)),
		],
		new TextType(`${mobileCountryCode}${mobileNumber}`)
	  );
  
	  fields.push(tel2);
	}
  
	if (email && email !== "") {
	  const cardEmail = new EmailProperty(
		[new TypeParameter("emailproperty", new ParameterValueType("work"))],
		new TextType(email)
	  );
	  fields.push(cardEmail);
	}
  
	if (website && website !== "") {
	  const url = website.startsWith("http") ? website : `https://${website}`;
	  const cardWebsite = new URLProperty([], new URIType(url));
  
	  fields.push(cardWebsite);
	}
  
	if (company && company !== "") {
	  const org = new OrgProperty(
		[new TypeParameter("orgproperty", new ParameterValueType("work"))],
		new SpecialValueType("orgproperty", [new TextType(company)])
	  );
	  fields.push(org);
	}
  
	if (fields.length !== 0) {
	  const card = new VCARD(fields);
	  val = card.repr();
	} else {
	  val = "";
	}
  
	return val;
  }
  
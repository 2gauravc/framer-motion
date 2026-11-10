// Plain-English explanations the chatbot gives when a field is focused.
const help = {
  customer: ['Customer', 'The client entity this due diligence file is opened for. Usually the legal name of the company being onboarded.'],
  cddDate: ['CDD Date', 'The date the customer due diligence review was performed or last refreshed.'],
  cddStatus: ['CDD Status', 'Where the review stands: Pending, In review, Approved or Rejected.'],
  name: ['Company name', 'The registered legal name exactly as it appears on the certificate of incorporation.'],
  jurisdiction: ['Jurisdiction', 'The country or territory where the company is incorporated. It drives which regulations and risk ratings apply.'],
  status: ['Status', 'The legal standing of the company in its registry, e.g. Active, Dormant or Struck off.'],
  registrationNo: ['Registration No', 'The unique number issued by the company registry. It is used to verify the entity.'],
  companyType: ['Company Type', 'The legal form of the entity, e.g. private limited company, LLP or branch office.'],
  paidUpCapital: ['Paid Up Capital', 'The amount of share capital shareholders have actually paid in, not just committed.'],
  activity: ['Activity', 'The main business activity. Compliance uses it to judge sector risk and whether it matches the expected account usage.'],
  incorporationDate: ['Incorporation Date', 'The date the company was legally formed, from the registry extract.'],
  address: ['Address', 'The registered office address. If the operating address differs, note it separately.'],
  ubos: ['UBOs', 'Ultimate Beneficial Owners: the natural persons who ultimately own or control the company, typically with 25% or more or who exercise control by other means.'],
  'ubos.*.name': ['UBO name', 'Full legal name of the natural person who ultimately owns or controls the company.'],
  'ubos.*.nationality': ['UBO nationality', 'Nationality of the UBO. It feeds into sanctions and country-risk checks.'],
  'ubos.*.percent': ['UBO ownership %', 'The UBO\'s effective ownership, counting indirect holdings through other entities.'],
  shareholders: ['Shareholders (>10%)', 'Everyone holding more than 10% of the shares, whether a person or a company.'],
  'shareholders.*.name': ['Shareholder name', 'Legal name of the person or entity holding the shares.'],
  'shareholders.*.percent': ['Shareholding %', 'Direct shareholding. Only holders above 10% need to be listed.'],
  relatedParties: ['Related parties', 'Parent, subsidiary, affiliate and other connected entities or individuals relevant to the relationship. Optional.'],
  'relatedParties.*.name': ['Related party name', 'Name of the connected entity or person.'],
  'relatedParties.*.relationship': ['Relationship', 'How the party is connected, e.g. subsidiary, parent, director or associate.'],
  documents: ['Supporting documents', 'Optional. Upload evidence such as the certificate of incorporation or a registry extract. Files are not sent anywhere in this demo.'],
}

export function getFieldHelp(name) {
  const key = name.replace(/\.\d+\./g, '.*.')
  return help[key] ? { key, label: help[key][0], text: help[key][1] } : null
}
